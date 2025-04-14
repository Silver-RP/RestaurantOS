"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.accessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Hàm để tạo JWT token
 * @param payload Dữ liệu cần lưu trữ trong token
 * @param secretKey Key để tạo token
 * @param expiresIn Thời gian sống của token
 * @returns JWT token
 */
const accessToken = (payload, secretKey, expires = "2h") => {
    return jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: expires });
};
exports.accessToken = accessToken;
const refreshToken = (payload, secretKey, expires = "7d") => {
    return jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: expires });
};
exports.refreshToken = refreshToken;
