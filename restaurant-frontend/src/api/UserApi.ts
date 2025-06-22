import axiosInstance from './axiosInstance';
import { FilterUserParams, User } from 'types/User.type';

export type UserQueryParams = {
  keyword?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
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
// export const createUser = async (formData: FormData): Promise<User> => {
//   const response = await axiosInstance.post<{
//     status: string;
//     message: string;
//     data: User;
//   }>('/user/createUser', formData);

//   return response.data.data;
// };
export const updateUserInfoAPI = async (
  userId: string,
  data: Partial<User>
): Promise<{ status: string; message: string; data: User }> => {
  const res = await axiosInstance.put(`/user/updateUser/${userId}`, data);
  console.log(res.data);
  
  return res.data;
};

export const addUser = async (
  userData: Partial<User>
): Promise<{ status: string; message: string; data: User }> => {
  const res = await axiosInstance.post('/user/addUser', userData);
  return res.data;
};

export const checkUserPassword = async (
  userId: string,
  password: string
): Promise<{
  status: string;
  message: string;
  match: boolean;
}> => {
  const response = await axiosInstance.post(`/user/check-password/${userId}`, {
    password,
  });

  return response.data;
};

export const toggleUserBlockStatus = async (userId: string) => {
  const res = await axiosInstance.post(`/user/blockUser/${userId}`);
    console.log(res.data);
  return res.data;
};

export const filterUsers = async (
  params: FilterUserParams,
): Promise<{
  users: User[];
  totalDocs: number;
  totalPages: number;
  page: number;
  pageSize: number;
}> => {
  const response = await axiosInstance.get('/user/filterUser', { params });

  const data = response.data?.data || {};

  return {
    users: data.users || [],
    totalDocs: data.metadata?.total || 0,
    totalPages: data.metadata?.totalPages || 1,
    page: data.metadata?.page || 1,
    pageSize: data.metadata?.pageSize || 10,
  };
};

export const getAllStaffApi = async (): Promise<{users: User[]}> => {
  const response = await axiosInstance.get('/staff/getAllStaff');
  return response.data.data;
  
}