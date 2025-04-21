"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    image: {
        type: String,
        required: false,
    },
    cate_type: {
        type: String,
        required: true,
        enum: ['post', 'food'],
    },
    parent_cate: {
        type: String,
        required: false,
    },
});
const Category = mongoose_1.default.model('categories', categorySchema);
exports.default = Category;
