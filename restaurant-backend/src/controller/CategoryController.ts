import { Request, Response, NextFunction } from 'express';
import CategoryService from '../services/CategoryService';

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
}

export default new CategoryController();
