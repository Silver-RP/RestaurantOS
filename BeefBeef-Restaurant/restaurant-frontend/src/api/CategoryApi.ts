import api from './axiosInstance';
import { Category, CategoryResponse, CategoryCreatePayload } from '../types/Category.type';

export const fetchAllCategories = async (): Promise<CategoryResponse> => {
  const res = await api.get<CategoryResponse>('/category/getallcategory');
  return res.data;
};

export const fetchCategoryById = async (id: string): Promise<Category> => {
  const res = await api.get(`/category/getcategorybyid/${id}`);
  return res.data;
};

export const addCategory = async (formData: FormData): Promise<CategoryCreatePayload> => {
  const res = await api.post('/category/addcategory', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

export const updateCategory = async (id: string, formData: FormData) => {
  const res = await api.put(`/category/update/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};


export const deleteCategory = async (id: string): Promise<{ message: string }> => {
  const res = await api.delete(`/category/delete/${id}`);
  return res.data;
};