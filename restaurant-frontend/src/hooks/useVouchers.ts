import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllVouchers,
  createVoucher,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  getPublicActiveVouchers,
  saveVoucherForUser,
  UserVoucher,
  getUserVouchers,
  getTrashVouchers,
  restoreVoucher,
  forceDeleteVoucher,
} from '../api/VoucherApi';
import { Voucher } from '../types/Voucher.type';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface BackendErrorResponse {
  error?: string;
  message?: string;
}

interface VoucherFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: 'active' | 'inactive' | 'expired' | 'out_of_stock';
  discount_type?: 'percent' | 'fixed';
  min_discount_value?: number;
  max_discount_value?: number;
  min_order_value?: number;
  max_order_value?: number;
}

export const useVouchers = (params?: VoucherFilterParams) => {
  return useQuery({
    queryKey: ['vouchers', params],
    queryFn: () => getAllVouchers(params),
  });
};

export const useCreateVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Voucher>) => createVoucher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      toast.success('Tạo voucher thành công!');
    },
    onError: (err: AxiosError<BackendErrorResponse>) => {
      const errorMessage = err?.response?.data?.error || err?.response?.data?.message;
      if (typeof errorMessage === 'string' && errorMessage.includes('E11000')) {
        toast.error('Mã voucher này đã tồn tại. Vui lòng sử dụng mã khác.');
      } else {
        toast.error(errorMessage || 'Tạo voucher thất bại!');
      }
    },
  });
};

export const useUpdateVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Voucher> }) => updateVoucher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      toast.success('Cập nhật voucher thành công!');
    },
    onError: (err: AxiosError<BackendErrorResponse>) => {
      const errorMessage = err?.response?.data?.error || err?.response?.data?.message;
      if (typeof errorMessage === 'string' && errorMessage.includes('E11000')) {
        toast.error('Mã voucher này đã tồn tại. Vui lòng sử dụng mã khác.');
      } else {
        toast.error(errorMessage || 'Cập nhật voucher thất bại!');
      }
    },
  });
};

export const useDeleteVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVoucher(id),
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
    queryFn: () => getVoucherById(id),
    enabled: !!id,
  });
};

export const useSaveVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation<UserVoucher, unknown, string>({
    mutationFn: (voucherId: string) => saveVoucherForUser(voucherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-active-vouchers'] });
      queryClient.invalidateQueries({ queryKey: ['user-vouchers'] });
      toast.success('Lưu mã voucher thành công!');
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<BackendErrorResponse>;
      toast.error(err?.response?.data?.error || err?.response?.data?.message || 'Lưu mã voucher thất bại!');
    },
  });
};

export const usePublicActiveVouchers = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['public-active-vouchers', params],
    queryFn: () => getPublicActiveVouchers(params),
  });
};

export const useUserVouchers = () => {
  return useQuery({
    queryKey: ['user-vouchers'],
    queryFn: getUserVouchers,
  });
};

export const useTrashVouchers = (params?: VoucherFilterParams) => {
  return useQuery({
    queryKey: ['trash-vouchers', params],
    queryFn: () => getTrashVouchers(params),
  });
};

export const useRestoreVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash-vouchers'] });
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      toast.success('Khôi phục voucher thành công!');
    },
    onError: (err: AxiosError<BackendErrorResponse>) => {
      toast.error(err?.response?.data?.error || err?.response?.data?.message || 'Khôi phục voucher thất bại!');
    },
  });
};

export const useForceDeleteVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => forceDeleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash-vouchers'] });
      toast.success('Xóa vĩnh viễn voucher thành công!');
    },
    onError: (err: AxiosError<BackendErrorResponse>) => {
      toast.error(err?.response?.data?.error || err?.response?.data?.message || 'Xóa vĩnh viễn voucher thất bại!');
    },
  });
}; 