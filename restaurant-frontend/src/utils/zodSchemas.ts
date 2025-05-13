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
  .min(1, 'Vui lòng chọn ngày')
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
  .min(1, 'Vui lòng chọn giờ')
  .refine((val) => {
    const [hour, minute] = val.split(':').map(Number);
    const totalMinutes = hour * 60 + minute;
    const minMinutes = 9 * 60;
    const maxMinutes = 21 * 60; 

    return totalMinutes >= minMinutes && totalMinutes <= maxMinutes;
  }, {
    message: 'Thời gian chỉ cho phép từ 09:00 đến 21:00',
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