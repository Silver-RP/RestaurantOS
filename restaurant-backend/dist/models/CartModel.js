"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cartSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            dishId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Dish',
                required: true,
            },
            quantity: { type: Number, required: true, default: 1 },
            price: { type: Number, required: true },
        },
    ],
    totalPrice: { type: Number, default: 0 },
}, {
    timestamps: true,
});
const Cart = mongoose_1.default.model('Cart', cartSchema);
exports.default = Cart;
