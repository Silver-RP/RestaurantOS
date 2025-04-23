import FoodService from '../services/FoodService';
import { Request, Response } from 'express';
import UploadImage from '../services/UploadImage';
import { Dish } from '../models/DishModel';
import SearchService from '../services/SearchService';
import mongoose from 'mongoose';
import Category from '../models/CategoryModel';

interface QueryParams {
    page?: string | number;
    limit?: string | number;
    sort?: string;
}
class FoodController {
    async createFood(req: Request, res: Response): Promise<any> {
        try {
            const { name, price, description, categories, countInStock, rating, favorites } = req.body;
            if (!name || !price || !description || !categories || !countInStock || !rating || !favorites) {
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
            }
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
                data: foodFavoriteTop
            });
            return

        } catch (error) {
            console.error('Error fetching top favorite foods:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve top favorite foods',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            return
        }
    }

    async getAllFood(req: Request<{}, {}, {}, QueryParams>, res: Response): Promise<any> {
        try {
            const { page = 1, limit = 12, sort = 'default' } = req.query;
    
            const pageNumber = parseInt(page as string);
            const limitNumber = parseInt(limit as string);
            
            const food = await FoodService.getAllFood({
                page: pageNumber > 0 ? pageNumber : 1, 
                limit: limitNumber > 0 ? limitNumber : 12, 
                sort: sort as string,
            });
    
            res.status(200).json({ message: 'All food retrieved successfully', data: food });
        } catch (error: any) {
            res.status(500).json({ message: 'Error getting all food', error: error.message });
        }
    }
    

    async getFoodBySlug(req: Request, res: Response): Promise<any> {
        try {
            const { slug } = req.params;
            const food = await FoodService.getFoodBySlug(slug);

            if (!food) {
                return res.status(404).json({
                    success: false,
                    message: 'Món ăn không tồn tại!'
                });
            }

            return res.status(200).json({
                success: true,
                data: food
            });
        } catch (error) {
            console.error('Error getting food by slug:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy món ăn'
            });
        }
    }

    async getFoodById(req: Request, res: Response): Promise<any> {
        try {
            const foodId = String(req.params.id);
            const food = await FoodService.getFoodById(foodId);
            res.status(200).json(food);
        } catch (error) {
            throw new Error('Error getting food by id');
        }
    }

    async updateFood(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const updatedFood = await FoodService.updateFood(id, req.body);
            res.status(200).json(updatedFood);
        } catch (error) {
            throw new Error('Error updating food');
        }
    }

    async deleteFood(req: Request, res: Response): Promise<any> {
        try {

            const { id } = req.params;
            const deletedFood = await FoodService.deleteFood(id);
            res.status(200).json(deletedFood);
        } catch (error) {
            throw new Error('Error deleting food');
        }
    }

    async getFoodWithPagination(req: Request, res: Response): Promise<any> {
        try {
            const { page, limit } = req.query;
            const food = await FoodService.getFoodWithPagination(Number(page), Number(limit));
            res.status(200).json(food);
        } catch (error) {
            throw new Error('Error getting food with pagination');
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

    async getFoodBySearch(req: Request, res: Response): Promise<any> {
        try {
            const { search } = req.query;
            const food = await FoodService.getFoodBySearch(String(search));
            res.status(200).json(food);
        } catch (error) {
            throw new Error('Error getting food by search');
        }
    }

    async getFoodByPrice(req: Request, res: Response): Promise<any> {
        try {
            const { min, max } = req.query;
            const food = await FoodService.getFoodByPrice(Number(min), Number(max));
            res.status(200).json(food);
        } catch (error) {
            throw new Error('Error getting food by price');
        }
    }

    async getFoodByRating(req: Request, res: Response): Promise<any> {
        try {
            const { rating } = req.query;
            const food = await FoodService.getFoodByRating(Number(rating));
            res.status(200).json(food);
        } catch (error) {
            throw new Error('Error getting food by rating');
        }
    }

    async getFoodByFavorites(req: Request, res: Response): Promise<any> {
        try {
            const { favorites } = req.query;
            const food = await FoodService.getFoodByFavorites(Number(favorites));
            res.status(200).json(food);
        } catch (error) {
            throw new Error('Error getting food by favorites');
        }
    }

  async SearchFood(req: Request, res: Response): Promise<any> {
    try {
      const result = await SearchService.search(Dish, req.query, ['name']);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'An error occurred', error });
    }
  }
 

}
export default new FoodController();
