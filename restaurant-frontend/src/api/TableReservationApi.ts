import axiosInstance from './axiosInstance';

export const holdTableApi = async (data: {
  table_code: string;
  heldBy?: string;
  date: string;
  time: string;
}) => {
  const response = await axiosInstance.post('/table-reservations/hold', data);
  return response.data.data;
};

export const releaseTableApi = async (data: { table_code: string }) => {
  const response = await axiosInstance.post(
    '/table-reservations/release',
    data,
  );
  return response.data.data;
};

export const getAllTableStatusApi = async () => {
  const response = await axiosInstance.get('/table-reservations');
  return response.data.data;
};
