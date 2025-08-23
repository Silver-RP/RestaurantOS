/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useReservations } from '@/hooks/useReservations';
import { ReservationStatus } from '@/types/Reservation.type';

interface Props {
  reservationId: string;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

interface ReservationItem {
  _id: string;
  dish_name: string;
  quantity: number;
  total_amount: number;
  image?: string;
}

const ReservationDetailModal: React.FC<Props> = ({
  reservationId,
  open,
  onClose,
  onUpdated,
}) => {
  const { getReservationById, updateReservationStatus } = useReservations();
  const [data, setData] = useState<any>(null);
  const [, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState<ReservationStatus>('PENDING');

  useEffect(() => {
    if (!reservationId || !open) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getReservationById(reservationId);
        setData(res);
        setNewStatus(res.status);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [reservationId, open]);

  const formatDate = (date: string, time: string) => {
    try {
      return `${time} - ${format(new Date(date), 'dd/MM/yyyy', { locale: vi })}`;
    } catch {
      return 'N/A';
    }
  };

  const formatPrice = (price: number) => `${price?.toLocaleString('vi-VN')}₫`;

  const handleUpdateStatus = async () => {
    if (newStatus && newStatus !== data.status) {
      const result = await updateReservationStatus(reservationId, newStatus);
      if (result) {
        if (onUpdated) onUpdated();
        onClose();
      }
    }
  };

  // Helper for status badge (same as index)
  const renderStatusBadge = (status: ReservationStatus) => {
    let colorClass = '';
    let label: string = status;
    switch (status) {
      case 'PENDING':
        colorClass = 'bg-yellow-100 text-yellow-600';
        label = 'Chờ xác nhận';
        break;
      case 'BOOKED':
        colorClass = 'bg-orange-100 text-orange-600';
        label = 'Đã đặt bàn';
        break;
      case 'CANCELLED':
        colorClass = 'bg-red-100 text-red-600';
        label = 'Đã hủy';
        break;
      case 'DONE':
        colorClass = 'bg-green-100 text-green-600';
        label = 'Hoàn thành';
        break;
      default:
        colorClass = 'bg-gray-100 text-gray-600';
        label = status;
    }
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}
      >
        {label}
      </span>
    );
  };

  if (!data) return null;

  const items: ReservationItem[] = data.details || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-gray-50 flex flex-col md:flex-row md:justify-between md:items-center gap-2 border-b">
        <div className="flex items-center gap-3">
          {renderStatusBadge(data.status)}
          <span className="text-xl font-bold">
            Chi tiết đơn đặt bàn #{data._id.slice(-6).toUpperCase()}
          </span>
        </div>
        <div className="text-sm font-normal text-gray-600 md:text-right">
          {formatDate(data.date, data.time)}
        </div>
      </DialogTitle>

      <DialogContent dividers className="space-y-8 py-6 bg-gray-50">
        {/* Trạng thái & cập nhật */}
        <section className="mb-2 pb-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <FormControl fullWidth className="md:max-w-xs">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={newStatus}
                label="Trạng thái"
                onChange={(e) =>
                  setNewStatus(e.target.value as ReservationStatus)
                }
              >
                <MenuItem value="PENDING">Chờ xác nhận</MenuItem>
                <MenuItem value="BOOKED">Đã đặt bàn</MenuItem>
                <MenuItem value="CANCELLED">Đã hủy</MenuItem>
                <MenuItem value="DONE">Hoàn thành</MenuItem>
              </Select>
            </FormControl>
            <Button
              onClick={handleUpdateStatus}
              variant="contained"
              color="primary"
              disabled={newStatus === data.status}
              className="md:ml-4 mt-2 md:mt-0 rounded-full shadow"
              style={{ minWidth: 180 }}
            >
              Cập nhật trạng thái
            </Button>
          </div>
        </section>

        {/* Thông tin khách hàng */}
        <section className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Thông tin khách hàng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="text-gray-500 text-xs">Tên khách hàng</span>
              <div className="font-semibold text-base mt-1">
                {data.full_name}
              </div>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Số điện thoại</span>
              <div className="font-semibold text-base mt-1">{data.phone}</div>
            </div>
          </div>
        </section>

        {/* Thông tin đặt bàn */}
        <section className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Thông tin đặt bàn
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="text-gray-500 text-xs">Loại bàn</span>
              <div className="font-semibold text-base mt-1">
                {data.table_type}
              </div>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Số người</span>
              <div className="font-semibold text-base mt-1">
                {data.number_of_people}
              </div>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Ngày giờ tới ăn</span>
              <div className="font-semibold text-base mt-1">
                {formatDate(data.date, data.time)}
              </div>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-500 text-xs">Ghi chú</span>
              <div className="font-semibold text-base mt-1">
                {data.note || 'Không có'}
              </div>
            </div>
            <div>
              <span className="text-gray-500 text-xs">
                Tùy chọn chọn món sau
              </span>
              <div className="font-semibold text-base mt-1">
                {data.is_choose_later ? 'Có' : 'Không'}
              </div>
            </div>
          </div>
        </section>

        {/* Thông tin thanh toán & hệ thống */}
        <section className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Thông tin thanh toán & hệ thống
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="text-gray-500 text-xs">Email</span>
              <div className="font-semibold text-base mt-1">
                {data.email || '-'}
              </div>
            </div>
            {/* Loại phòng chỉ hiển thị nếu có dữ liệu */}
            {data.room_type && (
              <div>
                <span className="text-gray-500 text-xs">Loại phòng</span>
                <div className="font-semibold text-base mt-1">
                  {data.room_type}
                </div>
              </div>
            )}
            <div>
              <span className="text-gray-500 text-xs">
                Phương thức thanh toán
              </span>
              <div className="font-semibold text-base mt-1">
                {data.payment_method || '-'}
              </div>
            </div>
            <div>
              <span className="text-gray-500 text-xs">
                Trạng thái thanh toán
              </span>
              <div className="mt-1">
                {(() => {
                  switch (data.payment_status) {
                    case 'PAID':
                      return (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                          Đã thanh toán
                        </span>
                      );
                    case 'UNPAID':
                      return (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
                          Chưa thanh toán
                        </span>
                      );
                    case 'FAILED':
                      return (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                          Thất bại
                        </span>
                      );
                    case 'REFUNDED':
                      return (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                          Đã hoàn tiền
                        </span>
                      );
                    default:
                      return '-';
                  }
                })()}
              </div>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Số tiền cọc</span>
              <div className="font-semibold text-base mt-1">
                {data.deposit_amount ? formatPrice(data.deposit_amount) : '-'}
              </div>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Đã thanh toán lúc</span>
              <div className="font-semibold text-base mt-1">
                {data.paid_at
                  ? format(new Date(data.paid_at), 'HH:mm - dd/MM/yyyy', {
                      locale: vi,
                    })
                  : '-'}
              </div>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Ngày tạo</span>
              <div className="font-semibold text-base mt-1">
                {data.createdAt
                  ? format(new Date(data.createdAt), 'HH:mm - dd/MM/yyyy', {
                      locale: vi,
                    })
                  : '-'}
              </div>
            </div>
            <div>
              <span className="text-gray-500 text-xs">Ngày cập nhật</span>
              <div className="font-semibold text-base mt-1">
                {data.updatedAt
                  ? format(new Date(data.updatedAt), 'HH:mm - dd/MM/yyyy', {
                      locale: vi,
                    })
                  : '-'}
              </div>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-500 text-xs">Mã người dùng</span>
              <div className="font-semibold text-base mt-1">
                {data.user_id || '-'}
              </div>
            </div>
          </div>
        </section>

        {/* Món ăn đã chọn */}
        {items.length > 0 && (
          <section className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
              Món ăn đã chọn
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left py-2 px-2">Tên món</th>
                    <th className="text-center py-2 px-2">Số lượng</th>
                    <th className="text-right py-2 px-2">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id} className="border-b last:border-0">
                      <td className="py-2 px-2 flex items-center gap-2">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.dish_name}
                            className="w-10 h-10 rounded object-cover border"
                          />
                        )}
                        <span className="font-medium">{item.dish_name}</span>
                      </td>
                      <td className="text-center font-semibold">
                        {item.quantity}
                      </td>
                      <td className="text-right font-semibold">
                        {formatPrice(item.total_amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </DialogContent>

      <DialogActions className="bg-gray-50 border-t px-6 py-3 flex justify-end">
        <Button
          onClick={onClose}
          variant="outlined"
          className="rounded-full px-6 py-2 font-semibold"
        >
          ĐÓNG
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationDetailModal;
