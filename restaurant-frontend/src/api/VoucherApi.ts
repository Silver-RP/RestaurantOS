import api from './axiosInstance';
import { Voucher } from '../types/Voucher.type';

export const getAllVouchers = () => api.get<Voucher[]>('/voucher/getAllVouchers');
export const createVoucher = (data: Partial<Voucher>) => api.post<Voucher>('/voucher/createVoucher', data);
export const getVoucherById = (id: string) => api.get<Voucher>(`/voucher/getVoucherById/${id}`);
export const updateVoucher = (id: string, data: Partial<Voucher>) => api.put<Voucher>(`/voucher/updateVoucher/${id}`, data);
export const deleteVoucher = (id: string) => api.delete(`/voucher/deleteVoucher/${id}`); 