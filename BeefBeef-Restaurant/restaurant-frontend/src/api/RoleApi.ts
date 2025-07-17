import axiosInstance from './axiosInstance';

export interface Permission {
  _id: string;
  permission_name: string;
  description: string;
}

export interface Role {
  _id: string;
  name: string;
  description?: string;
  permissions?: Permission[];
}

export const getAllRoles = async (): Promise<Role[]> => {
  const response = await axiosInstance.get('/role/getallrole');
  console.log('getAllRoles response', response);
  return response.data || [];
};
