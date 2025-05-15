import { useEffect, useState } from 'react';
import { FavoriteItem } from '@/types/Dish.types';
import {
  getFavorites,
  addToFavorites,
  removeFavorite,
} from '@/api/FavoriteApi';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch favorites
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

  // Add a dish to favorites
  const handleAddToFavorites = async (dishId: string) => {
    try {
      const newFavorite = await addToFavorites(dishId);
      setFavorites((prev) => [...prev, newFavorite]);
    } catch (err) {
      console.error('Add favorite error:', err);
    }
  };

  // Remove a dish from favorites
  const handleRemoveFavorite = async (dishId: string) => {
    try {
      await removeFavorite(dishId);
      setFavorites((prev) => prev.filter((item) => item.dishId !== dishId));
    } catch (err) {
      console.error('Remove favorite error:', err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    favorites,
    loading,
    error,
    refetch: fetchFavorites,
    addToFavorites: handleAddToFavorites,
    removeFromFavorites: handleRemoveFavorite,
  };
};
