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
const FoodService_1 = __importDefault(require("../services/FoodService"));
const UploadImage_1 = __importDefault(require("../services/UploadImage"));
const FoodModel_1 = require("../models/FoodModel");
const SearchService_1 = __importDefault(require("../services/SearchService"));
const mongoose_1 = __importDefault(require("mongoose"));
class FoodController {
    createFood(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, price, description, categories, countInStock, rating, favorites } = req.body;
                if (!name || !price || !description || !categories || !countInStock || !rating || !favorites) {
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
            }
            catch (error) {
                console.error('Error creating food:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    getTopFavoriteFood(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const foodFavoriteTop = yield FoodService_1.default.getTopFavoriteFood();
                return res.status(200).json(foodFavoriteTop);
            }
            catch (error) {
                throw new Error('Error getting top favorite food');
            }
        });
    }
    getAllFood(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const food = yield FoodService_1.default.getAllFood();
                res.status(200).json(food);
            }
            catch (error) {
                throw new Error('Error getting all food');
            }
        });
    }
    getFoodById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const foodId = String(req.params.id);
                const food = yield FoodService_1.default.getFoodById(foodId, req);
                res.status(200).json(food);
            }
            catch (error) {
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
            }
            catch (error) {
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
            }
            catch (error) {
                throw new Error('Error deleting food');
            }
        });
    }
    getFoodWithPagination(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit } = req.query;
                const food = yield FoodService_1.default.getFoodWithPagination(Number(page), Number(limit));
                res.status(200).json(food);
            }
            catch (error) {
                throw new Error('Error getting food with pagination');
            }
        });
    }
    getFoodByCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const food = yield FoodService_1.default.getFoodByCategory(String(id));
                res.status(200).json(food);
            }
            catch (error) {
                throw new Error('Error getting food by category');
            }
        });
    }
    getFoodBySearch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search } = req.query;
                const food = yield FoodService_1.default.getFoodBySearch(String(search));
                res.status(200).json(food);
            }
            catch (error) {
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
            }
            catch (error) {
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
            }
            catch (error) {
                throw new Error('Error getting food by rating');
            }
        });
    }
    getFoodByFavorites(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { favorites } = req.query;
                const food = yield FoodService_1.default.getFoodByFavorites(Number(favorites));
                res.status(200).json(food);
            }
            catch (error) {
                throw new Error('Error getting food by favorites');
            }
        });
    }
    SearchFood(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield SearchService_1.default.search(FoodModel_1.Food, req.query, ['name']);
                return res.status(200).json(result);
            }
            catch (error) {
                return res.status(500).json({ message: 'An error occurred', error });
            }
        });
    }
}
exports.default = new FoodController();
