/* eslint-disable @typescript-eslint/no-explicit-any */

import { Address } from 'types/Address.type';
import axiosInstance from './axiosInstance';

/**
 * Lấy danh sách địa chỉ của user từ backend (token sẽ xác thực và xác định user).
 * @param userId - KHÔNG còn cần thiết, nhưng vẫn giữ để tương thích hàm gọi cũ
 * @param token - access token để xác thực
 * @returns Danh sách địa chỉ
 */
const BaseURLADDRESS = import.meta.env.VITE_BACKEND_URL; 
export const getAddressesByUserId = async (): Promise<Address[]> => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: Address[];
  }>(`${BaseURLADDRESS}/address/getall`);
  if (!response.data.success) {
    throw new Error('Lỗi khi lấy danh sách địa chỉ');
  }
  
  return response.data.data;
};

export const createAddress = async (
  addressData: {
    full_name: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    street_address: string;
    address_type: 'HOME' | 'WORK' | 'OTHER';
    is_default: boolean;
    lat: number; 
    lon: number; 
  },
): Promise<Address> => {
  const response = await axiosInstance.post<{
    success: boolean;
    data: Address;
  }>(`${import.meta.env.VITE_BACKEND_URL}/address/create`, addressData);

  if (!response.data.success) {
    throw new Error('Tạo địa chỉ thất bại');
  }  
  return response.data.data;
};


/**
 * Gọi API BE để tìm địa chỉ từ từ khóa người dùng nhập (dùng Nominatim qua backend).
 * @param query Địa chỉ người dùng nhập (vd: "274 Nguyễn Văn Lương")
 * @returns Mảng kết quả địa chỉ từ Nominatim
 */
export const searchAddress = async (query: string): Promise<any[]> => {
  if (!query.trim()) return [];

  const response = await axiosInstance.get<any[]>(
    `${BaseURLADDRESS}/address/searchmap`,
    {
      params: { q: query },
    }
  );

  return response.data; 
};

export const deleteAddress = async (id: string) => {
  const res = await axiosInstance.delete(`${BaseURLADDRESS}/address/${id}`);
  return res.data;
};

export const updateAddress = async (id: string, data: any) => {
  const res = await axiosInstance.put(`${BaseURLADDRESS}/address/update/${id}`, data);  
  return res.data;
};