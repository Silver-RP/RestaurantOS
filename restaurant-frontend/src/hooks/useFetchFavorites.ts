import { useState, useCallback } from 'react';
import { getFavorites } from '@/api/FavoriteApi';
import { toastService } from '@/utils/toastService';
import { useDispatch } from 'react-redux';
import { setFavorites } from '@/redux/feature/favorite/favoriteSlice';

export const useFetchFavorites = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFavorites();
      dispatch(setFavorites(data));
    } catch {
      setError('Tải danh sách yêu thích thất bại');
      toastService.error('Tải danh sách yêu thích thất bại');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return {
    loading,
    error,
    fetchFavorites,
  };
};