import api from './axiosInstance';
import { IngredientResponse, IngredientFilterParams } from '@/types/IngredientType';

export const fetchAllIngredients = async ( params: IngredientFilterParams): Promise<IngredientResponse> => {
  const queryString = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      !(typeof value === 'string' && value.trim() === '')
    ) {
      queryString.set(key, value.toString());
    }
  });

  const res = await api.get<{
    docs: IngredientResponse | PromiseLike<IngredientResponse>; 
    data: IngredientResponse}>(
    `/ingredients/getall-ingredients?${queryString.toString()}`,
  );

  return res.data.data;
};

export const createIngredientApi = async (data: {
name: string;
slug: string;
unit: string;
group?: string;
subGroup?: string;
price_per_unit: number;
lowStockThreshold?: number;
}): Promise<void> => {
  try {
    const res = await api.post('/ingredients/create-ingredients', data);
    return res.data;
  } catch (error) {
    console.error('Error creating ingredient:', error);
    throw error;
  }
};

export const getIngredientBySlugApi = async (slug: string): Promise<IngredientResponse> => {
  try {
    const res = await api.get(`/ingredients/get-ingredients/${slug}`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching ingredient by slug:', error);
    throw error;
  }
}

export const updateIngredientApi = async (data: {
  name: string;
  slug: string;
  unit: string;
  group?: string;
  subGroup?: string;
  price_per_unit: number;
  lowStockThreshold?: number;
  }, ingredientId: string): Promise<void> => {
  try {
    const res = await api.put(`/ingredients/update-ingredients/${ingredientId}`, data);
    return res.data;
  } catch (error) {
    console.error('Error updating ingredient:', error);
    throw error;
  }
};

export const softDeleteIngredientApi = async (ingredientId: string): Promise<void> => {
  try {
    const res = await api.delete(`/ingredients/softDelete-ingredients/${ingredientId}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    throw error;
  }
};

export const getIngredientTrashedApi = async (
  params: IngredientFilterParams,
): Promise<IngredientResponse> => {
  const queryString = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      !(typeof value === 'string' && value.trim() === '')
    ) {
      queryString.set(key, value.toString());
    }
  });

  const res = await api.get<{ data: IngredientResponse }>(
    `/ingredients/trash-ingredients?${queryString.toString()}`,
  );
  return res.data.data;
};

export const restoreIngredientAPI = async (ingredientId: string): Promise<void> => {
  try {
    const res = await api.patch(`/ingredients/restore-ingredients/${ingredientId}`);
    return res.data;
  } catch (error) {
    console.error('Error restoring ingredient:', error);
    throw error;
  }
};

export const permanentlyDeleteIngredientAPI = async (ingredientId: string): Promise<void> => {
  try {
    const res = await api.delete(`/ingredients/delete-ingredients/${ingredientId}`);
    return res.data as void; 
  } catch (error) {
    console.error('Error permanently deleting ingredient:', error);
    throw error;
  }
};
