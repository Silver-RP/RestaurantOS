// hooks/useFavorites.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toastService } from '@/utils/toastService';
import { addToFavorites as addFavoriteApi, removeFavorite as removeFavoriteApi } from '@/api/FavoriteApi';
import { FavoriteItem } from '@/types/Dish.types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  addFavorite,
  removeFavoriteSuccess,
} from '@/redux/feature/favorite/favoriteSlice';

export const useFavorites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorite.items);

  const addToFavorites = async (dishId: string) => {
    try {
      const response = await addFavoriteApi(dishId);
      const addedItem = response.data;
      dispatch(addFavorite(addedItem));
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
      dispatch(removeFavoriteSuccess(favoriteId));
      toastService.success('Đã xoá khỏi danh sách yêu thích');
    } catch {
      toastService.error('Xoá khỏi danh sách yêu thích thất bại');
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
  };
};