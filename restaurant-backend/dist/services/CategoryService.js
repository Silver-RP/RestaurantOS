'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const CategoryModel_1 = __importDefault(require('../models/CategoryModel'));
const DishModel_1 = require('../models/DishModel');
class CategoryService {
  // async GetAllCategory(req: Request, res: Response): Promise<any> {
  //   try {
  //     const categories = await Category.find();
  //     if (categories.length === 0) {
  //       return res.status(404).json({ message: "No categories found!" });
  //     }
  //     return res.status(200).json(categories);
  //   } catch (error) {
  //     return res.status(500).json(error);
  //   }
  // }
  GetAllCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;
        const totalCategories = yield CategoryModel_1.default.countDocuments();
        const categories = yield CategoryModel_1.default
          .find()
          .skip(skip)
          .limit(limitNumber);
        if (categories.length === 0) {
          return res.status(404).json({ message: 'No categories found!' });
        }
        const categoriesWithCount = yield Promise.all(
          categories.map((category) =>
            __awaiter(this, void 0, void 0, function* () {
              const foodCount = yield DishModel_1.Dish.countDocuments({
                categories: category._id,
              });
              return Object.assign(Object.assign({}, category.toObject()), {
                foodCount,
              });
            }),
          ),
        );
        return res.status(200).json({
          total: totalCategories,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(totalCategories / limitNumber),
          data: categoriesWithCount, // dùng data mới
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred', error });
      }
    });
  }
  AddCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { name, image, classify, sub } = req.body;
        const existingCategory = yield CategoryModel_1.default.findOne({
          name,
        });
        if (existingCategory) {
          return res.status(400).json({ message: 'Category already exiting!' });
        }
        const newCategory = new CategoryModel_1.default({
          name,
          image,
          classify,
          sub,
        });
        yield newCategory.save();
        return res.status(201).json({ message: 'Created successfully!' });
      } catch (error) {
        res.status(500).json(error);
      }
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
      } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
      }
    });
  }
  UpdateCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { id } = req.params;
        const { name, image, classify, sub } = req.body;
        const category = yield CategoryModel_1.default.findByIdAndUpdate(
          id,
          { name, image, classify, sub },
          { new: true, runValidators: true },
        );
        if (!category) {
          return res.status(404).json({ message: 'Category not found!' });
        }
        return res.status(200).json({ message: 'Updated successfully!' });
      } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error });
      }
    });
  }
  DeleteCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { id } = req.params;
        const hasSub = yield CategoryModel_1.default.findOne({ sub: id });
        if (hasSub) {
          return res
            .status(400)
            .json({ message: 'Cannot delete category with subcategories!' });
        }
        const DeleteCategory =
          yield CategoryModel_1.default.findByIdAndDelete(id);
        if (!DeleteCategory) {
          return res.status(404).json({ message: 'Category not found!' });
        }
        return res.status(200).json({ message: 'Deleted successfully!' });
      } catch (error) {
        return res.status(500).json(error);
      }
    });
  }
  sortData(model_1, fieldName_1) {
    return __awaiter(
      this,
      arguments,
      void 0,
      function* (model, fieldName, order = 'asc') {
        const sortOrder = order === 'asc' ? 1 : -1;
        const data = yield model.find().sort({ [fieldName]: sortOrder });
        return data;
      },
    );
  }
}
exports.default = new CategoryService();
