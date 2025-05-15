import axiosInstance from './axiosInstance';
import { User } from 'types/User.type';

export const getUserById = async (userId: string, token: string): Promise<User> => {
  const response = await axiosInstance.get<{
    status: string;
    message: string;
    data: User;
  }>(`${import.meta.env.VITE_BACKEND_URL}/user/getUserById/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};
export const updateUserInfoAPI = async (
  userId: string,
  data: Partial<User>
): Promise<{ status: string; message: string; data: User }> => {
  const res = await axiosInstance.put(`/user/updateUser/${userId}`, data);
  return res.data;
};