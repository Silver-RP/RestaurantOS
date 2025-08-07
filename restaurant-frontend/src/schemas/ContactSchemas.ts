import { z } from 'zod';

export const ContactSchema = z.object({
  subject: z.string().min(1, 'Vui lòng chọn chủ đề'),
  name: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Email không hợp lệ',
    }),
  phone: z
    .string()
    .nonempty('Vui lòng nhập số điện thoại')
    .refine((val) => /^\d{10}$/.test(val), {
      message: 'Số điện thoại không hợp lệ (phải gồm đúng 10 chữ số)',
    }),
  message: z.string().min(1, 'Vui lòng nhập nội dung'),
});
