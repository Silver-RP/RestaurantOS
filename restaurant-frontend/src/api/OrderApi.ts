// api/OrderApi.ts
import api from './axiosInstance';
import {
  OrderQueryParams,
  OrdersResponse,
  // CancelOrderRequest,
  CreateOrderRequest,
  OrderDetailResponse,
  PlaceOrderRequest,
} from '../types/Order.type';

export async function getOrders(params?: OrderQueryParams): Promise<OrdersResponse> {
  const res = await api.get('/order/user-orders', { params });
  console.log(res.data);
  return res.data;
}

export async function getOrderById(orderId: string): Promise<OrderDetailResponse> {
  const res = await api.get(`/order/${orderId}`);
  console.log(res.data);  
  return res.data;
}

export async function createOrder(data: CreateOrderRequest) {
  const res = await api.post('/order', data);
  return res.data;
}

export async function cancelOrder(orderId: string, reason: string) {
  const res = await api.put(`/order/cancel-order/${orderId}`, { reason });
  return res.data;
}

export async function requestReturn(orderId: string, reason: string) {
  const res = await api.put(`/order/request-return/${orderId}`, { reason });
  return res.data;
}

export async function requestCancel(orderId: string, reason: string) {
  const res = await api.put(`/order/request-cancel/${orderId}`, { reason });
  return res.data;
}

export const placeDirectOrder = async (data: PlaceOrderRequest) => {
  console.log("Placing order with data:", data);
  const res = await api.post('/order/place-order', data);
  return res.data;
};
