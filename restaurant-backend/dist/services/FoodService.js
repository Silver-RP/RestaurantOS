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
                const food = yield DishModel_1.Dish.find().sort({ favorites_count: -1 }).limit(5);
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
    getAllFood(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page = 1, limit = 10, sort = 'newest', search = '', category = '', priceMin, priceMax, }) {
            const query = {};
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                ];
            }
            if (priceMin !== undefined || priceMax !== undefined) {
                query.price = {};
                if (priceMin !== undefined) {
                    query.price.$gte = priceMin;
                }
                if (priceMax !== undefined) {
                    query.price.$lte = priceMax;
                }
            }
            if (category) {
                query.categories = { $in: [category] };
            }
            const sortQuery = this.getSortQuery(sort);
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
    getSortQuery(sort) {
        switch (sort) {
            case 'priceLow':
                return { price: 1 };
            case 'priceHigh':
                return { price: -1 };
            case 'newest':
                return { createdAt: -1 };
            case 'relevance':
                return { _id: -1 };
            case 'highestRated':
                return { average_rating: -1 };
            case 'mostViewed':
                return { views: -1 };
            case 'mostOrdered':
                return { ordered_count: -1 };
            case 'mostFavorite':
                return { favorites_count: -1 };
            default:
                return { createdAt: -1 };
        }
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
    getFoodById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
                return yield DishModel_1.Dish.findByIdAndUpdate(id, food, { new: true });
            }
            catch (error) {
                throw new Error('Error updating food');
            }
        });
    }
    deleteFood(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield DishModel_1.Dish.findByIdAndDelete(id);
            }
            catch (error) {
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
            catch (error) {
                throw new Error('Error getting food by category type');
            }
        });
    }
    getFoodBySearch(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield DishModel_1.Dish.find({ $text: { $search: search } });
            }
            catch (error) {
                throw new Error('Error getting food by search');
            }
        });
    }
    getFoodByPrice(pricemin, pricemax) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield DishModel_1.Dish.find({
                    price: { $gte: pricemin, $lte: pricemax }
                });
            }
            catch (error) {
                throw new Error('Error getting food by price');
            }
        });
    }
    getFoodByRating(rating) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield DishModel_1.Dish.find({ rating: rating });
            }
            catch (error) {
                throw new Error('Error getting food by rating');
            }
        });
    }
    getFoodByFavorites(favorites, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dishes = yield DishModel_1.Dish.aggregate([
                    {
                        $match: { favorites_count: favorites }
                    },
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'categories',
                            foreignField: '_id',
                            as: 'categories'
                        }
                    },
                    { $unwind: "$categories" },
                    {
                        $match: { "categories.Cate_type": type }
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
                        }
                    }
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
                            as: 'categories'
                        }
                    },
                    { $unwind: "$categories" },
                    {
                        $match: { "categories.Cate_type": type }
                    },
                    {
                        $sort: { favorites_count: -1 }
                    },
                    {
                        $limit: 6
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
                        }
                    }
                ]);
                return dishes;
            }
            catch (error) {
                console.error('Error in getTopFavoriteFoods:', error);
                throw new Error('Error fetching top favorite foods');
            }
        });
    }
}
exports.default = new FoodService();
