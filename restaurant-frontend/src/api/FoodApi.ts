import api from './axiosInstance';
import { FoodDetail } from 'types/Dish.types';

export const fetchAllFoods = async (): Promise<FoodDetail[]> => {
  const res = await api.get<{ data: FoodDetail[] }>('/food/getallfood');
  return res.data.data;
};

export const fetchFoodBySlug = async (slug: string): Promise<FoodDetail> => {
  const res = await api.get<{ data: FoodDetail }>(`/food/getfoodbyslug/${slug}`);
  return res.data.data;
};

export const fetchFoodByCategory = async (cateType: string): Promise<FoodDetail[]> => {
  const res = await api.get<{ data: FoodDetail[] }>(`/food/getFoodByCategory?Cate_type=${cateType}`);
  console.log('DATA FROM API:', res.data.data);
  return res.data.data;
};
