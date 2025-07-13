/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from './axiosInstance';
import { ITable } from '@/types/Table.type';

export const getAllTablesApi = async (params?: Record<string, any>) => {
  const response = await axiosInstance.get('/tables', { params });
  return response.data.data;
};

export const getTableByCodeApi = async (code: string) => {
  const response = await axiosInstance.get(`/tables/${code}`);
  return response.data.data;
};

export const createTableApi = async (data: Partial<ITable>) => {
  const response = await axiosInstance.post('/tables', data);
  return response.data.data;
};

export const updateTableApi = async (code: string, data: Partial<ITable>) => {
  const response = await axiosInstance.patch(`/tables/${code}`, data);
  return response.data.data;
};

export const toggleTableAvailabilityApi = async (code: string) => {
  const response = await axiosInstance.patch(`/tables/${code}/toggle`);
  return response.data.data;
};

export const deleteTableApi = async (code: string) => {
  const response = await axiosInstance.delete(`/tables/${code}`);
  return response.data.data;
};
