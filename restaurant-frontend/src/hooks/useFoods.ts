/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom"; 
import { fetchAllFoods, fetchFoodByCategory, fetchFoodBySlug } from '../api/FoodApi';
import { FoodResponse, FoodDetail } from '../types/Dish.types';
import { useQuery } from '@tanstack/react-query';

export const useFoods = () => {
 
  const [foods, setFoods] = useState<FoodResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 1,
    nextPage: 2,
  });

  const [searchParams, setSearchParams] = useSearchParams(); 

  useEffect(() => {
    const loadFoods = async () => {
      const page = parseInt(searchParams.get("page") || "1", 10);
      const sort = searchParams.get("sort") || "default";
  
      try {
        const data: FoodResponse = await fetchAllFoods(page, sort);
        setFoods(data as FoodResponse);
        console.log("🔥 API response", data);
        setPagination({
          currentPage: data.page,
          totalPages: data.totalPages,
          hasPrevPage: data.hasPrevPage,
          hasNextPage: data.hasNextPage,
          prevPage: data.prevPage ?? 1,
          nextPage: data.nextPage ?? data.totalPages,
        });
        console.log('setPagination:', pagination);
      } catch (err: any) {
        const message = err?.response?.data?.message || 'Đã xảy ra lỗi khi tải món ăn';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
  
    loadFoods();
  }, [searchParams]);

  return { foods, loading, error, pagination, setPagination, searchParams, setSearchParams };
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