import axiosInstance from './axiosInstance';
import { User } from 'types/User.type';

export type UserQueryParams = {
  keyword?: string;
  page?: number;
  limit?: number;
};

export const getUserById = async (userId: string): Promise<User> => {
  const response = await axiosInstance.get<{
    status: string;
    message: string;
    data: User;
  }>(`/user/getUserById/${userId}`);

  return response.data.data;
};

export const getAllUsers = async (
  params: UserQueryParams
): Promise<{
  users: User[];
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
}> => {
  const response = await axiosInstance.get('/user/getAllUser', { params });

  const data = response.data?.data || {};

  return {
    users: data.docs || [],
    totalDocs: data.totalDocs || 0,
    totalPages: data.totalPages || 1,
    page: data.page || 1,
    limit: data.limit || 10,
  };
};
// hàm này chưa đúng
export const createUser = async (formData: FormData): Promise<User> => {
  const response = await axiosInstance.post<{
    status: string;
    message: string;
    data: User;
  }>('/user/createUser', formData);

  return response.data.data;
};