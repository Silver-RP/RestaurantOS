"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAddressSchema = void 0;
const zod_1 = require("zod");
const address_1 = require("../utils/address");
exports.CreateAddressSchema = zod_1.z
    .object({
    full_name: zod_1.z.string().min(1),
    phone: zod_1.z.string().regex(/^[0-9]{9,11}$/),
    province: zod_1.z.literal('TP. Hồ Chí Minh'),
    district: zod_1.z.string(),
    ward: zod_1.z.string(),
    street_address: zod_1.z.string().min(1),
    address_type: zod_1.z.enum(['HOME', 'WORK', 'other']).default('HOME'),
    is_default: zod_1.z.boolean().optional(),
    lat: zod_1.z.number(),
    lon: zod_1.z.number(),
})
    .superRefine((data, ctx) => {
    var _a;
    const { province, district, ward } = data;
    const districtData = (_a = address_1.HCM_ADDRESS_DATA[province]) === null || _a === void 0 ? void 0 : _a[district];
    if (!districtData) {
        ctx.addIssue({
            path: ['district'],
            code: zod_1.z.ZodIssueCode.custom,
            message: 'Quận/Huyện không thuộc TP. Hồ Chí Minh',
        });
    }
    else if (!districtData.wards.includes(ward)) {
        ctx.addIssue({
            path: ['ward'],
            code: zod_1.z.ZodIssueCode.custom,
            message: `Phường/Xã không thuộc ${district}`,
        });
    }
});
