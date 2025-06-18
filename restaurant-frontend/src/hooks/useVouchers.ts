import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllVouchers,
  createVoucher,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
} from '../api/VoucherApi';
import { Voucher } from '../types/Voucher.type';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface BackendErrorResponse {
  error?: string;
  message?: string;
}

export const useVouchers = () => {
  return useQuery({
    queryKey: ['vouchers'],
    queryFn: () => getAllVouchers().then(res => res.data),
  });
};

export const useCreateVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Voucher>) => {
      const {
        code,
        description,
        discount_type,
        discount_value,
        max_discount_value,
        min_order_value,
        quantity,
        start_date,
        end_date,
      } = data;
      return createVoucher({
        code,
        description,
        discount_type,
        discount_value,
        max_discount_value,
        min_order_value,
        quantity,
        start_date,
        end_date,
      }).then(res => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      toast.success('Tạo voucher thành công!');
    },
    onError: (err: AxiosError<BackendErrorResponse>) => {
      toast.error(err?.response?.data?.error || err?.response?.data?.message || 'Tạo voucher thất bại!');
    },
  });
};

export const useUpdateVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Voucher> }) => {
      const {
        description,
        discount_type,
        discount_value,
        max_discount_value,
        min_order_value,
        quantity,
        start_date,
        end_date,
      } = data;
      return updateVoucher(id, {
        description,
        discount_type,
        discount_value,
        max_discount_value,
        min_order_value,
        quantity,
        start_date,
        end_date,
      }).then(res => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      toast.success('Cập nhật voucher thành công!');
    },
    onError: (err: AxiosError<BackendErrorResponse>) => {
      toast.error(err?.response?.data?.error || err?.response?.data?.message || 'Cập nhật voucher thất bại!');
    },
  });
};

export const useDeleteVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVoucher(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      toast.success('Xóa voucher thành công!');
    },
    onError: (err: AxiosError<BackendErrorResponse>) => {
      toast.error(err?.response?.data?.error || err?.response?.data?.message || 'Xóa voucher thất bại!');
    },
  });
};

export const useVoucherById = (id: string) => {
  return useQuery({
    queryKey: ['voucher', id],
    queryFn: () => getVoucherById(id).then(res => res.data),
    enabled: !!id,
  });
}; 