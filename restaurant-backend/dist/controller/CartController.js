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
const CartService_1 = __importDefault(require("../services/CartService"));
class CartController {
    static getCartItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user.id) === null || _a === void 0 ? void 0 : _a.toString();
                const cart = yield CartService_1.default.getCartItems(userId);
                res.status(200).json({
                    success: true,
                    message: 'Cart items retrieved successfully',
                    data: cart,
                });
            }
            catch (error) {
                console.error('Error retrieving cart items:', error);
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        });
    }
    static AddItemToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { dishId, quantity } = req.body;
                const userId = (_a = req.user.id) === null || _a === void 0 ? void 0 : _a.toString();
                if (!dishId || typeof quantity !== 'number' || quantity <= 0) {
                    res.status(400).json({
                        success: false,
                        message: 'Missing or invalid input fields. Quantity must be greater than 0',
                    });
                    return;
                }
                const addCart = yield CartService_1.default.AddItemToCart(userId, dishId, quantity);
                res.status(200).json({
                    success: true,
                    message: 'Item added to cart successfully',
                    cart: addCart,
                });
            }
            catch (error) {
                console.error('Error adding item to cart:', error);
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        });
    }
    static UpdateCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { dishId, quantity } = req.body;
                const userId = (_a = req.user.id) === null || _a === void 0 ? void 0 : _a.toString();
                if (!dishId || quantity === undefined) {
                    res.status(400).json({ success: false, message: 'Missing dishId or quantity' });
                    return;
                }
                const updatedCart = yield CartService_1.default.UpdateCart(userId, dishId, quantity);
                res.status(200).json({
                    success: true,
                    message: 'Cart updated successfully',
                    data: updatedCart,
                });
            }
            catch (error) {
                console.error('Error updating cart:', error);
                if (error instanceof Error) {
                    res.status(500).json({ success: false, message: error.message });
                }
                else {
                    res.status(500).json({ success: false, message: 'Internal Server Error' });
                }
            }
        });
    }
    static DeleteCartItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { dishId } = req.params;
                const userId = (_a = req.user.id) === null || _a === void 0 ? void 0 : _a.toString();
                if (!dishId) {
                    res.status(400).json({ success: false, message: 'Missing dishId' });
                    return;
                }
                const updatedCart = yield CartService_1.default.DeleteCartItem(userId, dishId);
                if (!updatedCart) {
                    res.status(404).json({ success: false, message: 'Cart not found' });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Cart item deleted successfully',
                    data: updatedCart,
                });
            }
            catch (error) {
                console.error('Error deleting cart item:', error);
                if (error instanceof Error) {
                    res.status(500).json({ success: false, message: error.message });
                }
                else {
                    res.status(500).json({ success: false, message: 'Internal Server Error' });
                }
            }
        });
    }
    static DeleteAllCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cartId } = req.params;
                if (!cartId) {
                    res.status(400).json({ success: false, message: 'Missing cartId' });
                    return;
                }
                const deletedCart = yield CartService_1.default.DeleteAllCart(cartId);
                if (!deletedCart) {
                    res.status(404).json({ success: false, message: 'Cart not found' });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'All items in cart deleted successfully',
                    data: deletedCart,
                });
            }
            catch (error) {
                console.error('Error deleting all items in cart:', error);
                if (error instanceof Error) {
                    res.status(500).json({ success: false, message: error.message });
                }
                else {
                    res.status(500).json({ success: false, message: 'Internal Server Error' });
                }
            }
        });
    }
}
exports.default = CartController;
