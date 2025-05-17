"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Favorite = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const favoriteSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    dishId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Dish',
        required: true,
    },
}, {
    timestamps: true,
});
favoriteSchema.index({ userId: 1, dishId: 1 }, { unique: true });
exports.Favorite = mongoose_1.default.model('Favorite', favoriteSchema);
