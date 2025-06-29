import { Dish } from '../models/DishModel';
import Ingredient, { IIngredient } from '../models/IngredientModel';
import { ingredientSchema } from '../validators/ingredientValidator';
import { IngredientInput } from '../validators/ingredientValidator';
import { PaginateResult } from 'mongoose';

class IngredientService {
  async getAllIngredients(params: {
    maxPrice?: number;
    minPrice?: number;
    unit?: string;
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    isDeleted?: boolean;
  }): Promise<PaginateResult<IIngredient>> {
    try {
      const {
        page = 1,
        limit = 12,
        search = '',
        sort = '',
        isDeleted = false,
        unit,
        minPrice,
        maxPrice,
      } = params;

      const query: any = { isDeleted };

      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }

      if (unit) {
        query.unit = unit;
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        query.price_per_unit = {};
        if (minPrice !== undefined) {
          query.price_per_unit.$gte = minPrice;
        }
        if (maxPrice !== undefined) {
          query.price_per_unit.$lte = maxPrice;
        }
      }

      const sortMapping: Record<string, Record<string, 1 | -1>> = {
        nameAZ: { name: 1 },
        nameZA: { name: -1 },
        unitAZ: { unit: 1 },
        unitZA: { unit: -1 },
        priceLow: { price_per_unit: 1 },
        priceHigh: { price_per_unit: -1 },
      };

      const sortOption = sortMapping[sort] || { createdAt: -1 };

      const result = await Ingredient.paginate(query, {
        page,
        limit,
        sort: sortOption,
      });

      return result;
    } catch (error) {
      console.error('Error fetching ingredients with filters:', error);
      throw new Error('Failed to fetch ingredients');
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
        slug: ingredientData.slug,
        unit: ingredientData.unit,
        price_per_unit: ingredientData.price_per_unit,
      };
      const newIngredient = new Ingredient(allowedFields);

      return await newIngredient.save();
    } catch (error) {
      console.error('Error creating ingredient:', error);
      throw new Error('Failed to create ingredient');
    }
  }

  async getIngredientBySlug(slug: string): Promise<IIngredient | null> {
    try {
      const ingredient = await Ingredient.findOne({ slug });
      console.log('Ingredient found:', slug);
      console.log(ingredient);
      if (!ingredient) {
        throw new Error('Ingredient not found');
      }
      return ingredient;
    } catch (error) {
      console.error('Error fetching ingredient by slug:', error);
      throw new Error('Failed to fetch ingredient by slug');
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
        slug: ingredientData.slug,
        unit: ingredientData.unit,
        price_per_unit: ingredientData.price_per_unit,
      };

      const updatedIngredient = await Ingredient.findByIdAndUpdate(id, allowedFields, {
        new: true,
      });

      return updatedIngredient;
    } catch (error) {
      console.error('Error updating ingredient:', error);
      throw new Error('Failed to update ingredient');
    }
  }

  async softDeleteIngredient(id: string): Promise<IIngredient | null> {
    try {
      const ingredient = await Ingredient.findById(id);
      if (!ingredient) {
        throw new Error('Ingredient not found');
      }
      ingredient.isDeleted = true;
      ingredient.deletedAt = new Date();

      return await ingredient.save();
    } catch (error) {
      console.error('Error soft deleting ingredient:', error);
      throw new Error('Failed to soft delete ingredient');
    }
  }

  async getAllTrashIngredients(params: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }): Promise<PaginateResult<IIngredient>> {
    try {
      const { page = 1, limit = 12, search = '', sort = '' } = params;

      const query: any = {};
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }

      query.isDeleted = true;

      const sortMapping: Record<string, Record<string, 1 | -1>> = {
        nameAZ: { name: 1 },
        nameZA: { name: -1 },
        unitAZ: { unit: 1 },
        unitZA: { unit: -1 },
        priceLow: { price_per_unit: 1 },
        priceHigh: { price_per_unit: -1 },
      };

      const sortOption = sortMapping[sort] || { createdAt: -1 };

      const result = await Ingredient.paginate(query, {
        page,
        limit,
        sort: sortOption,
      });

      return result;
    } catch (error) {
      console.error('Error fetching ingredients with filters:', error);
      throw new Error('Failed to fetch ingredients');
    }
  }

  async restoreIngredient(id: string): Promise<IIngredient | null> {
    try {
      const ingredient = await Ingredient.findById(id);
      if (!ingredient) {
        throw new Error('Ingredient not found');
      }
      ingredient.isDeleted = false;
      ingredient.deletedAt = null;
      return await ingredient.save();
    } catch (error) {
      console.error('Error restoring ingredient:', error);
      throw new Error('Failed to restore ingredient');
    }
  }

  async permanentlyDeleteIngredient(id: string): Promise<IIngredient | null> {
    try {
      const ingredient = await Ingredient.findById(id);
      if (!ingredient) {
        throw new Error('Ingredient not found');
      }

      const usedInFood = await Dish.exists({ 'ingredients.ingredient': id });
      if (usedInFood) {
        throw new Error('Không thể xoá: Nguyên liệu đang được sử dụng trong món ăn.');
      }

      // Kiểm tra báo cáo (tuỳ mô hình bạn)
      // const usedInReports = await Report.exists({ "ingredients.ingredient": id });
      // if (usedInReports) {
      //     throw new Error("Không thể xoá: Nguyên liệu có trong báo cáo thống kê.");
      // }

      // Kiểm tra tồn tại trong quản lý kho
      // const usedInInventory = await Inventory.exists({ ingredient: id });
      // if (usedInInventory) {
      //     throw new Error("Không thể xoá: Nguyên liệu tồn tại trong quản lý kho.");
      // }

      // Nếu không bị ràng buộc, cho phép xoá
      const deleted = await Ingredient.findByIdAndDelete(id);
      return deleted;
    } catch (error) {
      console.error('Error permanently deleting ingredient:', error);
      throw new Error((error as Error).message || 'Failed to permanently delete ingredient');
    }
  }
}

export default new IngredientService();
