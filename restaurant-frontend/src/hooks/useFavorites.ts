// hooks/useFavorites.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toastService } from '@/utils/toastService';
import { addToFavorites as addFavoriteApi, removeFavorite as removeFavoriteApi } from '@/api/FavoriteApi';
import { FavoriteItem } from '@/types/Dish.types';
import { useState } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const addToFavorites = async (dishId: string) => {
    try {
      const response = await addFavoriteApi(dishId);
      const addedItem = response.data;
      setFavorites((prev) => [...prev, addedItem]);
      toastService.success('Đã thêm vào danh sách yêu thích');
    } catch (err: any) {
      if (err?.response?.status === 409) {
        toastService.warning('Món ăn đã có trong danh sách yêu thích');
      } else {
        toastService.error('Thêm vào yêu thích thất bại');
      }
    }
  };

  const removeFromFavorites = async (favoriteId: string) => {
    try {
      await removeFavoriteApi(favoriteId);
      setFavorites((prev) => prev.filter((item) => item._id !== favoriteId));
      toastService.success('Đã xoá khỏi danh sách yêu thích');
    } catch {
      toastService.error('Xoá khỏi danh sách yêu thích thất bại');
    }
  };

  return {
    favorites,
    setFavorites,
    addToFavorites,
    removeFromFavorites,
  };
};