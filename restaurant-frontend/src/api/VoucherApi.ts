import api from './axiosInstance';
import { Voucher } from '../types/Voucher.type';

interface VoucherFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: 'active' | 'inactive' | 'expired' | 'out_of_stock';
  type?: 'public' | 'private';
  discount_type?: 'percent' | 'fixed';
  min_discount_value?: number;
  max_discount_value?: number;
  min_order_value?: number;
  max_order_value?: number;
}

export const getAllVouchers = (params?: VoucherFilterParams) => 
  api.get<PaginatedResponse<Voucher>>('/voucher/getAllVouchers', { params });

export const createVoucher = (data: Partial<Voucher>) => 
  api.post<Voucher>('/voucher/createVoucher', data);

export const getVoucherById = (id: string) => 
  api.get<Voucher>(`/voucher/getVoucherById/${id}`);

export const updateVoucher = (id: string, data: Partial<Voucher>) => 
  api.put<Voucher>(`/voucher/updateVoucher/${id}`, data);

export const deleteVoucher = (id: string) => 
  api.delete(`/voucher/deleteVoucher/${id}`);

export const saveVoucherForUser = (voucherId: string) =>
  api.post('/voucher/save-voucher', { voucherId });

export const getPublicActiveVouchers = (params?: { page?: number; limit?: number }) =>
  api.get<PaginatedResponse<Voucher>>(
    '/voucher/public-vouchers',
    { params: { limit: 6, ...params } }
  );

interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  offset: number;
  pagingCounter: number;
} 