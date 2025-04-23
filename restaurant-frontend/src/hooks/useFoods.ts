/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { fetchAllFoods, fetchFoodByCategory, fetchFoodBySlug } from '../api/FoodApi';
import { FoodDetail } from '../types/Dish.types';
import { useQuery } from '@tanstack/react-query';

export const useFoods = () => {
  const [foods, setFoods] = useState<FoodDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const data = await fetchAllFoods();
        setFoods(data);
      } catch (err: any) {
        const message = err?.response?.data?.message || 'Đã xảy ra lỗi khi tải món ăn';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadFoods();
  }, []);

  return { foods, loading, error };
};

export const useFoodDetail = (slug: string) => {
  const [food, setFood] = useState<FoodDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFood = async () => {
      try {
        const data = await fetchFoodBySlug(slug);
        setFood(data);
      } catch (err: any) {
        const message = err?.response?.data?.message || 'Đã xảy ra lỗi khi tải món ăn';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadFood();
    }
  }, [slug]);

  return { food, loading, error };
};


export const useDishByCategory = (cateType: string) => {
  return useQuery<FoodDetail[]>({
    queryKey: ["dishByCategory", cateType],
    queryFn: () => fetchFoodByCategory(cateType),
    enabled: !!cateType, 
    refetchOnWindowFocus: false,
  });
};