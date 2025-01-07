import { Food } from '../models/FoodModel';
class FoodService {
  async createFood(food: any) {
    const newfood = new Food(food);
    return newfood.save();
  }
  async getTopFavoriteFood() {
    try {
      const food = await Food.find().sort({ favorites: -1 }).limit(5);
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
        const food = await Food.find(); 
        return food;
    } catch (error) {
        throw new Error('Error getting all food'); 
    }
  }
  async getFoodById(id: string, req: any) {
    try {
        const { id } = req.query;
        const food = await Food.findById(id);
        return food;

    } catch (error) {
        throw new Error('Error getting food by id');
    }
  }
  async updateFood(id: string, food: any) {
    try {
        const updatedFood = await Food.findByIdAndUpdate(id, food, { new: true });
        return updatedFood;
    } catch (error) {
        throw new Error('Error updating food');
    }
}
async deleteFood(id: string) {
    try {
        const deletedFood = await Food.findByIdAndDelete(id);
        return deletedFood;
    } catch (error) {
        throw new Error('Error deleting food');
    }
}
async getFoodWithPagination(page: number, limit: number) {
    try {
        const food = await Food.find()
            .skip((page - 1) * limit)
            .limit(limit);
        return food;
    } catch (error) {
        throw new Error('Error getting food with pagination');
    }
}
async getFoodByCategory(category: string) {
    try {
        const food = await Food.find({ category: category });
        return food;
    } catch (error) {
        throw new Error('Error getting food by category');
    }
}
async getFoodBySearch(search: string) {
    try {
        const food = await Food.find({ $text: { $search: search } });
        return food;
    } catch (error) {
        throw new Error('Error getting food by search');
    }
}
async getFoodByPrice(pricemin: number, pricemax: number) {
    try {
        const food = await Food.find({ pricemin: pricemin, pricemax: pricemax });
        return food;
    } catch (error) {
        throw new Error('Error getting food by price');
    }
}
async getFoodByRating(rating: number) {
    try {
        const food = await Food.find({ rating: rating });
        return food;
    } catch (error) {
        throw new Error('Error getting food by rating');
    }
}
async getFoodByFavorites(favorites: number) {
    try {
        const food = await Food.find({ favorites: favorites });
        return food;
    } catch (error) {
        throw new Error('Error getting food by favorites');
    }
}
}
export default new FoodService();
