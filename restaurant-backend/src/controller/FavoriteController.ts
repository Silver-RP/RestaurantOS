import { Request, Response } from 'express';
import { FavoriteService } from '../services/FavoriteService';

export const FavoriteController = {
  add: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      console.log(userId);
      const { dishId } = req.body;

      if (!userId || !dishId) {
        return res.status(400).json({ message: 'Missing userId or dishId' });
      }

      const existing = await FavoriteService.isFavorite(userId.toString(), dishId.toString());
      if (existing) {
        return res.status(409).json({ message: 'Dish already in favorite' });
      }

      const favorite = await FavoriteService.addToFavorite(userId.toString(), dishId.toString());
      res.status(201).json({ success: true, data: favorite });
    } catch (error) {
      console.error('Add favorite error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  remove: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id as string;
      const { dishId } = req.params;

      const deleted = await FavoriteService.removeFromFavorite(userId, dishId);
      if (!deleted) {
        return res.status(404).json({ message: 'Favorite not found' });
      }

      res.json({ success: true, message: 'Removed from favorites' });
    } catch (error) {
      console.error('Remove favorite error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  list: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id as string;
      const favorites = await FavoriteService.getFavorites(userId);

      res.json({ success: true, data: favorites });
    } catch (error) {
      console.error('List favorite error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};
