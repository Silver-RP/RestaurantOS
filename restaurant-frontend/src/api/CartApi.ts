import api from './axiosInstance';
import { AddToCartResponse, CartItem } from '../types/Cart.type';

export const addToCart = async (
  dishId: string,
  quantity: number = 1,
): Promise<AddToCartResponse> => {
  const res = await api.post<{ data: AddToCartResponse }>('/cart/add', {
    dishId,
    quantity,
  });
  return res.data.data;
};

export const getCart = async (): Promise<CartItem> => {
  const res = await api.get<{ data: CartItem }>('/cart/getCart');
  return res.data.data;
};

export const deleteCartItem = async (dishId: string): Promise<void> => {
  await api.delete(`/cart/item/${dishId}`);
};

// cart/update/{id}
export const updateCartItem = async (dishId: string, quantity: number): Promise<void> => {
  await api.put(`/cart/update/${dishId}`, { quantity });
};


