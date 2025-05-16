/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { FavoriteItem } from '@/types/Dish.types';
import { getFavorites } from '@/api/FavoriteApi';
import { toastService } from '@/utils/toastService';

export const useFetchFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFavorites();
      setFavorites(data);
    } catch {
      setError('Tải danh sách yêu thích thất bại');
      toastService.error('Tải danh sách yêu thích thất bại');
    } finally {
      setLoading(false);
    }
  };

  return {
    favorites,
    setFavorites,
    loading,
    error,
    fetchFavorites,
  };
};