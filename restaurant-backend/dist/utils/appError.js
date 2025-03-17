"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name; // Đảm bảo tên lỗi chính xác
        Error.captureStackTrace(this, this.constructor); // Lưu trữ stack trace
    }
}
exports.AppError = AppError;
