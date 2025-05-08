import api from './axiosInstance';
import { Category, CategoryResponse } from '../types/Category.type';

export const fetchAllCategories = async (): Promise<CategoryResponse> => {
    const res = await api.get<CategoryResponse>('/category/getallcategory');
    return res.data;
  };

  export const fetchCategoryById = async (id: string): Promise<Category> => {
    const res = await api.get(`/category/getcategorybyid/${id}`);
    return res.data;
  };