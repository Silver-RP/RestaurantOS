import axiosInstance from './axiosInstance';
import { User } from 'types/User.type';

/**
 * Lấy thông tin profile của người dùng hiện tại
 * @param userId ID của user đang đăng nhập
 */
export const getProfile = async (
  userId: string,
): Promise<{
  status: string;
  message?: string;
  data: User;
}> => {
  const response = await axiosInstance.get(`/profile/getProfile/${userId}`);
  
  return response.data;
};
/**
 * Cập nhật thông tin cá nhân của người dùng hiện tại
 * @param userId ID của user đang đăng nhập
 * @param data Dữ liệu cần cập nhật (chỉ các trường cho phép)
 */
export const updateProfile = async (
  userId: string,
  data: Partial<User>,
): Promise<{
  status: string;
  message?: string;
  data?: User;
}> => {
  const response = await axiosInstance.put(
    `/profile/updateProfile/${userId}`,
    data,
  );
  return response.data;
};
