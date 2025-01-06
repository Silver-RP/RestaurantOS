import FoodService from '../services/FoodService';
import { Request, Response } from 'express';
import UploadImage from '../services/UploadImage';
class FoodController {
    async createFood (req: Request, res: Response): Promise<any>{
        try {
            const { name, price, description, categories, countInStock, rating, favorites } = req.body;
            if(!name || !price || !description || !categories || !countInStock || !rating || !favorites){
                return res.status(400).json({message: 'All fields are required'});
            }
            if(!req.file){
                return res.status(400).json({message: 'Image is required'});
            }
            const imageFile = req.file;  // Multer lưu trữ file
      
            console.log('Image file received:', imageFile);  // Kiểm tra file nhận được
            if(imageFile.mimetype !== 'image/jpeg' && imageFile.mimetype !== 'image/png'){
                return res.status(400).json({message: 'Invalid file type'});
            }
            const imageUrl = await UploadImage(req.file, 'food');
            const food = {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                category: req.body.category,
                imageUrl: imageUrl,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                favorites: req.body.favorites,
            }
            const newFood = await FoodService.createFood(food);
            return res.status(201).json(newFood);
        } catch (error) {
            console.error('Error creating food:', error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }
    async getTopFavoriteFood (req: Request, res: Response): Promise<any>{
        try {
            const foodFavoriteTop = await FoodService.getTopFavoriteFood(); 
            return res.status(200).json(foodFavoriteTop);
        } catch (error) {
            throw new Error('Error getting top favorite food');

        }
    }
    async getAllFood (req: Request, res: Response): Promise<any> {
        try {
            const food = await FoodService.getAllFood();
            res.status(200).json(food);
        } catch (error) {
            throw new Error('Error getting all food');
        }
    }
    async getFoodById (req: Request, res: Response): Promise<any> {
        try {
            const foodId = String(req.query.id);  
            const food = await FoodService.getFoodById(foodId, req);
            res.status(200).json(food);
        } catch (error) {
            throw new Error('Error getting food by id');
        }
    }
    
    async updateFood (req: Request, res: Response): Promise<any> {
        try {
            const foodId = String(req.query.id);  

            const updatedFood = await FoodService.updateFood(foodId, req.body);
            res.status(200).json(updatedFood);
        } catch (error) {
            throw new Error('Error updating food');
        }
    }
    async deleteFood (req: Request, res: Response): Promise<any> {
        try {
            
            const foodId = String(req.query.id);  
            const deletedFood = await FoodService.deleteFood(foodId);
            res.status(200).json(deletedFood);
        } catch (error) {
            throw new Error('Error deleting food');
        }
    }
    async getFoodWithPagination (req: Request, res: Response): Promise<any> {
        try {
            const { page, limit } = req.query;
            const food = await FoodService.getFoodWithPagination(Number(page), Number(limit));
            res.status(200).json(food);
        } catch (error) {
            throw new Error('Error getting food with pagination');
        }
    }
    async getFoodByCategory (req: Request, res: Response): Promise<any> {
        try {
            const { category } = req.query;
            const food = await FoodService.getFoodByCategory(String(category));
            res.status(200).json(food);
        } catch (error) {
            throw new Error('Error getting food by category');
        }
    }
    async getFoodBySearch (req: Request, res: Response): Promise<any> {
        try {
            const { search } = req.query;
            const food = await FoodService.getFoodBySearch(String(search));
            res.status(200).json(food);
        } catch (error) {
            throw new Error('Error getting food by search');
        }
    }
    async getFoodByPrice (req: Request, res: Response): Promise<any> {
        try {
            const { min, max } = req.query;
            const food = await FoodService.getFoodByPrice(Number(min), Number(max));
            res.status(200).json(food);
        } catch (error) {
            throw new Error('Error getting food by price');
        }
    }
    async getFoodByRating (req: Request, res: Response): Promise<any> {
        try {
            const { rating } = req.query;
            const food = await FoodService.getFoodByRating(Number(rating));
            res.status(200).json(food);
        } catch (error) {
            throw new Error('Error getting food by rating');
        }
    }
    async getFoodByFavorites (req: Request, res: Response): Promise<any> {
        try {
            const { favorites } = req.query;
            const food = await FoodService.getFoodByFavorites(Number(favorites));
            res.status(200).json(food);
        } catch (error) {
            throw new Error('Error getting food by favorites');
        }
    }

}
export default new FoodController();