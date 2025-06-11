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

export const fetchFoodNewest = async (): Promise<FoodDetail[]> => {
  const res = await api.get<{ data: FoodDetail[] }>('/food/getFoodNewest');
  return res.data.data;
};

export const fetchFoodBest4 = async (
  categoryId: string,
): Promise<FoodDetail[]> => {
  const res = await api.get(`/food/getFoodBest4?category=${categoryId}`);
  return res.data?.data || [];
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

export const createFoodApi = async (formData: FormData): Promise<void> => {
  try {
    const res = await api.post('/food/createfood', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error creating food:', error);
    throw error;
  }
}

export const updateFoodApi = async (formData: FormData, foodId:string): Promise<void> => {
  try {
    const res = await api.put(`/food/updatefood/${foodId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error updating food:', error);
    throw error;
  }
}

export const softDeleteFood = async (foodId: string): Promise<void> => {
  try {
    const res = await api.delete(`/food/softDeleteFood/${foodId}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting food:', error);
    throw error;
  }
}

export const getSoftDeleteFood = async (
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
    `/food/trashFood?${queryString.toString()}`,
  );
  return res.data.data;
};

export const restoreFoodAPI = async (foodId: string): Promise<void> => {
  try {
    const res = await api.patch(`/food/restoreDish/${foodId}`);
    return res.data;
  } catch (error) {
    console.error('Error restoring food:', error);
    throw error;
  }
}

export const permanentlyDeleteFoodAPI = async (foodId: string): Promise<void> => {
  try {
    const res = await api.delete(`/food/deleteFood/${foodId}`);
    return res.data;
  } catch (error) {
    console.error('Error permanently deleting food:', error);
    throw error;
  }
}

export const fetchDishIngredientsApi = async (dishId: string): Promise<any> => {
  try {
    const res = await api.get(`/food/${dishId}/ingredients`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching dish ingredients:', error);
    throw error;
  }
};

export const addDishIngredientApi = async (ingredientData: any, dishId: string): Promise<any> => {
  try {
    const res = await api.post(`/food/${dishId}/ingredients`, ingredientData);
    return res.data;
  } catch (error) {
    console.error('Error adding dish ingredient:', error);
    throw error;
  }
}

export const updateDishIngredientApi = async (dishIngredientData: any, dishId: string): Promise<any> => {
  try {
    const res = await api.put(`/food/${dishId}/ingredients`, dishIngredientData);
    return res.data;
  } catch (error) {
    console.error('Error updating dish ingredient:', error);
    throw error;
  }
}

export const deleteDishIngredientApi = async (_ids: string[], dishId: string): Promise<any> => {
  try {
    const res = await api.delete(`/food/${dishId}/ingredients`, {
      data: { ids: _ids },
      });
    return res.data;
  } catch (error) {
    console.error('Error deleting dish ingredient:', error);
    throw error;
  }
}
