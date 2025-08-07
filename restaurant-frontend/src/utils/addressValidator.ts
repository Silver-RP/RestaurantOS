import { z } from 'zod';

export const addressTypeEnum = z.enum(['home', 'work', 'other']);

export const addressSchema = z.object({
  user_id: z.string().min(1, 'user_id là bắt buộc'),
  full_name: z.string().min(2, 'Họ tên phải từ 2 ký tự').max(50, 'Họ tên tối đa 50 ký tự'),
  phone: z.string().regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ'),
  province: z.string().min(1, 'Tỉnh/Thành phố là bắt buộc'),
  ward: z.string().min(1, 'Phường/Xã là bắt buộc'),
  street_address: z.string().min(1, 'Địa chỉ chi tiết là bắt buộc'),
  address_type: addressTypeEnum,
  is_default: z.boolean().optional(),
  lat: z.coerce.number().min(-90, 'Vĩ độ không hợp lệ').max(90, 'Vĩ độ không hợp lệ').optional(),
  lon: z.coerce.number().min(-180, 'Kinh độ không hợp lệ').max(180, 'Kinh độ không hợp lệ').optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
