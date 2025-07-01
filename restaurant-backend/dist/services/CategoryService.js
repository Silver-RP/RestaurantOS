"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CategoryModel_1 = __importDefault(require("../models/CategoryModel"));
const DishModel_1 = require("../models/DishModel");
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
class CategoryService {
    GetAllCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10 } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                const skip = (pageNumber - 1) * limitNumber;
                const totalCategories = yield CategoryModel_1.default.countDocuments();
                const categories = yield CategoryModel_1.default.find().skip(skip).limit(limitNumber);
                if (categories.length === 0) {
                    return res.status(404).json({ message: 'No categories found!' });
                }
                const categoriesWithCount = yield Promise.all(categories.map((category) => __awaiter(this, void 0, void 0, function* () {
                    const foodCount = yield DishModel_1.Dish.countDocuments({
                        categories: category._id,
                    });
                    return Object.assign(Object.assign({}, category.toObject()), { foodCount });
                })));
                return res.status(200).json({
                    total: totalCategories,
                    page: pageNumber,
                    limit: limitNumber,
                    totalPages: Math.ceil(totalCategories / limitNumber),
                    data: categoriesWithCount, // dùng data mới
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'An error occurred', error });
            }
        });
    }
    AddCategory(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Cate_name, Cate_slug, Cate_type, parentCate } = req.body;
            const type = Cate_type === null || Cate_type === void 0 ? void 0 : Cate_type.trim().toLowerCase();
            if (!['dish', 'drink'].includes(type)) {
                throw new Error('Cate_type không hợp lệ!');
            }
            const existingCategory = yield CategoryModel_1.default.findOne({ Cate_name });
            if (existingCategory) {
                throw new Error('Tên danh mục đã tồn tại!');
            }
            let imageUrl = '';
            if (req.file) {
                const streamUpload = () => {
                    return new Promise((resolve, reject) => {
                        const stream = cloudinary_1.v2.uploader.upload_stream({
                            folder: 'categories',
                            resource_type: 'image',
                        }, (error, result) => {
                            if (result)
                                resolve(result.secure_url);
                            else
                                reject(error);
                        });
                        if (req.file) {
                            streamifier_1.default.createReadStream(req.file.buffer).pipe(stream);
                        }
                        else {
                            reject(new Error('Tệp không xác định'));
                        }
                    });
                };
                imageUrl = yield streamUpload();
            }
            const newCategory = new CategoryModel_1.default({
                Cate_name,
                Cate_slug,
                Cate_type: type,
                Cate_img: imageUrl,
                parentCate,
            });
            yield newCategory.save();
            return { message: 'Tạo thành công!' };
        });
    }
    GetCategoryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const category = yield CategoryModel_1.default.findById(id);
                if (!category) {
                    return res.status(404).json({ message: 'Category not found!' });
                }
                return res.status(200).json(category);
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error', error });
            }
        });
    }
    UpdateCategory(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { Cate_name, Cate_slug, Cate_type, parentCate } = req.body;
            const type = Cate_type === null || Cate_type === void 0 ? void 0 : Cate_type.trim().toLowerCase();
            if (!['dish', 'drink'].includes(type)) {
                throw new Error('Cate_type không hợp lệ!');
            }
            let imageUrl = '';
            if (req.file) {
                const streamUpload = () => {
                    return new Promise((resolve, reject) => {
                        const stream = cloudinary_1.v2.uploader.upload_stream({
                            folder: 'categories',
                            resource_type: 'image',
                        }, (error, result) => {
                            if (result)
                                resolve(result.secure_url);
                            else
                                reject(error);
                        });
                        if (req.file) {
                            streamifier_1.default.createReadStream(req.file.buffer).pipe(stream);
                        }
                        else {
                            reject(new Error('File is undefined'));
                        }
                    });
                };
                imageUrl = yield streamUpload();
            }
            const updatedData = {
                Cate_name,
                Cate_slug,
                Cate_type: type,
                parentCate,
            };
            if (imageUrl) {
                updatedData.Cate_img = imageUrl;
            }
            const updatedCategory = yield CategoryModel_1.default.findByIdAndUpdate(id, updatedData, {
                new: true,
                runValidators: true,
            });
            if (!updatedCategory) {
                throw new Error('Không tìm thấy danh mục để cập nhật');
            }
            return { message: 'Cập nhật danh mục thành công!' };
        });
    }
    DeleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const hasSub = yield CategoryModel_1.default.findOne({ parentCate: id });
                if (hasSub) {
                    return res.status(400).json({ message: 'Không thể xoá danh mục đang có danh mục con!' });
                }
                const hasFood = yield DishModel_1.Dish.findOne({ categories: id });
                if (hasFood) {
                    return res.status(400).json({ message: 'Không thể xoá danh mục đang có món ăn!' });
                }
                const deleted = yield CategoryModel_1.default.findByIdAndDelete(id);
                if (!deleted) {
                    return res.status(404).json({ message: 'Danh mục không tồn tại!' });
                }
                return res.status(200).json({ message: 'Đã xoá danh mục thành công!' });
            }
            catch (error) {
                return res.status(500).json({ message: 'Lỗi khi xoá danh mục', error });
            }
        });
    }
    sortData(model_1, fieldName_1) {
        return __awaiter(this, arguments, void 0, function* (model, fieldName, order = 'asc') {
            const sortOrder = order === 'asc' ? 1 : -1;
            const data = yield model.find().sort({ [fieldName]: sortOrder });
            return data;
        });
    }
}
exports.default = new CategoryService();
