import FoodService from '../services/FoodService';
import { Request, Response } from 'express';
import UploadImage from '../services/UploadImage';
import mongoose from 'mongoose';
import { Types } from 'mongoose';
import { IUser } from '../models/UserModel';
import { parseFoodQueryParams } from '../utils/queryParser';

class FoodController {
  async createFood(req: Request, res: Response): Promise<any> {
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
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
      const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
      if (!req.file) {
        return res.status(400).json({ message: 'Image is required' });
      }
      const imageFile = req.file;

      console.log('Image file received:', imageFile);
      if (imageFile.mimetype !== 'image/jpeg' && imageFile.mimetype !== 'image/png') {
        return res.status(400).json({ message: 'Invalid file type' });
      }
      const imageUrl = await UploadImage(req.file, 'food');
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
      const newFood = await FoodService.createFood(food);
      return res.status(201).json({ message: 'Food created successfully', data: newFood });
    } catch (error) {
      console.error('Error creating food:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getTopFavoriteFood(req: Request, res: Response): Promise<void> {
    try {
      const foodFavoriteTop = await FoodService.getTopFavoriteFood();
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
  }

  async getAllFood(req: Request, res: Response): Promise<any> {
    try {
      const params = parseFoodQueryParams(req.query);
  
      const foods = await FoodService.getAllFood(params);
  
      return res.status(200).json({
        success: true,
        message: 'All food retrieved successfully',
        data: foods,
      });
    } catch (error: any) {
      console.error('Error in getAllFood:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting all food',
        error: error.message,
      });
    }
  }

  async getFoodBySlug(req: Request, res: Response): Promise<any> {
    try {
      const { slug } = req.params;
      const food = await FoodService.getFoodBySlug(slug);

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
  }

  async getFoodById(req: Request, res: Response): Promise<any> {
    try {
      const foodId = String(req.params.id);
      const food = await FoodService.getFoodById(foodId);
      res.status(200).json(food);
    } catch {
      throw new Error('Error getting food by id');
    }
  }

  async getFoodByNewest(_: Request, res: Response): Promise<any> {
    try {
      const food = await FoodService.getFoodByNewest();
      return res.status(200).json({
        success: true,
        message: 'Food retrieved successfully',
        data: food,
      });
    } catch (error) {
      console.error('Error getting food by newest:', error);
      return res.status(500).json({
        success: false,
        message: 'Error getting food by newest',
      });
    }
  }

  async updateFood(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const updatedFood = await FoodService.updateFood(id, req.body);
      res.status(200).json(updatedFood);
    } catch {
      throw new Error('Error updating food');
    }
  }

  async deleteFood(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const deletedFood = await FoodService.deleteFood(id);
      res.status(200).json(deletedFood);
    } catch {
      throw new Error('Error deleting food');
    }
  }

  async getFoodByCategory(req: Request, res: Response): Promise<any> {
    try {
      const { Cate_type } = req.query;
      const food = await FoodService.getFoodByCategoryType(String(Cate_type));
      res.status(200).json(food);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting food by category type' });
    }
  }

  async getFoodByPrice(req: Request, res: Response): Promise<any> {
    try {
      const { min, max } = req.query;
      const food = await FoodService.getFoodByPrice(Number(min), Number(max));
      res.status(200).json(food);
    } catch {
      throw new Error('Error getting food by price');
    }
  }

  async getFoodByRating(req: Request, res: Response): Promise<any> {
    try {
      const { rating } = req.query;
      const food = await FoodService.getFoodByRating(Number(rating));
      res.status(200).json(food);
    } catch {
      throw new Error('Error getting food by rating');
    }
  }

  async getFoodByFavorites(req: Request, res: Response): Promise<any> {
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
        dishes = await FoodService.getFoodByFavorites(favoritesNumber, type);
      } else {
        dishes = await FoodService.getTopFavoriteFoods(type);
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
  }

  async getFoodBest4(req: Request, res: Response): Promise<any> {
    try {
      const { category } = req.query;
      if (!category || typeof category !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Missing or invalid category parameter',
        });
      }

      const dishes = await FoodService.getFoodBest4(category);

      return res.status(200).json({
        success: true,
        message: 'Food retrieved successfully',
        data: dishes,
      });
    } catch (error) {
      console.error('Error in getFoodBest4:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async toggleFavorite(req: Request, res: Response): Promise<any> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const userId = (req.user as IUser).id as Types.ObjectId;
      const { dishId } = req.body;

      console.log('User ID:', userId);
      console.log('Dish ID:', dishId);

      if (!dishId) {
        return res.status(400).json({ message: 'Dish ID is required' });
      }

      const updatedFood = await FoodService.toggleFavorite(dishId, userId);
      return res.status(200).json({ data: updatedFood });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getFavoriteFoods(req: Request, res: Response): Promise<any> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const userId = (req.user as IUser).id as Types.ObjectId;
      const favoriteFoods = await FoodService.getFavoriteFoods(userId);
      if (!favoriteFoods || (Array.isArray(favoriteFoods) && favoriteFoods.length === 0)) {
        return res.status(200).json({
          message: 'Favorite foods retrieved successfully',
          data: favoriteFoods ?? [],
        });
      }
      return res
        .status(200)
        .json({ message: 'Favorite foods retrieved successfully', data: favoriteFoods });
    } catch (error) {
      console.error('Error getting favorite foods:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async countFoodView(req: Request, res: Response): Promise<any> {
    try {
      const foodId = req.params.foodId;
      const updatedFood = await FoodService.countFoodView(foodId);
      return res.status(200).json({ data: updatedFood });
    } catch (error) {
      console.error('Error counting food view:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
export default new FoodController();
