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
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
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
const CategoryService_1 = __importDefault(require('../services/CategoryService'));
const SearchService_1 = __importDefault(require('../services/SearchService'));
const CategoryModel_1 = __importDefault(require('../models/CategoryModel'));
const PaginateService_1 = __importDefault(require('../services/PaginateService'));
class CategoryController {
  GetAllCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      yield CategoryService_1.default.GetAllCategory(req, res);
    });
  }
  AddCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      yield CategoryService_1.default.AddCategory(req, res);
    });
  }
  GetCategoryById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      yield CategoryService_1.default.GetCategoryById(req, res);
    });
  }
  UpdateCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      yield CategoryService_1.default.UpdateCategory(req, res);
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
        const result = yield SearchService_1.default.search(CategoryModel_1.default, req.query, [
          'name',
        ]);
        return res.status(200).json(result);
      } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error });
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
