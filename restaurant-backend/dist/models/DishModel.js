"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dish = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const dishSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true, min: 0 },
    discount_price: { type: Number, min: 0 },
    description: { type: String, required: true },
    shortDescription: { type: String },
    ingredientsl: { type: String },
    status: {
        type: String,
        enum: ['hidden', 'available', 'soldout'],
        default: 'available'
    },
    views: { type: Number, default: 0 },
    ordered_count: { type: Number, default: 0 },
    rating_count: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    average_rating: { type: Number, default: 0 },
    favorites_count: { type: Number, default: 0 },
    categories: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'categories',
            required: true
        }],
    countInStock: { type: Number, default: 0, min: 0 },
}, {
    timestamps: true
});
dishSchema.index({ name: 'text' });
dishSchema.index({ slug: 1 });
dishSchema.plugin(mongoose_paginate_v2_1.default);
exports.Dish = mongoose_1.default.model("Dish", dishSchema);
