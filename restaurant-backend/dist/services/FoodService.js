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
const DishModel_1 = require("../models/DishModel");
const mongoose_1 = __importDefault(require("mongoose"));
class FoodService {
    createFood(food) {
        return __awaiter(this, void 0, void 0, function* () {
            const newfood = new DishModel_1.Dish(food);
            try {
                return yield newfood.save();
            }
            catch (error) {
                throw new Error('Error creating food');
            }
        });
    }
    getTopFavoriteFood() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const food = yield DishModel_1.Dish.find().sort({ favorites: -1 }).limit(5);
                // -1 là giảm dần, 1 là tăng dần
                if (!food || food.length === 0) {
                    return { message: 'No food found' };
                }
                return food;
            }
            catch (error) {
                throw new Error('Error getting top favorite food');
            }
        });
    }
    getAllFood() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const food = yield DishModel_1.Dish.find();
                return food;
            }
            catch (error) {
                throw new Error('Error getting all food');
            }
        });
    }
    getFoodById(id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const food = yield DishModel_1.Dish.findById(id).populate('categories');
                return food;
            }
            catch (error) {
                throw new Error('Error getting food by id');
            }
        });
    }
    updateFood(id, food) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedFood = yield DishModel_1.Dish.findByIdAndUpdate(id, food, { new: true });
                return updatedFood;
            }
            catch (error) {
                throw new Error('Error updating food');
            }
        });
    }
    deleteFood(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedFood = yield DishModel_1.Dish.findByIdAndDelete(id);
                return deletedFood;
            }
            catch (error) {
                throw new Error('Error deleting food');
            }
        });
    }
    getFoodWithPagination(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const food = yield DishModel_1.Dish.find()
                    .skip((page - 1) * limit)
                    .limit(limit);
                return food;
            }
            catch (error) {
                throw new Error('Error getting food with pagination');
            }
        });
    }
    getFoodByCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = new mongoose_1.default.Types.ObjectId(id);
                const food = yield DishModel_1.Dish.find({ categories: categoryId });
                return food;
            }
            catch (error) {
                throw new Error('Error getting food by category');
            }
        });
    }
    getFoodBySearch(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const food = yield DishModel_1.Dish.find({ $text: { $search: search } });
                return food;
            }
            catch (error) {
                throw new Error('Error getting food by search');
            }
        });
    }
    getFoodByPrice(pricemin, pricemax) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const food = yield DishModel_1.Dish.find({ pricemin: pricemin, pricemax: pricemax });
                return food;
            }
            catch (error) {
                throw new Error('Error getting food by price');
            }
        });
    }
    getFoodByRating(rating) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const food = yield DishModel_1.Dish.find({ rating: rating });
                return food;
            }
            catch (error) {
                throw new Error('Error getting food by rating');
            }
        });
    }
    getFoodByFavorites(favorites) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const food = yield DishModel_1.Dish.find({ favorites: favorites });
                return food;
            }
            catch (error) {
                throw new Error('Error getting food by favorites');
            }
        });
    }
}
exports.default = new FoodService();
