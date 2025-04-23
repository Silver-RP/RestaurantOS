import api from './axiosInstance';
import { FoodDetail, FoodResponse } from 'types/Dish.types';

export const fetchAllFoods = async (page: number, sort: string): Promise<FoodResponse> => {
  const res = await api.get<{ data: FoodResponse }>(`/food/getallfood?page=${page}&sort=${sort}`);
  return res.data.data;
};

// export const fetchAllFoods = async (page: number, sort: string): Promise<FoodResponse> => {
//   const res = await api.get(`/food/getallfood?page=${page}&sort=${sort}`);
//   return res.data;
// };


export const fetchFoodBySlug = async (slug: string): Promise<FoodDetail> => {
  const res = await api.get<{ data: FoodDetail }>(`/food/getfoodbyslug/${slug}`);
  return res.data.data;
};

export const fetchFoodByCategory = async (cateType: string): Promise<FoodDetail[]> => {
  const res = await api.get<{ data: FoodDetail[] }>(`/food/getFoodByCategory?Cate_type=${cateType}`);
  return res.data.data;
};
