import { z } from 'zod';

export const nameSchema = z
  .string()
  .min(3, 'Họ tên có ít nhất 3 ký tự')
  .refine((val) => !/\d/.test(val), {
    message: 'Họ tên không được chứa số',
  });

export const phoneSchema = z
  .string()
  .regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ');

export const emailSchema = z.string().email('Email không hợp lệ');

export const dateSchema = z
  .string()
  .refine((val) => {
    const today = new Date();
    const inputDate = new Date(val);
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
    return inputDate >= today;
  }, {
    message: 'Không được chọn ngày trong quá khứ',
  });

export const timeSchema = z
  .string()
  .refine((val) => {
    const [hour] = val.split(':').map(Number);
    return hour >= 9 && hour <= 21;
  }, {
    message: 'Giờ nằm trong khoảng từ 09:00 đến 21:00',
  });

export const peopleSchema = z
  .coerce.number()
  .min(1, 'Phải có ít nhất 1 người')
  .max(30, 'Không được vượt quá 30 người');

export const reservationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  people: peopleSchema,
  date: dateSchema,
  time: timeSchema,
  note: z.string().optional(),
});

export const CateTypeEnum = z.enum(['dish', 'drink']);
export const createCategorySchema = z.object({
  Cate_name: z.string().min(1, 'Tên danh mục không được để trống'),
  Cate_slug: z.string().min(1, 'Slug không được để trống'),
  Cate_type: CateTypeEnum,
  parentCate: z.string().optional(), // Nếu có thể null, thì thêm `.nullable()` nếu dùng form JSON
});

// ✅ Schema cập nhật danh mục
export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string().min(1, 'ID là bắt buộc'),
});