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
      const food = await Dish.find().sort({ favorites: -1 }).limit(5);
      // -1 là giảm dần, 1 là tăng dần
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
        const food = await Dish.find(); 
        return food;
    } catch (error) {
        throw new Error('Error getting all food'); 
    }
  }
  async getFoodById(id: string,req: any) {
    try {
        const { id } = req.params;
        const food = await Dish.findById(id).populate('categories');
        return food;

    } catch (error) {
        throw new Error('Error getting food by id');
    }
  }
  async updateFood(id: string, food: any) {
    try {
        const updatedFood = await Dish.findByIdAndUpdate(id, food, { new: true });
        return updatedFood;
    } catch (error) {
        throw new Error('Error updating food');
    }
}   
    async deleteFood(id: string) {
        try {
            const deletedFood = await Dish.findByIdAndDelete(id);
            return deletedFood;
        } catch (error) {
            throw new Error('Error deleting food');
        }
    }
   
    async getFoodWithPagination(page: number, limit: number) {
        try {
            const food = await Dish.find()
              .skip((page - 1) * limit)
              .limit(limit);
            return food;
        } catch (error) {
            throw new Error('Error getting food with pagination');
        }
    }
    async getFoodByCategory(id: string) {
        try {
            const categoryId = new mongoose.Types.ObjectId(id); 
            const food = await Dish.find({ categories: categoryId });
            return food;
        } catch (error) {
            throw new Error('Error getting food by category');
        }
    }
    async getFoodBySearch(search: string) {
        try {
            const food = await Dish.find({ $text: { $search: search } });
            return food;
        } catch (error) {
            throw new Error('Error getting food by search');
        }
    }
    async getFoodByPrice(pricemin: number, pricemax: number) {
        try {
            const food = await Dish.find({
              pricemin: pricemin,
              pricemax: pricemax,
            });
            return food;
        } catch (error) {
            throw new Error('Error getting food by price');
        }
    }
    async getFoodByRating(rating: number) {
        try {
            const food = await Dish.find({ rating: rating });
            return food;
        } catch (error) {
            throw new Error('Error getting food by rating');
        }
    }
    async getFoodByFavorites(favorites: number) {
        try {
            const food = await Dish.find({ favorites: favorites });
            return food;
        } catch (error) {
            throw new Error('Error getting food by favorites');
        }
    }
}
export default new FoodService();
