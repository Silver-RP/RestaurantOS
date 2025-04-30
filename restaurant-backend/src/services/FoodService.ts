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

  async getAllFood({
    page = 1,
    limit = 10,
    sort = 'newest',
    search = '',
    category = '',
    priceMin,
    priceMax,
  }: {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
    category?: string;
    priceMin?: number;
    priceMax?: number;
  }) {
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      query.price = {};
      if (priceMin !== undefined) {
        query.price.$gte = priceMin;
      }
      if (priceMax !== undefined) {
        query.price.$lte = priceMax;
      }
    }

    if (category) {
      const categoryDoc = await Category.findOne({ Cate_slug: category }).lean();
      if (categoryDoc) {
        query.categories = { $in: [categoryDoc._id] };
      } else {
        return {
          docs: [],
          totalDocs: 0,
          limit,
          page,
          totalPages: 0,
        };
      }
    }

    const sortQuery = this.getSortQuery(sort);

    const options = {
      page,
      limit,
      sort: sortQuery,
      lean: true,
      populate: {
        path: 'categories',
        select: 'Cate_name',
      },
    };

    try {
      return await Dish.paginate(query, options);
    } catch (error) {
      console.error('Error in getAllFood:', error);
      throw new Error('Error fetching food items');
    }
  }

  private getSortQuery(sort: string) {
    switch (sort) {
      case 'priceLow':
        return { price: 1 };
      case 'priceHigh':
        return { price: -1 };
      case 'newest':
        return { createdAt: -1 };
      case 'relevance':
        return { _id: -1 };
      case 'highestRated':
        return { average_rating: -1 };
      case 'mostViewed':
        return { views: -1 };
      case 'mostOrdered':
        return { ordered_count: -1 };
      case 'mostFavorite':
        return { favorites_count: -1 };
      default:
        return { createdAt: -1 };
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

      // B2: Tìm dish có categories nằm trong danh sách categoryIds
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

  async getFoodByFavorites(favorites: number, type: string) {
    try {
      const dishes = await Dish.aggregate([
        {
          $match: { favorites_count: favorites }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'categories',
            foreignField: '_id',
            as: 'categories'
          }
        },
        { $unwind: "$categories" },
        {
          $match: { "categories.Cate_type": type }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            price: 1,
            description: 1,
            images: 1,               
            favorites_count: 1,
            rating: 1,
            categories: 1, 
            slug: 1, 
          }
        }
      ]);
      return dishes;
    } catch (error) {
      console.error('Error in getFoodByFavorites:', error);
      throw new Error('Error fetching food by favorites');
    }
  }
  
  async getTopFavoriteFoods(type: string) {
    try {
      const dishes = await Dish.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'categories',
            foreignField: '_id',
            as: 'categories'
          }
        },
        { $unwind: "$categories" },
        {
          $match: { "categories.Cate_type": type }
        },
        {
          $sort: { favorites_count: -1 }
        },
        {
          $limit: 6
        },
        {
          $project: {
            _id: 1,
            name: 1,
            price: 1,
            description: 1,
            images: 1,                
            favorites_count: 1,
            rating: 1,
            categories: 1, 
            slug: 1,
          }
        }
      ]);
      return dishes;
    } catch (error) {
      console.error('Error in getTopFavoriteFoods:', error);
      throw new Error('Error fetching top favorite foods');
    }
  }
  

}

export default new FoodService();
