/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { toastService } from '@/utils/toastService';
import {
  createReservationApi,
  getAllReservationsApi,
  getMyReservationsApi,
  getReservationByIdApi,
  updateReservationStatusApi,
  cancelReservationApi,
  restoreReservationApi,
  addReservationItemApi,
} from '@/api/ReservationApi';
import { IReservation } from '@/types/reservation.type';
import { useAuth } from './useAuth';

export const useReservations = () => {
  const { currentUser, isAuthenticated } = useAuth();

  const createReservation = async (data: Partial<IReservation>) => {
    if (!isAuthenticated || !currentUser?._id) {
      toastService.warning('Vui lòng đăng nhập để đặt bàn');
      return;
    }

    try {
      const res = await createReservationApi(data);
      toastService.success('Đặt bàn thành công');
      return res;
    } catch (error: any) {
      console.error(
        '❌ Lỗi khi gọi createReservationApi:',
        error?.response || error,
      );
      toastService.error(error?.response?.data?.message || 'Lỗi khi đặt bàn');
    }
  };

  const addReservationItem = async (data: any) => {
    try {
      return await addReservationItemApi(data);
    } catch (error: any) {
      console.error(
        '❌ Lỗi khi gọi addReservationItemApi:',
        error?.response || error,
      );
      toastService.error(
        error?.response?.data?.message ||
          'Không thể thêm món ăn vào đơn đặt bàn',
      );
    }
  };

  const getAllReservations = useCallback(async () => {
    try {
      return await getAllReservationsApi();
    } catch {
      toastService.error('Không thể tải danh sách đặt bàn');
    }
  }, []);

  const getMyReservations = useCallback(async (params?: any) => {
    try {
      return await getMyReservationsApi(params);
    } catch {
      toastService.error('Không thể tải danh sách đặt bàn của bạn');
    }
  }, []);

  const getReservationById = useCallback(async (id: string) => {
    try {
      return await getReservationByIdApi(id);
    } catch {
      toastService.error('Không thể tải thông tin đặt bàn');
    }
  }, []);

  const updateReservationStatus = useCallback(
    async (id: string, status: string) => {
      try {
        const res = await updateReservationStatusApi(id, status);
        toastService.success('Cập nhật trạng thái thành công');
        return res;
      } catch (error: any) {
        toastService.error(
          error?.response?.data?.message || 'Cập nhật trạng thái thất bại',
        );
      }
    },
    [],
  );

  const cancelReservation = useCallback(async (id: string) => {
    try {
      const res = await cancelReservationApi(id);
      toastService.success('Hủy đặt bàn thành công');
      return res;
    } catch (error: any) {
      toastService.error(
        error?.response?.data?.message || 'Hủy đặt bàn thất bại',
      );
    }
  }, []);

  const restoreReservation = useCallback(async (id: string) => {
    try {
      const res = await restoreReservationApi(id);
      toastService.success('Khôi phục đặt bàn thành công');
      return res;
    } catch (error: any) {
      toastService.error(
        error?.response?.data?.message || 'Khôi phục đặt bàn thất bại',
      );
    }
  }, []);

  return {
    createReservation,
    addReservationItem,
    getAllReservations,
    getMyReservations,
    getReservationById,
    updateReservationStatus,
    cancelReservation,
    restoreReservation,
  };
};
