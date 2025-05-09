import api from './axiosInstance';
import { FoodDetail, FoodResponse } from 'types/Dish.types';

export interface FetchFoodsParams {
  page?: number;
  limit?: number;
  sort?: string;
  priceMin?: number;
  priceMax?: number;
  category?: string;
  search?: string; 
}
export const fetchAllFoods = async (params: FetchFoodsParams): Promise<FoodResponse> => {
  const queryString = new URLSearchParams();

  if (params.page !== undefined) queryString.set('page', params.page.toString());
  if (params.limit !== undefined) queryString.set('limit', params.limit.toString());
  if (params.sort) queryString.set('sort', params.sort);
  if (params.priceMin !== undefined) queryString.set('priceMin', params.priceMin.toString());
  if (params.priceMax !== undefined) queryString.set('priceMax', params.priceMax.toString());
  if (params.category) queryString.set('category', params.category);
  if (params.search) queryString.set('search', params.search);

  const res = await api.get<{ data: FoodResponse }>(`/food/getallfood?${queryString.toString()}`);
  console.log(res.data)
  return res.data.data;
};

export const fetchFoodBySlug = async (slug: string): Promise<FoodDetail> => {
  const res = await api.get<{ data: FoodDetail }>(`/food/getfoodbyslug/${slug}`);
  return res.data.data;
};

export const fetchFoodNewest = async (): Promise<FoodResponse> => {
  const res = await api.get<{ data: FoodResponse }>('/food/getFoodNewest');
  return res.data.data;
};

export const fetchFoodBest4 = async (): Promise<FoodResponse> => {
  const res = await api.get<{ data: FoodResponse }>('/food/getFoodBest4');
  return res.data.data;
};

export const fetchFoodByFavorite = async (type: string): Promise<FoodDetail[]> => {
  try {
    const res = await api.get<{ data: FoodDetail[] }>('/food/getFoodByFavorites', {
      params: { type },
    });
    return res.data.data;
  } catch (error) {
    console.error('Error fetching food by favorite:', error);
    return [];
  }
};

export const countFoodView = async (foodId: string): Promise<void> => {
  try {
    await api.post(`/food/countFoodView/${foodId}`);
  } catch (error) {
    console.error('Error counting food view:', error);
  }
}


