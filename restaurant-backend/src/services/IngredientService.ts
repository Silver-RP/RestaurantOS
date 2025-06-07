import Ingredient, { IIngredient } from "../models/IngredientModel";
import { ingredientSchema } from '../validators/ingredient';
import { IngredientInput } from '../validators/ingredient';
import { PaginateResult } from 'mongoose';

class IngredientService {

    async getAllIngredients(params: {
        maxPrice?: number;
        minPrice?: number;
        unit?: string;
        page?: number;
        limit?: number;
        search?: string;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
        isDeleted?: boolean;
    }): Promise<PaginateResult<IIngredient>> {
        try {
            const {
                page = 1,
                limit = 10,
                search = '',
                sortField = 'name',
                sortOrder = 'asc',
                isDeleted = false,
            } = params;

            const query: any = { isDeleted };
            if (search) {
                query.name = { $regex: search, $options: 'i' };
            }

            const sort: any = {};
            sort[sortField] = sortOrder === 'asc' ? 1 : -1;

            if (params.unit) {
                query.unit = params.unit; 
              }
              
              if (params.minPrice !== undefined || params.maxPrice !== undefined) {
                query.price_per_unit = {};
                if (params.minPrice !== undefined) {
                  query.price_per_unit.$gte = params.minPrice;
                }
                if (params.maxPrice !== undefined) {
                  query.price_per_unit.$lte = params.maxPrice;
                }
              }
              

            const options = {
                page,
                limit,
                sort,
            };

            const result = await Ingredient.paginate(query, options);
            return result;
        } catch (error) {
            console.error("Error fetching ingredients with filters:", error);
            throw new Error("Failed to fetch ingredients");
        }
    }

    async createIngredient(ingredientData: IngredientInput): Promise<IIngredient> {
        const { success, error } = ingredientSchema.safeParse(ingredientData);
        if (!success) {
            throw new Error(`Validation error: ${error.message}`);
        }

        try {
            const allowedFields = {
                name: ingredientData.name,
                unit: ingredientData.unit,
                price_per_unit: ingredientData.price_per_unit
            };
            const newIngredient = new Ingredient(allowedFields);

            return await newIngredient.save();
        } catch (error) {
            console.error("Error creating ingredient:", error);
            throw new Error("Failed to create ingredient");
        }
    }

    async updateIngredient(id: string, ingredientData: IIngredient): Promise<IIngredient | null> {

        const { success, error } = ingredientSchema.safeParse(ingredientData);
        if (!success) {
            throw new Error(`Validation error: ${error.message}`);
        }

        try {
            const allowedFields = {
                name: ingredientData.name,
                unit: ingredientData.unit,
                price_per_unit: ingredientData.price_per_unit
            };

            const updatedIngredient = await Ingredient.findByIdAndUpdate(id, allowedFields, { new: true });

            return updatedIngredient;
        } catch (error) {
            console.error("Error updating ingredient:", error);
            throw new Error("Failed to update ingredient");
        }
    }

    async softDeleteIngredient(id: string): Promise<IIngredient | null> {
        try {
            const ingredient = await Ingredient.findById(id);
            if (!ingredient) {
                throw new Error("Ingredient not found");
            }
            ingredient.isDeleted = true;
            ingredient.deletedAt = new Date();

            return await ingredient.save();
        } catch (error) {
            console.error("Error soft deleting ingredient:", error);
            throw new Error("Failed to soft delete ingredient");
        }
    }

    async getTrashIngredients(): Promise<IIngredient[]> {
        try {
            const ingredients = await Ingredient.find({ isDeleted: true });
            return ingredients;
        } catch (error) {
            console.error("Error fetching trashed ingredients:", error);
            throw new Error("Failed to fetch trashed ingredients");
        }
    }

    async restoreIngredient(id: string): Promise<IIngredient | null> {
        try {
            const ingredient = await Ingredient.findById(id);
            if (!ingredient) {
                throw new Error("Ingredient not found");
            }
            ingredient.isDeleted = false;
            ingredient.deletedAt = null;
            return await ingredient.save();
        } catch (error) {
            console.error("Error restoring ingredient:", error);
            throw new Error("Failed to restore ingredient");
        }
    }

    async permanentlyDeleteIngredient(id: string): Promise<IIngredient | null> {
        try {
            const ingredient = await Ingredient.findByIdAndDelete(id);
            if (!ingredient) {
                throw new Error("Ingredient not found");
            }
            return ingredient;
        } catch (error) {
            console.error("Error permanently deleting ingredient:", error);
            throw new Error("Failed to permanently delete ingredient");
        }
    }


}

export default new IngredientService();