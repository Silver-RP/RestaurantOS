import { useEffect, useState } from 'react';
import { FavoriteItem } from '@/types/Dish.types';
import { getFavorites } from '@/api/favoriteApi';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavorites();
      setFavorites(data);
    } catch (err) {
      setError('Không thể tải danh sách yêu thích');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    favorites,
    setFavorites,
    loading,
    error,
    refetch: fetchFavorites,
  };
};