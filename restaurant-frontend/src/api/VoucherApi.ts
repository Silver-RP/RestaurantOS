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

export async function getAllVouchers(params?: VoucherFilterParams) {
  const res = await api.get<PaginatedResponse<Voucher>>('/voucher/getAllVouchers', { params });
  return res.data;
}

export async function createVoucher(data: Partial<Voucher>) {
  const res = await api.post<Voucher>('/voucher/createVoucher', data);
  return res.data;
}

export async function getVoucherById(id: string) {
  const res = await api.get<Voucher>(`/voucher/getVoucherById/${id}`);
  return res.data;
}

export async function updateVoucher(id: string, data: Partial<Voucher>) {
  const res = await api.put<Voucher>(`/voucher/updateVoucher/${id}`, data);
  return res.data;
}

export async function deleteVoucher(id: string) {
  const res = await api.delete(`/voucher/deleteVoucher/${id}`);
  return res.data;
}

export async function restoreVoucher(id: string) {
  const res = await api.put(`/voucher/restoreVoucher/${id}`);
  return res.data;
}

export interface UserVoucher {
  _id: string;
  user_id: string | { _id: string; [key: string]: unknown };
  voucher_id: string | { _id: string; [key: string]: unknown };
  status: 'saved' | 'used' | 'expired';
  createdAt?: string;
  updatedAt?: string;
}

export async function saveVoucherForUser(voucherId: string) {
  const res = await api.post<UserVoucher>('/voucher/save-voucher', { voucherId });
  return res.data;
}

export async function getPublicActiveVouchers(params?: { page?: number; limit?: number }) {
  const res = await api.get<PaginatedResponse<Voucher>>(
    '/voucher/public-vouchers',
    { params: { limit: 12, ...params } }
  );
  return res.data;
}

export async function getUserVouchers() {
  const res = await api.get<Voucher[]>('/voucher/user-vouchers');
  return res.data;
}

export async function getTrashVouchers(params?: VoucherFilterParams) {
  const res = await api.get<PaginatedResponse<Voucher>>('/voucher/getTrashVouchers', { params });
  return res.data;
}

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