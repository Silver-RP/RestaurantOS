import axiosInstance from './axiosInstance';

export const getFavorites = async () => {
  const response = await axiosInstance.get('/favorites');
  return response.data.data;
};

export const removeFavorite = async (foodId: string) => {
  return axiosInstance.delete(`/favorites/${foodId}`);
};

export const updateFavoriteQuantity = async (foodId: string, quantity: number) => {
  return axiosInstance.put(`/favorites/${foodId}`, { quantity });
};