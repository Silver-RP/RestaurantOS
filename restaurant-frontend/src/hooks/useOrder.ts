// hooks/useOrder.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  placeDirectOrder,
} from '@/api/OrderApi';
import {
  OrderQueryParams,
  CancelOrderRequest,
  CreateOrderRequest,
  PlaceOrderRequest,
} from '../types/Order.type';

export const useOrders = (params: OrderQueryParams) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getOrders(params),
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CancelOrderRequest) => cancelOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => createOrder(data),
  });
};

export const useOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });
};

export const usePlaceDirectOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PlaceOrderRequest) => placeDirectOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
