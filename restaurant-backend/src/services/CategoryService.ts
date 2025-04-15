import mongoose from "mongoose";
import Category from "../models/CategoryModel";
import { Request, Response } from "express";
import { Model } from "mongoose";

class CategoryService {
  // async GetAllCategory(req: Request, res: Response): Promise<any> {
  //   try {
  //     const categories = await Category.find();
  //     if (categories.length === 0) {
  //       return res.status(404).json({ message: "No categories found!" });
  //     }

  //     return res.status(200).json(categories);
  //   } catch (error) {
  //     return res.status(500).json(error);
  //   }
  // }

  async GetAllCategory(req: Request, res: Response): Promise<any> {
    try {
      const { page = 1, limit = 10 } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      const skip = (pageNumber - 1) * limitNumber;

      const totalCategories = await Category.countDocuments();

      const categories = await Category.find().skip(skip).limit(limitNumber);

      if (categories.length === 0) {
        return res.status(404).json({ message: 'No categories found!' });
      }

      return res.status(200).json({
        total: totalCategories,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalCategories / limitNumber),
        data: categories,
      });
    } catch (error) {
      return res.status(500).json({ message: 'An error occurred', error });
    }
  }

  async AddCategory(req: Request, res: Response): Promise<any> {
    try {
      const { name, image, classify, sub } = req.body;

      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category already exiting!' });
      }

      const newCategory = new Category({ name, image, classify, sub });
      await newCategory.save();
      return res.status(201).json({ message: 'Created successfully!' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async GetCategoryById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found!' });
      }

      return res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  }

  async UpdateCategory(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { name, image, classify, sub } = req.body;

      const category = await Category.findByIdAndUpdate(
        id,
        { name, image, classify, sub },
        { new: true, runValidators: true },
      );
      if (!category) {
        return res.status(404).json({ message: 'Category not found!' });
      }

      return res.status(200).json({ message: 'Updated successfully!' });
    } catch (error) {
      return res.status(500).json({ message: 'An error occurred', error });
    }
  }

  async DeleteCategory(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;

      const hasSub = await Category.findOne({ sub: id });
      if (hasSub) {
        return res
          .status(400)
          .json({ message: 'Cannot delete category with subcategories!' });
      }

      const DeleteCategory = await Category.findByIdAndDelete(id);
      if (!DeleteCategory) {
        return res.status(404).json({ message: 'Category not found!' });
      }
      return res.status(200).json({ message: 'Deleted successfully!' });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async sortData(
  model: Model<any>,
  fieldName: string,
  order: 'asc' | 'desc' = 'asc',
): Promise<any> {
  const sortOrder = order === 'asc' ? 1 : -1; 
  const data = await model.find().sort({ [fieldName]: sortOrder });

  return data;
}
}

export default new CategoryService();