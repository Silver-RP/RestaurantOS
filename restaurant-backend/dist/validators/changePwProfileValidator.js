"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = void 0;
const zod_1 = require("zod");
exports.changePasswordSchema = zod_1.z
    .object({
    oldPassword: zod_1.z.string().min(6, 'Mật khẩu cũ phải có ít nhất 6 ký tự'),
    newPassword: zod_1.z
        .string()
        .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự')
        .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ in hoa')
        .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
        .regex(/[0-9]/, 'Phải có ít nhất 1 số')
        .regex(/[\W_]/, 'Phải có ít nhất 1 ký tự đặc biệt'),
    confirmPassword: zod_1.z.string(),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
});
