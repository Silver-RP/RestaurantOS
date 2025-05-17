"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ingredientSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    unit: { type: String, required: true },
    price_per_unit: { type: Number, required: true },
});
const Ingredient = mongoose_1.default.model('Ingredient', ingredientSchema);
