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
  .refine(
    (val) => {
      const today = new Date();
      const inputDate = new Date(val);
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);
      return inputDate >= today;
    },
    {
      message: 'Không được chọn ngày trong quá khứ',
    },
  );

export const timeSchema = z
  .string()
  .min(1, 'Vui lòng chọn giờ')
  .refine(
    (val) => {
      const [hour, minute] = val.split(':').map(Number);
      const totalMinutes = hour * 60 + minute;
      const minMinutes = 9 * 60;
      const maxMinutes = 21 * 60;

      return totalMinutes >= minMinutes && totalMinutes <= maxMinutes;
    },
    {
      message: 'Thời gian chỉ cho phép từ 09:00 đến 21:00',
    },
  );

export const peopleSchema = z.coerce
  .number()
  .min(1, 'Phải có ít nhất 1 người')
  .max(30, 'Không được vượt quá 30 người');

  export const reservationSchema = z.object({
    full_name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    number_of_people: peopleSchema,
    date: dateSchema,
    time: timeSchema,
    note: z.string().optional(),
  });

export const CateTypeEnum = z.enum(['dish', 'drink']);
export const createCategorySchema = z.object({
  Cate_name: z.string().min(1, 'Tên danh mục không được để trống'),
  Cate_slug: z.string().min(1, 'Slug không được để trống'),
  Cate_type: CateTypeEnum,
  parentCate: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string().min(1, 'ID là bắt buộc'),
});

export const createUserSchema = z
  .object({
    username: z.string().min(1, 'Tên người dùng là bắt buộc'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(6, 'Xác nhận mật khẩu là bắt buộc'),
    phone: z.string().regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ'),
    birthday: z
      .string()
      .min(1, 'Vui lòng chọn ngày sinh')
      .refine((val) => new Date(val) <= new Date(), {
        message: 'Ngày sinh không được ở tương lai',
      }),
    gender: z.enum(['Nam', 'Nữ', 'Khác']).optional().or(z.literal('')),
    status: z.enum(['active', 'inactive', 'block'], {
      required_error: 'Trạng thái là bắt buộc',
    }),
    isEmailVerified: z.enum(['true', 'false'], {
      required_error: 'Vui lòng chọn trạng thái xác minh',
    }),
    roles: z.array(z.string()).min(1, 'Phải chọn ít nhất 1 vai trò'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu xác nhận không đúng',
  });
export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const changePasswordSchema = z
  .object({
    password: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ in hoa')
      .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Phải có ít nhất 1 số')
      .regex(/[^A-Za-z0-9]/, 'Phải có ít nhất 1 ký tự đặc biệt'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword !== data.password, {
    message: 'Mật khẩu mới không được trùng mật khẩu cũ',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export const editUserSchema = z
  .object({
    username: z
      .string({ required_error: 'Tên người dùng là bắt buộc' })
      .min(1, 'Tên người dùng không được để trống'),

    email: z
      .string({ required_error: 'Email là bắt buộc' })
      .email('Email không hợp lệ'),

    password: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .max(64, 'Mật khẩu không được dài quá 64 ký tự')
      .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ in hoa')
      .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Phải có ít nhất 1 chữ số')
      .regex(/[^A-Za-z0-9]/, 'Phải có ít nhất 1 ký tự đặc biệt')
      .optional()
      .or(z.literal('')),

    confirmPassword: z.string().optional(),

    phone: z
      .string({ required_error: 'Số điện thoại là bắt buộc' })
      .regex(/^0\d{8,9}$/, 'Số điện thoại không hợp lệ'),

    birthday: z
      .string({ required_error: 'Ngày sinh là bắt buộc' })
      .refine(
        (val) => !val || !isNaN(Date.parse(val)),
        'Ngày sinh không hợp lệ',
      ),

    // option gender
    gender: z.enum(['Nam', 'Nữ', 'Khác']).optional().or(z.literal('')),

    status: z.enum(['active', 'inactive', 'block'], {
      errorMap: () => ({ message: 'Trạng thái không hợp lệ' }),
    }),

    isEmailVerified: z
      .union([z.boolean(), z.literal('true'), z.literal('false')])
      .transform((val) => val === true || val === 'true'),
    roles: z
      .array(z.string(), {
        required_error: 'Vai trò là bắt buộc',
      })
      .min(1, 'Phải chọn ít nhất một vai trò'),
  })
  .refine(
    (data) => {
      if (data.password && data.password.trim() !== '') {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      path: ['confirmPassword'],
      message: 'Mật khẩu xác nhận không khớp',
    },
  );

export type EditUserFormValues = z.infer<typeof editUserSchema>;
