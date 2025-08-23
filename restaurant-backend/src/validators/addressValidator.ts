import { z } from 'zod';
export const CreateAddressSchema = z.object({
  full_name: z.string().min(1),
  phone: z.string().regex(/^[0-9]{9,11}$/),
  province: z.string().min(1),
  ward: z.string().min(1),
  street_address: z.string().min(1),
  address_type: z.enum(['HOME', 'WORK', 'OTHER']).default('HOME'),
  is_default: z.boolean().optional(),
  province_code: z.string().min(1),
  district_code: z.string().min(1),
  ward_code: z.string().min(1),
});

export const UpdateAddressSchema = z.object({
  full_name: z.string().min(1).optional(),
  phone: z.string().regex(/^[0-9]{9,11}$/).optional(),
  district: z.string().min(1).optional(),
  province: z.string().min(1).optional(),
  ward: z.string().min(1).optional(),
  street_address: z.string().min(1).optional(),
  address_type: z.enum(['HOME', 'WORK', 'OTHER']).optional(),
  is_default: z.boolean().optional(),
});

export const GetAllAddressesSchema = z.object({
  user_id: z.string().min(1, 'user_id là bắt buộc'),
});
