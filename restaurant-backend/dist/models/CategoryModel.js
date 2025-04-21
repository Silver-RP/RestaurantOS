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
    image: {
        type: String,
        required: false,
    },
    classify: {
        type: String,
        required: true,
        enum: ['post', 'food'],
    },
    sub: {
        type: String,
        required: false,
    },
});
const Category = mongoose_1.default.model('categories', categorySchema);
exports.default = Category;
