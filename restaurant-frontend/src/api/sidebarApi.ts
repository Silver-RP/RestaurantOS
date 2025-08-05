import axiosInstance from './axiosInstance';

export const fetchSidebarData = async () => {
  const res = await axiosInstance.get('/sidebar');
  return res.data;
};
