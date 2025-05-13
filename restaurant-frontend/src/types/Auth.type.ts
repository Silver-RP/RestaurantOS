
import { z } from 'zod';
export interface GoogleDecodedToken {
  email: string;
  name: string;
  picture: string;
  sub: string;
}
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


export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất một chữ hoa')
      .regex(/[a-z]/, 'Mật khẩu phải có ít nhất một chữ thường')
      .regex(/[0-9]/, 'Mật khẩu phải có ít nhất một chữ số'),
    confirmPassword: z
      .string()
      .min(8, 'Xác nhận mật khẩu phải có ít nhất 8 ký tự'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });
// types/auth.ts
export interface DecodedToken {
    id: string;
    email: string;
    roles?: any[];
    iat: number;
    exp: number;
  }
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;