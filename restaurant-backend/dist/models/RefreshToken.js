"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const refreshTokenSchema = new mongoose_1.default.Schema({
    token: { type: String, required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    isRevoked: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
    userAgent: String,
    ipAddress: String,
    replacedByToken: { type: String },
}, { timestamps: true });
exports.default = mongoose_1.default.model('RefreshToken', refreshTokenSchema);
