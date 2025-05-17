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
const AddressModel_1 = require("../models/AddressModel");
const DishModel_1 = require("../models/DishModel");
const CartModel_1 = __importDefault(require("../models/CartModel"));
class OrderValidator {
    static validatePlaceOrder(req) {
        const { address_id, address, payment_method, delivery_type, items, order_type, delivery_time_type, scheduled_time, note } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return { valid: false, message: 'Items are required and must be an array.' };
        }
        for (let item of items) {
            if (!item.dish_id || !item.quantity) {
                return { valid: false, message: 'Each item must have a dish_id and quantity.' };
            }
        }
        if (delivery_time_type === 'SCHEDULED' && !scheduled_time) {
            return { valid: false, message: 'Scheduled time is required for scheduled deliveries.' };
        }
        if (scheduled_time) {
            const scheduledDate = new Date(scheduled_time);
            if (isNaN(scheduledDate.getTime())) {
                return { valid: false, message: 'Invalid scheduled time format. Use ISO format (e.g. 2023-09-25T15:30:00Z).' };
            }
            if (scheduledDate < new Date()) {
                return { valid: false, message: 'Scheduled time cannot be in the past.' };
            }
        }
        if (!['CASH', 'BANKING', 'VNPAY', 'MOMO', 'CREDIT_CARD'].includes(payment_method)) {
            return { valid: false, message: 'Invalid payment method.' };
        }
        if (!['DELIVERY', 'PICKUP'].includes(delivery_type)) {
            return { valid: false, message: 'Invalid delivery type.' };
        }
        if (!['DINE_IN', 'ONLINE'].includes(order_type)) {
            return { valid: false, message: 'Invalid order type.' };
        }
        if (note && typeof note !== 'string') {
            return { valid: false, message: 'Note must be a string.' };
        }
        return { valid: true };
    }
    static validateAddress(address_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield AddressModel_1.Address.findById(address_id);
            if (!address) {
                throw { statusCode: 400, message: 'Invalid address' };
            }
            return address;
        });
    }
    static validateCartAndItems(userId, clientItems, session) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const cart = yield CartModel_1.default.findOne({ userId })
                .populate('items.dishId')
                .session(session);
            if (!cart || cart.items.length === 0) {
                throw { statusCode: 400, message: 'Cart is empty' };
            }
            let totalAmount = 0;
            const orderItems = [];
            for (const clientItem of clientItems) {
                const cartItem = cart.items.find(i => i.dishId._id.toString() === clientItem.dish_id);
                if (!cartItem) {
                    throw new Error(`Dish ${clientItem.dish_id} not found in cart`);
                }
                if (clientItem.quantity !== cartItem.quantity) {
                    throw new Error(`Mismatch quantity for ${clientItem.dishId}. Expected ${cartItem.quantity}, got ${clientItem.quantity}`);
                }
                const dish = yield DishModel_1.Dish.findById(cartItem.dishId._id);
                if (!dish) {
                    throw new Error(`Dish not found: ${cartItem.dishId._id}`);
                }
                if (dish.status !== 'available') {
                    throw new Error(`Dish "${dish.name}" is not available`);
                }
                if (cartItem.quantity > dish.countInStock) {
                    throw new Error(`Only ${dish.countInStock} portions left for "${dish.name}"`);
                }
                const unitPrice = (_a = dish.discount_price) !== null && _a !== void 0 ? _a : dish.price;
                const itemTotal = unitPrice * cartItem.quantity;
                totalAmount += itemTotal;
                orderItems.push({
                    dish_id: dish._id,
                    dish_name: dish.name,
                    unit_price: unitPrice,
                    quantity: cartItem.quantity,
                    total_amount: itemTotal,
                    note: cartItem.note || null,
                });
            }
            return { orderItems, totalAmount };
        });
    }
}
exports.default = OrderValidator;
