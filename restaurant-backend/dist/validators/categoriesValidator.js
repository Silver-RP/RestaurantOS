"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryQuerySchema = exports.updateCategorySchema = exports.createCategorySchema = exports.categorySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.categorySchema = zod_1.default.object({
    Cate_name: zod_1.default.string().min(1, 'Tên danh mục là bắt buộc'),
    Cate_slug: zod_1.default.string().min(1, 'Slug là bắt buộc'),
    Cate_type: zod_1.default.enum(['dish', 'drink'], {
        required_error: 'Loại danh mục là bắt buộc',
    }),
    parentCate: zod_1.default.string().optional().nullable(),
});
exports.createCategorySchema = exports.categorySchema;
exports.updateCategorySchema = exports.categorySchema.partial().extend({
    id: zod_1.default.string().min(1, 'ID là bắt buộc'),
});
exports.categoryQuerySchema = zod_1.default.object({
    page: zod_1.default
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1))
        .refine((val) => !isNaN(val), {
        message: 'Page phải là một số',
    }),
    limit: zod_1.default
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10))
        .refine((val) => !isNaN(val), {
        message: 'Limit phải là một số',
    }),
    search: zod_1.default.string().optional(),
});
