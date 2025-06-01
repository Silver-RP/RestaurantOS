// hooks/useOrder.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  placeDirectOrder,
  requestReturn,
  requestCancel,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  retryPayment,
  changePaymentMethod,
} from '@/api/OrderApi';
import { checkIsLoggedIn } from './useCart';
import {
  OrderQueryParams,
  // CancelOrderRequest,
  CreateOrderRequest,
  PlaceOrderRequest,
  OrdersResponse,
} from '../types/Order.type';
import { toast } from 'react-toastify';

export const useOrders = (params: OrderQueryParams) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getOrders(params),
  });
};

export const useAllOrders = (params: OrderQueryParams) => {
  return useQuery({
    queryKey: ['all-orders', params],
    queryFn: () => {
      if (!checkIsLoggedIn()) {
        return Promise.resolve(null);
      }
      return getAllOrders(params);
    },
    enabled: checkIsLoggedIn(),
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
      cancelOrder(orderId, reason),
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

export const useRequestReturn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
      requestReturn(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useRequestCancel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
      requestCancel(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      toast.success('Cập nhật trạng thái đơn hàng thành công');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng';
      toast.error(errorMessage);
    },
  });
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ReturnType<typeof updatePaymentStatus>,
    Error,
    { orderId: string; paidAmount: number }
  >({
    mutationFn: ({ orderId, paidAmount }) => updatePaymentStatus(orderId, paidAmount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      toast.success('Cập nhật trạng thái thanh toán thành công');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        'Có lỗi xảy ra khi cập nhật trạng thái thanh toán';
      toast.error(errorMessage);
    },
  });
};

export const useHandleRetryPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId }: { orderId: string; }) =>
      retryPayment(orderId),
    onSuccess: (res) => {
      if (res.postPayment?.redirectUrl) {
        window.location.href = res.postPayment.redirectUrl;
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      toast.success('Thanh toán thành công');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        'Có lỗi xảy ra khi thanh toán';
      toast.error(errorMessage);
    },
  });
}

export const useHandleChangePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, paymentMethod }: { orderId: string; paymentMethod: string }) =>
      changePaymentMethod(orderId, paymentMethod),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      toast.success('Thay đổi phương thức thanh toán thành công');
      console.log('Change payment method response:', res);
      console.log('Change Bankingresponse:', res.postPayment?.bankingInfo);

      setTimeout(() => {
      if (res.postPayment?.redirectUrl) {
        window.location.href = res.postPayment.redirectUrl;
        return;
      }
    }, 2000)},
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        'Có lỗi xảy ra khi thay đổi phương thức thanh toán';
      toast.error(errorMessage);
    },
  });
}