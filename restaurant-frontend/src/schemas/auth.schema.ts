import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email không được để trống' })
    .min(1, 'Email không được để trống')
    .email('Email không đúng định dạng'),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .min(1, 'Vui lòng nhập mã OTP')
    .regex(/^\d+$/, 'OTP không đúng định dạng')
    .min(6, 'Mã OTP phải có ít nhất 6 chữ số')
    .max(6, 'Mã OTP không được vượt quá 6 chữ số'),
});

export type VerifyOtpSchema = z.infer<typeof verifyOtpSchema>;