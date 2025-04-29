import api from './axiosInstance';
import { CategoryResponse } from '../types/Category.type';

export const fetchAllCategories = async (): Promise<CategoryResponse> => {
    const res = await api.get<CategoryResponse>('/category/getallcategory');
    return res.data;
  };