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
  status?: string;
  discountMin?: number;
  discountMax?: number;
  stockMin?: number;
  stockMax?: number;
  viewsMin?: number;
  viewsMax?: number;
  orderedMin?: number;
  orderedMax?: number;
  ratingMin?: number;
  ratingMax?: number;
}

export const fetchAllFoods = async (
  params: FetchFoodsParams,
): Promise<FoodResponse> => {
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

  const res = await api.get<{ data: FoodResponse }>(
    `/food/getallfood?${queryString.toString()}`,
  );
  return res.data.data;
};

export const fetchFoodBySlug = async (slug: string): Promise<FoodDetail> => {
  const res = await api.get<{ data: FoodDetail }>(
    `/food/getfoodbyslug/${slug}`,
  );
  return res.data.data;
};

export const fetchFoodNewest = async (): Promise<FoodResponse> => {
  const res = await api.get<{ data: FoodResponse }>('/food/getFoodNewest');
  return res.data.data;
};

export const fetchFoodBest4 = async (
  categoryId: string,
): Promise<FoodResponse> => {
  const res = await api.get<{ data: FoodResponse }>(
    `/food/getFoodBest4?category=${categoryId}`,
  );
  return res.data.data;
};

export const fetchFoodByFavorite = async (
  type: string,
): Promise<FoodDetail[]> => {
  try {
    const res = await api.get<{ data: FoodDetail[] }>(
      '/food/getFoodByFavorites',
      {
        params: { type },
      },
    );
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
};

export const fetchFoodBySearch = async ({ search, page, limit }: FetchFoodsParams): Promise<FoodResponse> => {
  const res = await api.get<{ data: FoodResponse }>(
    `/food/getFoodBySearch`,
    {
      params: {
        keyword: search,
        page,
        limit
      },
    }
  );
  console.log('res', res);
  return res.data.data;
};


