// hooks/useOrder.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOrderById,
  sendInvoiceEmail,
  createOrder,
  cancelOrder,
  placeDirectOrder,
  requestReturn,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  retryPayment,
  changePaymentMethod,
  getUserOrders,
} from '@/api/OrderApi';
import { retryReservationPayment, changeReservationPaymentMethod } from '@/api/ReservationApi';
import { checkIsLoggedIn } from './useCart';
import {
  OrderQueryParams,
  // CancelOrderRequest,
  CreateOrderRequest,
  PlaceOrderRequest,
} from '../types/Order.type';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface ChangePaymentMethodPayload {
  objectId: string;
  paymentMethod: string;
  objectType: 'order' | 'reservation';
}


export const useOrders = (params: OrderQueryParams) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getUserOrders(params),
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true
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
      toast.success('Đơn hàng đã được hủy thành công');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng');
    }
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
      toast.success('Yêu cầu trả hàng đã được gửi thành công');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      if (error.response?.data?.message === 'Return request must be made within 30 minutes of delivery') {
        toast.error('Đã quá thời gian yêu cầu trả hàng (30 phút sau khi giao hàng)');
      } else {
        toast.error('Có lỗi xảy ra khi gửi yêu cầu trả hàng');
      }
    }
  });
};

export const useSendInvoiceEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, email }: { orderId: string; email?: string }) =>
      sendInvoiceEmail(orderId, email),
    onSuccess: () => {
      toast.success('Gửi hóa đơn thành công');
      queryClient.invalidateQueries({ queryKey: ['order'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi hóa đơn');
    }
  });
}

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
    { paymentId: string; paidAmount: number }
  >({
    mutationFn: ({ paymentId, paidAmount }) => updatePaymentStatus(paymentId, paidAmount),
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
    mutationFn: async ({ type, id }: { type: 'order' | 'reservation'; id: string }) => {
      if (type === 'order') {
        return retryPayment(id);
      } else if (type === 'reservation') {
        return retryReservationPayment(id);
      } else {
        throw new Error('Loại thanh toán không hợp lệ');
      }
    },
    onSuccess: (res) => {
      if (res.postPayment?.redirectUrl) {
        window.location.href = res.postPayment.redirectUrl;
        return;
      }
      toast.success('Thanh toán lại thành công');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || 'Có lỗi xảy ra khi thanh toán lại';
      toast.error(errorMessage);
    },
  });
};

export const useHandleChangePaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ objectType, objectId, paymentMethod }: ChangePaymentMethodPayload) => {
      console.log('Changing payment method:', { objectType, objectId, paymentMethod });
      if (objectType === 'order') {
        return changePaymentMethod(objectId, paymentMethod); 
      } else if (objectType === 'reservation') {
        return changeReservationPaymentMethod(objectId, paymentMethod); 
      } else {
        throw new Error('Loại thanh toán không hợp lệ');
      }
    },

    onSuccess: (res, variables) => {
      const { objectType } = variables;

      if (objectType === 'order') {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['all-orders'] });
        queryClient.invalidateQueries({ queryKey: ['order'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['reservations'] });
        queryClient.invalidateQueries({ queryKey: ['all-reservations'] });
        queryClient.invalidateQueries({ queryKey: ['reservation'] });
      }

      toast.success('Thay đổi phương thức thanh toán thành công');
      console.log('Change payment method response:', res);
      console.log('Banking info:', res.postPayment?.bankingInfo);

      setTimeout(() => {
        if (res.postPayment?.redirectUrl) {
          window.location.href = res.postPayment.redirectUrl;
        }
      }, 2000);
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        'Có lỗi xảy ra khi thay đổi phương thức thanh toán';
      toast.error(errorMessage);
    },
  });
};
