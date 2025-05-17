"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressSearchLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.addressSearchLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 10 phút
    max: 15,
    message: {
        error: 'Bạn đang gửi quá nhiều yêu cầu. Vui lòng thử lại sau vài phút.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
