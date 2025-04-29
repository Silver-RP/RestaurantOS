"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    Cate_name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    Cate_slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    Cate_img: {
        type: String,
        default: null,
    },
    Cate_type: {
        type: String,
        required: true,
        enum: ['drink', 'food', 'post'],
    },
    parentCate: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});
const Category = mongoose_1.default.model('categories', categorySchema);
exports.default = Category;
