import { Dish } from '../models/DishModel';
import mongoose from 'mongoose';
import Category from '../models/CategoryModel';
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
  async getAllFood(filters: {
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    maxRating?: number;
    keyword?: string;
    category?: string;
  }) {
    try {
      const {
        page = 1,
        limit = 10,
        minPrice,
        maxPrice,
        minRating,
        maxRating,
        keyword,
        category
      } = filters;
  
      const query: any = {};
  
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = minPrice;
        if (maxPrice) query.price.$lte = maxPrice;
      }
  
      if (minRating || maxRating) {
        query.rating = {};
        if (minRating) query.rating.$gte = minRating;
        if (maxRating) query.rating.$lte = maxRating;
      }
  
      if (keyword) {
        query.name = { $regex: keyword, $options: 'i' };
      }
  
      if (category) {
        query.categories = category; // category là ID danh mục
      }
  
      const total = await Dish.countDocuments(query);
      const food = await Dish.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('categories');
  
      return {
        data: food,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      };
    } catch (error) {
      throw new Error('Error getting filtered food');
    }
  }
  async getFoodBySlug(slug: string) {
    const food = await Dish.findOne({ slug }).populate('categories');
    if (!food) {
      return null;
    }
    return food;
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
  async getFoodByCategoryType(cateType: string) {
    try {
      const categories = await Category.find({ Cate_type: cateType });
      const categoryIds = categories.map((cat) => cat._id);
      const food = await Dish.find({ categories: { $in: categoryIds } });
      return food;
    } catch (error) {
      throw new Error('Error getting food by category type');
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
