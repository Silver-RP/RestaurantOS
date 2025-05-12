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
const FoodService_1 = __importDefault(require('../services/FoodService'));
const UploadImage_1 = __importDefault(require('../services/UploadImage'));
const DishModel_1 = require('../models/DishModel');
const SearchService_1 = __importDefault(require('../services/SearchService'));
const mongoose_1 = __importDefault(require('mongoose'));
class FoodController {
  createFood(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { name, price, description, categories, countInStock, rating, favorites } = req.body;
        if (
          !name ||
          !price ||
          !description ||
          !categories ||
          !countInStock ||
          !rating ||
          !favorites
        ) {
          return res.status(400).json({ message: 'All fields are required' });
        }
        const categoryId = categories.trim();
        if (!mongoose_1.default.Types.ObjectId.isValid(categoryId)) {
          return res.status(400).json({ message: 'Invalid category ID' });
        }
        const categoryObjectId = new mongoose_1.default.Types.ObjectId(categoryId);
        if (!req.file) {
          return res.status(400).json({ message: 'Image is required' });
        }
        const imageFile = req.file;
        console.log('Image file received:', imageFile);
        if (imageFile.mimetype !== 'image/jpeg' && imageFile.mimetype !== 'image/png') {
          return res.status(400).json({ message: 'Invalid file type' });
        }
        const imageUrl = yield (0, UploadImage_1.default)(req.file, 'food');
        const food = {
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          categories: categoryObjectId,
          imageUrl: imageUrl,
          countInStock: req.body.countInStock,
          rating: req.body.rating,
          favorites: req.body.favorites,
        };
        const newFood = yield FoodService_1.default.createFood(food);
        return res.status(201).json({ message: 'Food created successfully', data: newFood });
      } catch (error) {
        console.error('Error creating food:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    });
  }
  getTopFavoriteFood(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const foodFavoriteTop = yield FoodService_1.default.getTopFavoriteFood();
        res.status(200).json({
          success: true,
          data: foodFavoriteTop,
        });
        return;
      } catch (error) {
        console.error('Error fetching top favorite foods:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve top favorite foods',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        return;
      }
    });
  }
  getAllFood(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const {
          page = 1,
          limit = 12,
          sort = 'newest',
          search = '',
          category = '',
          priceMin,
          priceMax,
        } = req.query;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const priceMinNumber = priceMin ? Number(priceMin) : undefined;
        const priceMaxNumber = priceMax ? Number(priceMax) : undefined;
        const foods = yield FoodService_1.default.getAllFood({
          page: pageNumber > 0 ? pageNumber : 1,
          limit: limitNumber > 0 ? limitNumber : 12,
          sort: sort,
          search: search,
          category: category,
          priceMin: priceMinNumber,
          priceMax: priceMaxNumber,
        });
        return res.status(200).json({
          success: true,
          message: 'All food retrieved successfully',
          data: foods,
        });
      } catch (error) {
        console.error('Error in getAllFood:', error);
        return res.status(500).json({
          success: false,
          message: 'Error getting all food',
          error: error.message,
        });
      }
    });
  }
  getFoodBySlug(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { slug } = req.params;
        const food = yield FoodService_1.default.getFoodBySlug(slug);
        if (!food) {
          return res.status(404).json({
            success: false,
            message: 'Món ăn không tồn tại!',
          });
        }
        return res.status(200).json({
          success: true,
          data: food,
        });
      } catch (error) {
        console.error('Error getting food by slug:', error);
        return res.status(500).json({
          success: false,
          message: 'Lỗi khi lấy món ăn',
        });
      }
    });
  }
  getFoodById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const foodId = String(req.params.id);
        const food = yield FoodService_1.default.getFoodById(foodId);
        res.status(200).json(food);
      } catch (error) {
        throw new Error('Error getting food by id');
      }
    });
  }
  updateFood(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { id } = req.params;
        const updatedFood = yield FoodService_1.default.updateFood(id, req.body);
        res.status(200).json(updatedFood);
      } catch (error) {
        throw new Error('Error updating food');
      }
    });
  }
  deleteFood(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { id } = req.params;
        const deletedFood = yield FoodService_1.default.deleteFood(id);
        res.status(200).json(deletedFood);
      } catch (error) {
        throw new Error('Error deleting food');
      }
    });
  }
  getFoodByCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { Cate_type } = req.query;
        const food = yield FoodService_1.default.getFoodByCategoryType(String(Cate_type));
        res.status(200).json(food);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting food by category type' });
      }
    });
  }
  getFoodBySearch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { search } = req.query;
        const food = yield FoodService_1.default.getFoodBySearch(String(search));
        res.status(200).json(food);
      } catch (error) {
        throw new Error('Error getting food by search');
      }
    });
  }
  getFoodByPrice(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { min, max } = req.query;
        const food = yield FoodService_1.default.getFoodByPrice(Number(min), Number(max));
        res.status(200).json(food);
      } catch (error) {
        throw new Error('Error getting food by price');
      }
    });
  }
  getFoodByRating(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { rating } = req.query;
        const food = yield FoodService_1.default.getFoodByRating(Number(rating));
        res.status(200).json(food);
      } catch (error) {
        throw new Error('Error getting food by rating');
      }
    });
  }
  getFoodByFavorites(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { favorites, type } = req.query;
        if (!type || typeof type !== 'string') {
          return res.status(400).json({
            success: false,
            message: 'Missing or invalid type parameter',
          });
        }
        let dishes;
        if (favorites) {
          const favoritesNumber = Number(favorites);
          if (isNaN(favoritesNumber)) {
            return res.status(400).json({ success: false, message: 'Favorites must be a number' });
          }
          dishes = yield FoodService_1.default.getFoodByFavorites(favoritesNumber, type);
        } else {
          dishes = yield FoodService_1.default.getTopFavoriteFoods(type);
        }
        if (!dishes || dishes.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'No food found matching the criteria',
            data: [],
          });
        }
        return res.status(200).json({
          success: true,
          message: 'Food retrieved successfully',
          data: dishes,
        });
      } catch (error) {
        console.error('Error in getFoodByFavorites:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
    });
  }
  SearchFood(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const result = yield SearchService_1.default.search(DishModel_1.Dish, req.query, ['name']);
        return res.status(200).json(result);
      } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error });
      }
    });
  }
}
exports.default = new FoodController();
