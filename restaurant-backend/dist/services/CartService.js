"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DishModel_1 = require("../models/DishModel");
const CartModel_1 = __importDefault(require("../models/CartModel"));
class CartService {
    static getCartItems(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                throw new Error('Invalid userId');
            }
            // tôi muốn lấy ra tên category của dish
            const cart = yield CartModel_1.default.findOne({ userId }).populate({
                path: 'items.dishId',
                populate: {
                    path: 'categories',
                    model: 'categories',
                    select: 'Cate_name Cate_slug',
                },
            });
            if (!cart) {
                throw new Error('Cart not found');
            }
            return cart;
        });
    }
    static AddItemToCart(userId, dishId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(dishId)) {
                throw new Error('Invalid dishId');
            }
            if (quantity <= 0) {
                throw new Error('Quantity must be greater than 0');
            }
            // check status khác available thì không cho thêm vào giỏ hàng
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                let cart = yield CartModel_1.default.findOne({ userId }).session(session);
                if (!cart) {
                    cart = new CartModel_1.default({
                        userId: new mongoose_1.default.Types.ObjectId(userId),
                        items: [],
                        totalPrice: 0,
                        status: 'pending',
                    });
                }
                const dish = yield DishModel_1.Dish.findById(dishId).session(session);
                if (!dish) {
                    throw new Error('Dish does not exist');
                }
                if (dish.countInStock <= 0) {
                    throw new Error('Dish is out of stock');
                }
                if (dish.status !== 'available') {
                    throw new Error('Dish is not available');
                }
                const existingItem = cart.items.find((item) => item.dishId.toString() === dishId);
                const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;
                if (newQuantity > dish.countInStock) {
                    throw new Error(`Adding more exceeds available stock`);
                }
                if (existingItem) {
                    existingItem.quantity = newQuantity;
                }
                else {
                    cart.items.push({
                        dishId: new mongoose_1.default.Types.ObjectId(dishId),
                        quantity,
                        price: dish.discount_price == null ? dish.price : dish.discount_price,
                    });
                }
                yield cart.save({ session });
                yield session.commitTransaction();
                const populatedCart = yield CartModel_1.default.findById(cart._id).populate('items.dishId').exec();
                return populatedCart;
            }
            catch (error) {
                yield session.abortTransaction();
                throw error;
            }
            finally {
                session.endSession();
            }
        });
    }
    static UpdateCart(userId, dishId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(dishId)) {
                throw new Error('Invalid dishId');
            }
            const cart = yield CartModel_1.default.findOne({ userId });
            if (!cart) {
                throw new Error('Cart not found');
            }
            const dish = yield DishModel_1.Dish.findById(dishId);
            if (!dish) {
                throw new Error('Dish does not exist');
            }
            const existingItem = cart.items.find((item) => item.dishId.toString() === dishId);
            if (existingItem) {
                const newQuantity = quantity;
                if (newQuantity > dish.countInStock) {
                    throw new Error('Adding more exceeds available stock');
                }
                if (newQuantity > 0) {
                    existingItem.quantity = newQuantity;
                }
                else {
                    cart.items = cart.items.filter((item) => item.dishId.toString() !== dishId);
                }
            }
            else {
                cart.items.push({
                    dishId: new mongoose_1.default.Types.ObjectId(dishId),
                    quantity,
                    price: dish.price,
                });
            }
            // Cập nhật lại tổng tiền
            cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            yield cart.save();
            return cart;
        });
    }
    static DeleteCartItem(userId, dishId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(dishId)) {
                throw new Error('Invalid dishId');
            }
            const cart = yield CartModel_1.default.findOne({ userId });
            if (!cart) {
                throw new Error('Cart not found');
            }
            if (cart.items.length === 0) {
                throw new Error('Cart is already empty');
            }
            const itemIndex = cart.items.findIndex((item) => item.dishId.toString() === dishId);
            if (itemIndex === -1) {
                throw new Error('Item not found in cart');
            }
            cart.items.splice(itemIndex, 1);
            cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            yield cart.save();
            return cart;
        });
    }
    static DeleteAllCart(cartId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(cartId)) {
                throw new Error('Invalid cartId');
            }
            const cart = yield CartModel_1.default.findById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }
            cart.items = [];
            cart.totalPrice = 0;
            yield cart.save();
            return cart;
        });
    }
}
exports.default = CartService;
