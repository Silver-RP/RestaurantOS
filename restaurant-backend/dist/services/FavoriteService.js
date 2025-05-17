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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteService = void 0;
const FavoriteModel_1 = require("../models/FavoriteModel");
const DishModel_1 = require("../models/DishModel"); // nhớ import đúng path
exports.FavoriteService = {
    addToFavorite(userId, dishId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield FavoriteModel_1.Favorite.findOne({ userId, dishId });
            if (existing)
                return existing;
            const favorite = yield FavoriteModel_1.Favorite.create({ userId, dishId });
            yield DishModel_1.Dish.findByIdAndUpdate(dishId, { $inc: { favorites_count: 1 } });
            return favorite;
        });
    },
    removeFromFavorite(userId, dishId) {
        return __awaiter(this, void 0, void 0, function* () {
            const favorite = yield FavoriteModel_1.Favorite.findOneAndDelete({ userId, dishId });
            if (favorite) {
                yield DishModel_1.Dish.findByIdAndUpdate(dishId, { $inc: { favorites_count: -1 } });
            }
            return favorite;
        });
    },
    getFavorites(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FavoriteModel_1.Favorite.find({ userId }).populate({
                path: 'dishId',
                populate: {
                    path: 'categories',
                    model: 'categories',
                },
            });
        });
    },
    removeFromFavoriteById(favoriteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const favorite = yield FavoriteModel_1.Favorite.findByIdAndDelete(favoriteId);
            if (favorite) {
                yield DishModel_1.Dish.findByIdAndUpdate(favorite.dishId, {
                    $inc: { favorites_count: -1 },
                });
            }
            return favorite;
        });
    },
    isFavorite(userId, dishId) {
        return FavoriteModel_1.Favorite.findOne({ userId, dishId });
    },
};
