import { CategoryResponse } from 'types/Category.type';
import api from './axiosInstance';

// Hàm fetch toàn bộ category
export const fetchAllCategories = async (): Promise<CategoryResponse> => {
  const res = await api.get<{ data: CategoryResponse }>('/category/getallcategory');
  return res.data.data;
};