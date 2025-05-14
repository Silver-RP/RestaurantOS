import api from './axiosInstance';
import { AddToCartResponse, CartItem } from '../types/Cart.type';

export const addToCart = async (
  dishId: string,
  quantity: number = 1,
): Promise<AddToCartResponse> => {
  try {
    const res = await api.post<{ data: AddToCartResponse }>('/cart/add', {
      dishId,
      quantity,
    });
    return res.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to add to cart';
    throw new Error(errorMessage);
  }
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
  try {
    await api.put(`/cart/update`, { dishId, quantity });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to update cart';
    throw new Error(errorMessage);
  }
};


