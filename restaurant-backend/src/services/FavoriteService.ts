import { Favorite } from '../models/FavoriteModel';

export const FavoriteService = {
  async addToFavorite(userId: string, dishId: string) {
    return await Favorite.create({ userId, dishId });
  },

  async removeFromFavorite(userId: string, dishId: string) {
    return await Favorite.findOneAndDelete({ userId, dishId });
  },

  async getFavorites(userId: string) {
    return await Favorite.find({ userId }).populate({
      path: 'dishId',
      populate: {
        path: 'categories',
        model: 'categories',
      },
    });
  },

  async removeFromFavoriteById(favoriteId: string) {
    return await Favorite.findByIdAndDelete(favoriteId);
  },

  isFavorite(userId: string, dishId: string) {
    return Favorite.findOne({ userId, dishId });
  },
};
