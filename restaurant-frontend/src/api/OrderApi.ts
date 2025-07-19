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

export async function getOrders(
  params?: OrderQueryParams,
): Promise<OrdersResponse> {
  const res = await api.get('/order/user-orders', { params });
  return res.data;
}

export async function getOrderById(
  orderId: string,
): Promise<OrderDetailResponse> {
  const res = await api.get(`/order/${orderId}`);
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
  const res = await api.post('/order/place-order', data);
  return res.data;
};

export async function getAllOrders(
  params: OrderQueryParams,
): Promise<OrdersResponse> {
  const res = await api.get('/order/all-orders', { params });
  return res.data;
}

export const getUserOrders = async (params?: OrderQueryParams): Promise<OrdersResponse> => {
  const queryParams = {
    ...params,
    sortType: params?.sortType || 'newest'
  };
  const res = await api.get('/order/user-orders', { params: queryParams });
  return res.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const res = await api.put(`/order/order-status/${orderId}`, { status });
  return res.data;
};

export const updatePaymentStatus = async (paymentId: string, paidAmount: number ) => {
  const res = await api.put(`/payment/payment-status/${paymentId}`, { paidAmount });
  return res.data;
}

export const retryPayment = async (orderId: string) => {
  const res = await api.post(`/payment/retry-payment/${orderId}`);
  return res.data;
}

export const changePaymentMethod = async (orderId: string, paymentMethod: string) => {
  const res = await api.put(`/payment/change-payment/${orderId}`, { paymentMethod });
  return res.data;
}
