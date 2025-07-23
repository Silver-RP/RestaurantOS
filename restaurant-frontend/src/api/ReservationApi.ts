/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from './axiosInstance';
import { IReservation, IReservationDetail } from '@/types/Reservation.type';

export const createReservationApi = async (data: Partial<IReservation>) => {
  const response = await axiosInstance.post('/reservation/create', data);
  return response.data;
};

export const confirmReservationApi = async (reservationId: string) => {
  const response = await axiosInstance.patch(
    `/reservation/${reservationId}/confirm`,
  );
  return response.data.data;
};

export const addReservationItemApi = async (
  data: Partial<IReservationDetail>,
) => {
  const response = await axiosInstance.post('/reservation-detail', data);
  return response.data.data;
};

export const getAllReservationsApi = async (params?: Record<string, any>) => {
  const response = await axiosInstance.get('/reservation', { params });
  return response.data.data;
};

export const getReservationByIdApi = async (id: string) => {
  const response = await axiosInstance.get(`/reservation/${id}`);
  return response.data.data;
};

export const getReservationReservationcodeAndPhoneNumber = async (
  reservationCode: string,
  phoneNumber: string,
) => {
  const response = await axiosInstance.get(
    `/reservation/validate?reservationCode=${reservationCode}&phone=${phoneNumber}`,
  );
  return response.data;
};

export const updateReservationStatusApi = async (
  id: string,
  status: string,
) => {
  const response = await axiosInstance.patch(`/reservation/${id}/status`, {
    status,
  });
  return response.data.data;
};

export const cancelReservationApi = async (id: string) => {
  const response = await axiosInstance.patch(`/reservation/${id}/cancel`);
  return response.data.data;
};

export const restoreReservationApi = async (id: string) => {
  const response = await axiosInstance.patch(`/reservation/${id}/restore`);
  return response.data.data;
};

export const getReservationItemsApi = async (reservationId: string) => {
  const response = await axiosInstance.get(
    `/reservation-detail/${reservationId}`,
  );
  return response.data.data;
};

export const getMyReservationsApi = async (params?: {
  status?: string[] | null;
  page?: number;
  limit?: number;
}) => {
  const query = new URLSearchParams();

  if (params?.status) {
    params.status.forEach((s) => query.append('status', s));
  }
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const res = await axiosInstance.get(
    `/my-reservations/my-reservations${queryString}`,
  );
  return res.data;
};

export const retryReservationPayment = async (reservationId: string) => {
  const response = await axiosInstance.post(
    `/payment/retry-reservation/${reservationId}`,
  );
  return response.data;
};

export const changeReservationPaymentMethod = async (
  reservationId: string,
  paymentMethod: string,
) => {
  const response = await axiosInstance.put(
    `/payment/change-reservation-payment/${reservationId}`,
    { paymentMethod },
  );
  return response.data;
};
