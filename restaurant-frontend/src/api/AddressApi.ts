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
  // Đảm bảo trả về đầy đủ các trường địa chỉ cho FE
  return response.data.data.map((item) => ({
    ...item,
    full_display: `${item.street_address}, ${item.ward}, ${item.district}, ${item.province}`,
  }));
};

export const createAddress = async (
  addressData: {
    full_name: string;
    district: string;
    phone: string;
    province: string;
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
  console.log('Địa chỉ đã được tạo thành công:', response.data.data);
  
  return response.data.data;
};

export const deleteAddress = async (id: string) => {
  const res = await axiosInstance.delete(`${BaseURLADDRESS}/address/${id}`);
  return res.data;
};

export const updateAddress = async (id: string, data: any) => {
  const res = await axiosInstance.put(`${BaseURLADDRESS}/address/update/${id}`, data);  
  return res.data;
};

export const getProvinces = async (): Promise<any[]> => {
  const response = await axiosInstance.get(`${BaseURLADDRESS}/address/provinces`);
  return response.data;
};

export const getDistrictsByProvinceCode = async (provinceCode: string): Promise<any[]> => {
  const response = await axiosInstance.get(`${BaseURLADDRESS}/address/districts`, {
    params: { provinceCode }
  });
  return response.data;
};

export const getWardsByDistrictCode = async (districtCode: string): Promise<any[]> => {
  const response = await axiosInstance.get(`${BaseURLADDRESS}/address/wards`, {
    params: { districtCode }
  });
  return response.data;
};