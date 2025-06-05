/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { toastService } from '@/utils/toastService';
import {
  createReservationApi,
  getAllReservationsApi,
  getMyReservationsApi,
  getReservationByIdApi,
  updateReservationStatusApi,
  addReservationItemApi,
} from '@/api/ReservationApi';
import { IReservation } from '@/types/reservation.type';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export const useReservations = () => {
  const currentUser = useSelector((state: RootState) => state.user.user);
  const createReservation = async (data: Partial<IReservation>) => {
    if (!currentUser?._id) {
      toastService.warning('Vui lòng đăng nhập để đặt bàn');
      return;
    }
  
    try {
      const res = await createReservationApi(data);
      toastService.success('Đặt bàn thành công');
      return res;
    } catch (error: any) {
      console.error('❌ Lỗi khi gọi createReservationApi:', error?.response || error);
      toastService.error(
        error?.response?.data?.message || 'Lỗi khi đặt bàn',
      );
    }
  };

  const addReservationItem = async (data: any) => {
    try {
      return await addReservationItemApi(data);
    } catch (error: any) {
      console.error('❌ Lỗi khi gọi addReservationItemApi:', error?.response || error);
      toastService.error(
        error?.response?.data?.message || 'Không thể thêm món ăn vào đơn đặt bàn',
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

  const getMyReservations = useCallback(async (params?: {
    status?: string[] | null;
    page?: number;
    limit?: number;
  }) => {
    try {
      return await getMyReservationsApi(params);
    } catch {
      toastService.error('Không thể tải lịch sử đặt bàn');
    }
  }, []);

  const getReservationById = async (id: string) => {
    try {
      return await getReservationByIdApi(id);
    } catch {
      toastService.error('Không tìm thấy thông tin đặt bàn');
    }
  };

  const updateReservationStatus = async (
    id: string,
    status: IReservation['status'],
  ) => {
    try {
      const res = await updateReservationStatusApi(id, status);
      toastService.success('Huỷ đơn hàng thành công!');
      return res;
    } catch {
      toastService.error('Cập nhật trạng thái thất bại');
    }
  };

  //   const deleteReservation = async (id: string) => {
  //     try {
  //       await deleteReservationApi(id);
  //       toastService.success('Xoá đặt bàn thành công');
  //     } catch {
  //       toastService.error('Xoá đặt bàn thất bại');
  //     }
  //   };

  return {
    createReservation,
    getAllReservations,
    getMyReservations,
    getReservationById,
    updateReservationStatus,
    addReservationItem,
  };
};
