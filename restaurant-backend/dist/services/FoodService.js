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
const CategoryModel_1 = __importDefault(require("../models/CategoryModel"));
const FavoriteModel_1 = require("../models/FavoriteModel");
const mongoose_1 = __importDefault(require("mongoose"));
const queryBuilder_1 = require("../utils/queryBuilder");
const sorting_1 = require("../utils/sorting");
class FoodService {
    createFood(food) {
        return __awaiter(this, void 0, void 0, function* () {
            const newfood = new DishModel_1.Dish(food);
            try {
                return yield newfood.save();
            }
            catch (_a) {
                throw new Error('Error creating food');
            }
        });
    }
    getTopFavoriteFood() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const food = yield DishModel_1.Dish.find().sort({ favorites_count: -1 }).limit(5);
                if (!food || food.length === 0) {
                    return { message: 'No food found' };
                }
                return food;
            }
            catch (_a) {
                throw new Error('Error getting top favorite food');
            }
        });
    }
    getAllFood(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10, sort = 'newest', } = filters;
            const query = yield (0, queryBuilder_1.buildQuery)(filters);
            const sortQuery = (0, sorting_1.getSortQuery)(sort);
            const options = {
                page,
                limit,
                sort: sortQuery,
                lean: true,
                populate: {
                    path: 'categories',
                    select: 'Cate_name',
                },
            };
            try {
                return yield DishModel_1.Dish.paginate(query, options);
            }
            catch (error) {
                console.error('Error in getAllFood:', error);
                throw new Error('Error fetching food items');
            }
        });
    }
    getFoodBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const food = yield DishModel_1.Dish.findOne({ slug }).populate('categories');
            if (!food) {
                return null;
            }
            return food;
        });
    }
    getFoodByNewest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const foodNewest = yield DishModel_1.Dish.find().sort({ createdAt: -1 }).limit(10).populate('categories');
                return foodNewest;
            }
            catch (error) {
                console.error('Error in getFoodByNewest:', error);
            }
        });
    }
    getFoodById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const food = yield DishModel_1.Dish.findById(id).populate('categories');
                return food;
            }
            catch (_a) {
                throw new Error('Error getting food by id');
            }
        });
    }
    updateFood(id, food) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield DishModel_1.Dish.findByIdAndUpdate(id, food, { new: true });
            }
            catch (_a) {
                throw new Error('Error updating food');
            }
        });
    }
    deleteFood(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield DishModel_1.Dish.findByIdAndDelete(id);
            }
            catch (_a) {
                throw new Error('Error deleting food');
            }
        });
    }
    getFoodByCategoryType(cateType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield CategoryModel_1.default.find({ Cate_type: cateType });
                const categoryIds = categories.map((cat) => cat._id);
                // B2: Tìm dish có categories nằm trong danh sách categoryIds
                const food = yield DishModel_1.Dish.find({ categories: { $in: categoryIds } });
                return food;
            }
            catch (_a) {
                throw new Error('Error getting food by category type');
            }
        });
    }
    getFoodBySearch(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield DishModel_1.Dish.find({ $text: { $search: search } });
            }
            catch (_a) {
                throw new Error('Error getting food by search');
            }
        });
    }
    getFoodByPrice(pricemin, pricemax) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield DishModel_1.Dish.find({
                    price: { $gte: pricemin, $lte: pricemax },
                });
            }
            catch (_a) {
                throw new Error('Error getting food by price');
            }
        });
    }
    getFoodByRating(rating) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield DishModel_1.Dish.find({ rating: rating });
            }
            catch (_a) {
                throw new Error('Error getting food by rating');
            }
        });
    }
    getFoodBest4(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(categoryId);
                const foodNewest = yield DishModel_1.Dish.aggregate([
                    {
                        $match: { categories: { $in: [objectId] } },
                    },
                    {
                        $sort: { favorites_count: -1 },
                    },
                    {
                        $limit: 20,
                    },
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'categories',
                            foreignField: '_id',
                            as: 'categories',
                        },
                    },
                ]);
                return foodNewest;
            }
            catch (error) {
                console.error('Error in getFoodBest4:', error);
                throw new Error('Error fetching food by category');
            }
        });
    }
    getFoodByFavorites(favorites, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dishes = yield DishModel_1.Dish.aggregate([
                    {
                        $match: { favorites_count: favorites },
                    },
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'categories',
                            foreignField: '_id',
                            as: 'categories',
                        },
                    },
                    { $unwind: '$categories' },
                    {
                        $match: { 'categories.Cate_type': type },
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            price: 1,
                            description: 1,
                            images: 1,
                            favorites_count: 1,
                            rating: 1,
                            rating_count: 1,
                            average_rating: 1,
                            categories: 1,
                            slug: 1,
                        },
                    },
                ]);
                return dishes;
            }
            catch (error) {
                console.error('Error in getFoodByFavorites:', error);
                throw new Error('Error fetching food by favorites');
            }
        });
    }
    getTopFavoriteFoods(type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dishes = yield DishModel_1.Dish.aggregate([
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'categories',
                            foreignField: '_id',
                            as: 'categories',
                        },
                    },
                    { $unwind: '$categories' },
                    {
                        $match: { 'categories.Cate_type': type },
                    },
                    {
                        $sort: { favorites_count: -1 },
                    },
                    {
                        $limit: 6,
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            price: 1,
                            description: 1,
                            images: 1,
                            favorites_count: 1,
                            rating: 1,
                            categories: 1,
                            slug: 1,
                        },
                    },
                ]);
                return dishes;
            }
            catch (error) {
                console.error('Error in getTopFavoriteFoods:', error);
                throw new Error('Error fetching top favorite foods');
            }
        });
    }
    toggleFavorite(dishId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const food = yield DishModel_1.Dish.findById(dishId);
                if (!food) {
                    throw new Error('Food not found');
                }
                const existingFavorite = yield FavoriteModel_1.Favorite.findOne({ userId, dishId });
                if (existingFavorite) {
                    yield FavoriteModel_1.Favorite.deleteOne({ userId, dishId });
                    return {
                        message: 'Favorite removed successfully',
                        isFavortite: false,
                    };
                }
                else {
                    const newFavorite = new FavoriteModel_1.Favorite({
                        userId,
                        dishId,
                    });
                    if (!newFavorite.dishId) {
                        throw new Error('dishId is required');
                    }
                    yield newFavorite.save();
                    return {
                        message: 'Favorite added successfully',
                        isFavortite: true,
                    };
                }
            }
            catch (error) {
                console.error('Error toggling favorite:', error);
                throw new Error('Error toggling favorite');
            }
        });
    }
    getFavoriteFoods(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const favorites = yield FavoriteModel_1.Favorite.find({ userId }).populate('dishId').lean();
                if (!favorites || favorites.length === 0) {
                    return {
                        message: 'No favorite foods found',
                        data: [],
                    };
                }
                return favorites.map((fav) => fav.dishId);
            }
            catch (error) {
                console.error('Error getting favorite foods:', error);
                throw new Error('Error getting favorite foods');
            }
        });
    }
    countFoodView(foodId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const food = yield DishModel_1.Dish.findById(foodId);
                if (!food) {
                    throw new Error('Food not found');
                }
                food.views = (food.views || 0) + 1;
                yield food.save();
                return food;
            }
            catch (error) {
                console.error('Error counting food view:', error);
                throw new Error('Error counting food view');
            }
        });
    }
}
exports.default = new FoodService();
