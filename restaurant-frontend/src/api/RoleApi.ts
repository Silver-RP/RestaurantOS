import axiosInstance from './axiosInstance';

export interface Role {
  _id: string;
  name: string;
}

export const getAllRoles = async (): Promise<Role[]> => {
  const response = await axiosInstance.get('/role/getallrole');
  return response.data.data;
};