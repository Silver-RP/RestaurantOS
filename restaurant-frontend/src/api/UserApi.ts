import axios from 'axios';
import { User } from 'types/User.type';

export const getUserById = async (userId: string, token: string): Promise<User> => {
  const response = await axios.get<{
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