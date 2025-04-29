import { Request, Response, NextFunction } from 'express';
import CategoryService from '../services/CategoryService';
import SearchService from '../services/SearchService';
import Category from '../models/CategoryModel';
import PaginateService from '../services/PaginateService';
class CategoryController {
    async GetAllCategory(req: Request, res: Response): Promise<void> {
        await CategoryService.GetAllCategory(req, res);
    }
    
    async AddCategory(req: Request, res: Response): Promise<void> {
        await CategoryService.AddCategory(req, res);
    }
    
    async GetCategoryById(req: Request, res: Response): Promise<void> {
        await CategoryService.GetCategoryById(req, res);
    }

    async UpdateCategory(req: Request, res: Response): Promise<void> {
        await CategoryService.UpdateCategory(req, res);
    }

    async DeleteCategory(req: Request, res: Response): Promise<void> {
        await CategoryService.DeleteCategory(req, res);
    }

    async SearchCategory(req: Request, res: Response): Promise<any> {  
        try { 
            const result = await SearchService.search(Category, req.query, ['name']);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: 'An error occurred', error });
        }
    }

    async PaginateCate(req: Request, res: Response): Promise<void> {
        await PaginateService.paginate(Category, req, res); 
    }
}

export default new CategoryController();
