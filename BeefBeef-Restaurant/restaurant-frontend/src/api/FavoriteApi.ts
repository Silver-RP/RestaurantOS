import axiosInstance from './axiosInstance';

export const getFavorites = async () => {
  const response = await axiosInstance.get('/favorite/getFavorites');
  return response.data.data;
};

export const addToFavorites = async (dishId: string) => {
  return axiosInstance.post('/favorite/add', { dishId });
};

export const removeFavorite = async (dishId: string) => {
  return axiosInstance.delete(`/favorite/item/${dishId}`);
};