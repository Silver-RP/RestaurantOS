"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDetail = void 0;
const mongoose_1 = require("mongoose");
const OrderDetailSchema = new mongoose_1.Schema({
    order_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order', required: true },
    dish_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Dish', required: true },
    dish_name: { type: String, required: true },
    unit_price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    total_amount: { type: Number, required: true },
    note: { type: String, default: null },
}, { timestamps: true });
exports.OrderDetail = (0, mongoose_1.model)('OrderDetail', OrderDetailSchema);
