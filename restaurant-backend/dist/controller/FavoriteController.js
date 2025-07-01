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
exports.FavoriteController = void 0;
const FavoriteService_1 = require("../services/FavoriteService");
exports.FavoriteController = {
    add: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user.id) === null || _a === void 0 ? void 0 : _a.toString();
            const { dishId } = req.body;
            if (!userId || !dishId) {
                res.status(400).json({ message: 'Missing userId or dishId' });
                return;
            }
            const existing = yield FavoriteService_1.FavoriteService.isFavorite(userId, dishId);
            if (existing) {
                res.status(409).json({ message: 'Dish already in favorite' });
                return;
            }
            const favorite = yield FavoriteService_1.FavoriteService.addToFavorite(userId, dishId);
            res.status(201).json({ success: true, data: favorite });
        }
        catch (error) {
            console.error('Add favorite error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }),
    remove: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user.id) === null || _a === void 0 ? void 0 : _a.toString();
            const { id: favoriteId } = req.params;
            if (!userId || !favoriteId) {
                res.status(400).json({ message: 'Missing userId or favoriteId' });
                return;
            }
            const deleted = yield FavoriteService_1.FavoriteService.removeFromFavoriteById(favoriteId);
            if (!deleted) {
                res.status(404).json({ message: 'Favorite not found' });
                return;
            }
            res.json({ success: true, message: 'Removed from favorites' });
        }
        catch (error) {
            console.error('Remove favorite error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }),
    list: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user.id) === null || _a === void 0 ? void 0 : _a.toString();
            const favorites = yield FavoriteService_1.FavoriteService.getFavorites(userId);
            res.json({ success: true, data: favorites });
        }
        catch (error) {
            console.error('List favorite error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }),
};
