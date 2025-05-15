// api/OrderApi.ts
import api from './axiosInstance';
import {
  OrderQueryParams,
  OrdersResponse,
  CancelOrderRequest,
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
  return res.data;
}

export async function createOrder(data: CreateOrderRequest) {
  const res = await api.post('/order', data);
  return res.data;
}

export async function cancelOrder(data: CancelOrderRequest) {
  const res = await api.post('/order/cancel', data);
  return res.data;
}


export const placeDirectOrder = async (data: PlaceOrderRequest) => {
  console.log("Placing order with data:", data);
  const res = await api.post('/order/place-order', data);
  return res.data;
};
