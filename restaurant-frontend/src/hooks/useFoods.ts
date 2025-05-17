import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  fetchAllFoods,
  fetchFoodByFavorite,
  fetchFoodBySlug,
  fetchFoodNewest,
  fetchFoodBest4,
  FetchFoodsParams,
} from '../api/FoodApi';
import { FoodResponse, FoodDetail } from '../types/Dish.types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useFoodsAdmin = () => {
  const [foods, setFoods] = useState<FoodResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 12,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 1,
    nextPage: 2,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const parseFiltersFromSearchParams = (
    params: URLSearchParams
  ): FetchFoodsParams => {
    const getNumber = (key: string) => {
      const value = params.get(key);
      return value ? Number(value) : undefined;
    };

    return {
      page: getNumber('page') || 1,
      limit: getNumber('limit') || 12,
      sort: params.get('sort') || 'default',
      search: params.get('keyword') || undefined, 

      category: params.get('category') || undefined,
      status: params.get('status') || undefined,

      priceMin: getNumber('priceMin'),
      priceMax: getNumber('priceMax'),

      discountMin: getNumber('discountMin'),
      discountMax: getNumber('discountMax'),

      stockMin: getNumber('stockMin'),
      stockMax: getNumber('stockMax'),

      viewsMin: getNumber('viewsMin'),
      viewsMax: getNumber('viewsMax'),

      orderedMin: getNumber('orderedMin'),
      orderedMax: getNumber('orderedMax'),

      ratingMin: getNumber('ratingMin'),
      ratingMax: getNumber('ratingMax'),
    };
  };

  useEffect(() => {
    let isMounted = true;

    const loadFoods = async () => {
      setLoading(true);
      setError(null);

      try {
        const filters = parseFiltersFromSearchParams(searchParams);
        const data = await fetchAllFoods(filters);

        if (isMounted) {
          setFoods(data);
          setPagination({
            currentPage: data.page,
            totalPages: data.totalPages,
            limit: data.limit,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevPage: data.prevPage ?? 1,
            nextPage: data.nextPage ?? data.totalPages,
          });
        }
      } catch (error) {
        if (isMounted) {
          const err = error as AxiosError<{ message?: string }>;
          setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải món ăn');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadFoods();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  return {
    foods,
    loading,
    error,
    pagination,
    setPagination,
    searchParams,
    setSearchParams,
  };
};


export const useFoods = () => {
  const [foods, setFoods] = useState<FoodResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 12,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 1,
    nextPage: 2,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const loadFoods = async () => {
      const page = parseInt(searchParams.get('page') || '1', 10);
      const sortParam = searchParams.get('sort') || 'default';
      const priceMin = searchParams.get('priceMin');
      const priceMax = searchParams.get('priceMax');
      const category = searchParams.get('category');
      const search = searchParams.get('search');
      const limit = Number(searchParams.get('limit')) || 12;

      setLoading(true);
      setError(null);

      try {
        const params: FetchFoodsParams = {
          page,
          sort: sortParam,
          priceMin: priceMin ? Number(priceMin) : undefined,
          priceMax: priceMax ? Number(priceMax) : undefined,
          category: category || undefined,
          search: search || undefined,
          limit,
        };

        const data = await fetchAllFoods(params);
        setFoods(data);
        setPagination({
          currentPage: data.page,
          totalPages: data.totalPages,
          limit: data.limit,
          hasPrevPage: data.hasPrevPage,
          hasNextPage: data.hasNextPage,
          prevPage: data.prevPage ?? 1,
          nextPage: data.nextPage ?? data.totalPages,
        });
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải món ăn');
      } finally {
        setLoading(false);
      }
    };

    loadFoods();
  }, [searchParams]);

  return {
    foods,
    loading,
    error,
    pagination,
    setPagination,
    searchParams,
    setSearchParams,
  };
};

export const useFoodDetail = (slug: string) => {
  const [food, setFood] = useState<FoodDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFood = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchFoodBySlug(slug);
        setFood(data);
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải món ăn');
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

export const useDishByFavoriteCategory = (cateType: string) => {
  return useQuery<FoodDetail[]>({
    queryKey: ['dishByFavoriteCategory', cateType],
    queryFn: () => fetchFoodByFavorite(cateType),
    enabled: !!cateType,
    refetchOnWindowFocus: false,
  });
};

export const useFoodNewest = () => {
  return useQuery<FoodResponse>({
    queryKey: ['foodNewest'],
    queryFn: () => fetchFoodNewest(),
    refetchOnWindowFocus: false,
  });
};

export const useFoodBest4 = (categoryId: string) => {
  return useQuery<FoodResponse>({
    queryKey: ['foodBest4', categoryId],
    queryFn: () => fetchFoodBest4(categoryId),
    refetchOnWindowFocus: false,
  });
};

function useDebounce(search: any, arg1: number) {
  throw new Error('Function not implemented.');
}
