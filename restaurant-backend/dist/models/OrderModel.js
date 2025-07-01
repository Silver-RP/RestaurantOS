"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const OrderSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    cashier_order_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Order',
        default: null,
    },
    address_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Address', required: true },
    payment_method: {
        type: String,
        enum: ['CASH', 'BANKING', 'VNPAY', 'MOMO'],
        required: true,
    },
    delivery_type: {
        type: String,
        enum: ['DELIVERY', 'PICKUP'],
        required: true,
    },
    delivery_status: {
        type: String,
        enum: [
            'PENDING_PICKUP',
            'PICKED_UP',
            'IN_TRANSIT',
            'DELIVERED',
            'DELIVERY_FAILED',
            'RETURN_REQUESTED',
            'RETURNED',
            'CANCELLED',
        ],
        default: 'PENDING_PICKUP',
    },
    status: {
        type: String,
        enum: ['PENDING', 'PREPARING', 'SHIPPING', 'COMPLETED', 'CANCELLED', 'RETURNED'],
        default: 'PENDING',
    },
    shipping_fee: { type: Number, required: true, default: 0 },
    vat_amount: { type: Number, required: true, default: 0 },
    items_price: { type: Number, required: true, default: 0 },
    total_price: { type: Number, default: 0 },
    total_quantity: { type: Number, required: true, default: 0 },
    is_paid: { type: Boolean, default: false },
    paid_at: { type: Date, default: null },
    note: { type: String, default: null },
    cancelled_reason: { type: String, default: null },
    cancelled_at: { type: Date, default: null },
    returned_at: { type: Date, default: null },
    delivered_at: { type: Date, default: null },
    order_type: { type: String, enum: ['DINE_IN', 'ONLINE'], required: true },
    delivery_time_type: {
        type: String,
        enum: ['ASAP', 'SCHEDULED'],
        required: true,
    },
    scheduled_time: {
        type: Date,
        default: null,
    },
}, { timestamps: true });
OrderSchema.plugin(mongoose_paginate_v2_1.default);
exports.Order = (0, mongoose_1.model)('Order', OrderSchema);
