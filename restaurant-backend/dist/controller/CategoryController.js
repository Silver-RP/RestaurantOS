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
const CategoryService_1 = __importDefault(require("../services/CategoryService"));
const SearchService_1 = __importDefault(require("../services/SearchService"));
const CategoryModel_1 = __importDefault(require("../models/CategoryModel"));
const PaginateService_1 = __importDefault(require("../services/PaginateService"));
const categoriesValidator_1 = require("../validators/categoriesValidator");
class CategoryController {
    GetAllCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield CategoryService_1.default.GetAllCategory(req, res);
        });
    }
    AddCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const parsed = categoriesValidator_1.createCategorySchema.safeParse({
                    Cate_name: (_a = req.body.Cate_name) === null || _a === void 0 ? void 0 : _a.trim(),
                    Cate_slug: (_b = req.body.Cate_slug) === null || _b === void 0 ? void 0 : _b.trim(),
                    Cate_type: (_c = req.body.Cate_type) === null || _c === void 0 ? void 0 : _c.trim().toLowerCase(),
                    parentCate: req.body.parentCate,
                });
                if (!parsed.success) {
                    res.status(400).json({ message: parsed.error.errors[0].message });
                    return;
                }
                const result = yield CategoryService_1.default.AddCategory(req);
                res.status(201).json(result); // Chỉ gọi 1 lần
            }
            catch (error) {
                console.error('❌ Controller AddCategory Error:', error);
                res.status(500).json({ message: error.message || 'Internal server error' });
            }
        });
    }
    GetCategoryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield CategoryService_1.default.GetCategoryById(req, res);
        });
    }
    UpdateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const parsed = categoriesValidator_1.createCategorySchema.partial().safeParse({
                    Cate_name: (_a = req.body.Cate_name) === null || _a === void 0 ? void 0 : _a.trim(),
                    Cate_slug: (_b = req.body.Cate_slug) === null || _b === void 0 ? void 0 : _b.trim(),
                    Cate_type: (_c = req.body.Cate_type) === null || _c === void 0 ? void 0 : _c.trim().toLowerCase(),
                    parentCate: req.body.parentCate,
                });
                if (!parsed.success) {
                    res.status(400).json({ message: parsed.error.errors[0].message });
                    return;
                }
                const result = yield CategoryService_1.default.UpdateCategory(req);
                res.status(200).json(result);
            }
            catch (error) {
                console.error('❌ Controller UpdateCategory Error:', error);
                res.status(500).json({ message: error.message || 'Internal server error' });
            }
        });
    }
    DeleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield CategoryService_1.default.DeleteCategory(req, res);
        });
    }
    SearchCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield SearchService_1.default.search(CategoryModel_1.default, req.query, ['Cate_name']);
                return res.status(200).json(result);
            }
            catch (error) {
                return res.status(400).json({ message: error.message || 'An error occurred' });
            }
        });
    }
    PaginateCate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield PaginateService_1.default.paginate(CategoryModel_1.default, req, res);
        });
    }
}
exports.default = new CategoryController();
