'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.changePasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require('zod');
exports.registerSchema = zod_1.z
  .object({
    username: zod_1.z.string().min(1, 'Username is required'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z
      .string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number',
      ),
    confirmPassword: zod_1.z.string(),
    roles: zod_1.z.array(zod_1.z.string()).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });
exports.loginSchema = zod_1.z.object({
  email: zod_1.z.string().email('Email không hợp lệ'),
  password: zod_1.z.string().min(1, 'Password is required'),
});
exports.changePasswordSchema = zod_1.z
  .object({
    email: zod_1.z.string().email(),
    newPassword: zod_1.z.string().min(8),
    confirmPassword: zod_1.z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
