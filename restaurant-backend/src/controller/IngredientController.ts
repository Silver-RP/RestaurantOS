import IngredientService from "../services/IngredientService";
import { Request, Response } from 'express';

class IngredientController {
    async getAllIngredients(req: Request, res: Response): Promise<any> {
        try {
            const params = {
                maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
                minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
                unit: typeof req.query.unit === 'string' ? req.query.unit : undefined,
                page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
                search: req.query.search?.toString() || '',
                sort: req.query.sort?.toString() || 'createdAt',
                isDeleted: req.query.isDeleted === 'true',
            };

            const ingredients = await IngredientService.getAllIngredients(params);
            return res.status(200).json({
                success: true,
                message: 'All ingredients retrieved successfully',
                data: ingredients,
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async createIngredient(req: Request, res: Response): Promise<any> {
        try {
            const ingredient = await IngredientService.createIngredient(req.body);
            res.status(201).json(ingredient);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateIngredient(req: Request, res: Response) : Promise<any>{
        try {
            const ingredientId = req.params.id;
            const ingredient = await IngredientService.updateIngredient(ingredientId, req.body);
            res.status(200).json(ingredient);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async softDeleteIngredient(req: Request, res: Response) : Promise<any>{
        try {
            const ingredientId = req.params.ingredientId;
            await IngredientService.softDeleteIngredient(ingredientId);
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getTrashIngredients(req: Request, res: Response) : Promise<any>{
        try {
            const ingredients = await IngredientService.getTrashIngredients();
            res.status(200).json(ingredients);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async restoreIngredient(req: Request, res: Response) : Promise<any>{
        try {
            const ingredientId = req.params.ingredientId;
            const ingredient = await IngredientService.restoreIngredient(ingredientId);
            res.status(200).json(ingredient);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async permanentlyDeleteIngredient(req: Request, res: Response) : Promise<any>{
        try {
            const ingredientId = req.params.ingredientId;
            await IngredientService.permanentlyDeleteIngredient(ingredientId);
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

}

export default new IngredientController();