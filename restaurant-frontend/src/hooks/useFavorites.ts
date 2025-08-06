// hooks/useFavorites.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toastService } from '@/utils/toastService';
import {
  addToFavorites as addFavoriteApi,
  removeFavorite as removeFavoriteApi,
} from '@/api/FavoriteApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  addFavorite,
  removeFavoriteSuccess,
} from '@/redux/feature/favorite/favoriteSlice';
import Cookies from 'js-cookie'; 

import { useFetchFavorites } from './useFetchFavorites'; // 👈

export const useFavorites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorite.items);
  const { fetchFavorites } = useFetchFavorites(); // 👈
  // const currentUser = useSelector((state: RootState) => state.user.user);
  const addToFavorites = async (dishId: string) => {
    const userInfo = Cookies.get('userInfo');
    // if (!currentUser?._id) {
    //   toastService.warning('Vui lòng đăng nhập để thêm vào yêu thích');
    //   return;
    // }
    if (!userInfo) {
      toastService.warning('Vui lòng đăng nhập để thêm vào yêu thích');
      return;
    }

  
    try {
      const response = await addFavoriteApi(dishId);
      dispatch(addFavorite(response.data));
      fetchFavorites(); 
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
      fetchFavorites(); 
    } catch {
      toastService.error('Xoá khỏi danh sách yêu thích thất bại');
    }
  };

  const toggleFavorite = async (dishId: string) => {
    const existing = favorites.find((fav) => fav.dishId?._id === dishId);
    if (existing) {
      await removeFromFavorites(existing._id);
    } else {
      await addToFavorites(dishId);
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
  };
};