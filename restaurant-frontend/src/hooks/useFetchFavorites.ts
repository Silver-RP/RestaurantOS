// hooks/useFetchFavorites.ts
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

      // Ưu tiên lấy từ localStorage trước
      const local = localStorage.getItem('favorites');
      if (local) {
        const parsed = JSON.parse(local);
        dispatch(setFavorites(parsed));
      }

      // Sau đó gọi API để cập nhật lại danh sách mới nhất
      const data = await getFavorites();
      dispatch(setFavorites(data));
      localStorage.setItem('favorites', JSON.stringify(data));
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