import { Favorite } from '../models/FavoriteModel';

export const FavoriteService = {
  async addToFavorite(userId: string, dishId: string) {
    return await Favorite.create({ userId, dishId });
  },

  async removeFromFavorite(userId: string, dishId: string) {
    return await Favorite.findOneAndDelete({ userId, dishId });
  },

  async getFavorites(userId: string) {
    return await Favorite.find({ userId }).populate('dishId');
  },

  async isFavorite(userId: string, dishId: string) {
    return await Favorite.findOne({ userId, dishId });
  },
};
