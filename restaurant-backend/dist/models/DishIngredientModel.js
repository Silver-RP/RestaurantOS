"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dishIngredientSchema = new mongoose_1.default.Schema({
    dishId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Dish', required: true },
    ingredientId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }
});
const DishIngredient = mongoose_1.default.model('DishIngredient', dishIngredientSchema);
