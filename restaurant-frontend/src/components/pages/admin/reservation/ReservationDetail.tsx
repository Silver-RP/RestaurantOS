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

  if (!data) return null;

  const items: ReservationItem[] = data.details || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">
            Chi tiết đơn đặt bàn #{data._id.slice(-6).toUpperCase()}
          </span>
        </div>
        <div className="text-sm font-normal text-gray-600">
          {formatDate(data.date, data.time)}
        </div>
      </DialogTitle>

      <DialogContent dividers className="space-y-6 py-4">
        {/* Trạng thái nằm phía trên món ăn */}
        <section>
          <h3 className="text-lg font-semibold mb-2">Cập nhật trạng thái</h3>
          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={newStatus}
              label="Trạng thái"
              onChange={(e) =>
                setNewStatus(e.target.value as ReservationStatus)
              }
            >
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
              <MenuItem value="CANCELLED">CANCELLED</MenuItem>
            </Select>
          </FormControl>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Thông tin khách hàng</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Tên khách hàng</span>
              <div className="font-medium">{data.full_name}</div>
            </div>
            <div>
              <span className="text-gray-500">Số điện thoại</span>
              <div className="font-medium">{data.phone}</div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Thông tin đặt bàn</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Loại bàn</span>
              <div className="font-medium">{data.table_type}</div>
            </div>
            <div>
              <span className="text-gray-500">Số người</span>
              <div className="font-medium">{data.number_of_people}</div>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Ghi chú</span>
              <div className="font-medium">{data.note || 'Không có'}</div>
            </div>
            <div>
              <span className="text-gray-500">Tùy chọn chọn món sau</span>
              <div className="font-medium">
                {data.is_choose_later ? 'Có' : 'Không'}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">
            Thông tin thanh toán & hệ thống
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Email</span>
              <div className="font-medium">{data.email || '-'}</div>
            </div>
            <div>
              <span className="text-gray-500">Loại phòng</span>
              <div className="font-medium">{data.room_type || '-'}</div>
            </div>
            <div>
              <span className="text-gray-500">Phương thức thanh toán</span>
              <div className="font-medium">{data.payment_method || '-'}</div>
            </div>
            <div>
              <span className="text-gray-500">Trạng thái thanh toán</span>
              <div className="font-medium">{data.payment_status || '-'}</div>
            </div>
            <div>
              <span className="text-gray-500">Số tiền cọc</span>
              <div className="font-medium">
                {data.deposit_amount ? formatPrice(data.deposit_amount) : '-'}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Đã thanh toán lúc</span>
              <div className="font-medium">
                {data.paid_at ? formatDate(data.paid_at, '') : '-'}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Ngày tạo</span>
              <div className="font-medium">
                {data.createdAt ? formatDate(data.createdAt, '') : '-'}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Ngày cập nhật</span>
              <div className="font-medium">
                {data.updatedAt ? formatDate(data.updatedAt, '') : '-'}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Mã người dùng</span>
              <div className="font-medium">{data.user_id || '-'}</div>
            </div>
          </div>
        </section>

        {items.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold mb-2">Món ăn đã chọn</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1">Tên món</th>
                  <th className="text-center py-1">Số lượng</th>
                  <th className="text-right py-1">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="py-2 flex items-center gap-2">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.dish_name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <span className="font-medium">{item.dish_name}</span>
                    </td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">
                      {formatPrice(item.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </DialogContent>

      <DialogActions className="bg-gray-50">
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
        <Button
          onClick={handleUpdateStatus}
          variant="contained"
          disabled={newStatus === data.status}
        >
          Cập nhật trạng thái
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationDetailModal;
