import { Dish } from '../models/DishModel';
import mongoose from 'mongoose';

class FoodService {
  async createFood(food: any) {
    const newfood = new Dish(food);
    try {
      return await newfood.save(); 
    } catch (error) {
      throw new Error('Error creating food');
    }
  }

  async getTopFavoriteFood() {
    try {
      const food = await Dish.find().sort({ favorites_count: -1 }).limit(5);
      if (!food || food.length === 0) {
        return { message: 'No food found' };
      }
      return food;
    } catch (error) {
      throw new Error('Error getting top favorite food');
    }
  }

  async getAllFood() {
    try {
      return await Dish.find(); 
    } catch (error) {
      throw new Error('Error getting all food'); 
    }
  }

  async getFoodById(id: string) {
    try {
      const food = await Dish.findById(id).populate('categories');
      return food;
    } catch (error) {
      throw new Error('Error getting food by id');
    }
  }

  async updateFood(id: string, food: any) {
    try {
      return await Dish.findByIdAndUpdate(id, food, { new: true });
    } catch (error) {
      throw new Error('Error updating food');
    }
  }

  async deleteFood(id: string) {
    try {
      return await Dish.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Error deleting food');
    }
  }

  async getFoodWithPagination(page: number, limit: number) {
    try {
      return await Dish.find()
        .skip((page - 1) * limit)
        .limit(limit);
    } catch (error) {
      throw new Error('Error getting food with pagination');
    }
  }

  async getFoodByCategory(id: string) {
    try {
      const categoryId = new mongoose.Types.ObjectId(id); 
      return await Dish.find({ categories: categoryId });
    } catch (error) {
      throw new Error('Error getting food by category');
    }
  }

  async getFoodBySearch(search: string) {
    try {
      return await Dish.find({ $text: { $search: search } });
    } catch (error) {
      throw new Error('Error getting food by search');
    }
  }

  async getFoodByPrice(pricemin: number, pricemax: number) {
    try {
      return await Dish.find({
        price: { $gte: pricemin, $lte: pricemax }
      });
    } catch (error) {
      throw new Error('Error getting food by price');
    }
  }

  async getFoodByRating(rating: number) {
    try {
      return await Dish.find({ rating: rating });
    } catch (error) {
      throw new Error('Error getting food by rating');
    }
  }

  async getFoodByFavorites(favorites: number) {
    try {
      return await Dish.find({ favorites_count: favorites });
    } catch (error) {
      throw new Error('Error getting food by favorites');
    }
  }
}

export default new FoodService();
