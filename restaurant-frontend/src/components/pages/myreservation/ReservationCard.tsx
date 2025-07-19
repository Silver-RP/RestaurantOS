import React from 'react';
import { IReservation } from '@/types/Reservation.type';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useDispatch } from 'react-redux';
import { openReservationModal } from '@/redux/feature/modal/reservationModalSlice';
interface Props {
  reservation: IReservation;
  onView: () => void;
  onCancel: (reservationId: string) => void;
}

const statusColorMap: Record<IReservation['status'], string> = {
  PENDING: 'text-yellow-400 bg-yellow-400/10',
  CONFIRMED: 'text-green-400 bg-green-400/10',
  CANCELLED: 'text-red-400 bg-red-400/10',
  DONE: 'text-gray-400 bg-gray-400/10',
};

const statusLabelMap: Record<IReservation['status'], string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  CANCELLED: 'Đã hủy',
  DONE: 'Hoàn tất',
};

const seatingMap: Record<string, string> = {
  'standard-hall': 'Bàn tiêu chuẩn',
  'table-4-10': 'Bàn dành cho nhóm',
  'vip-room': 'Phòng VIP',
  'random-table': 'Bàn ngẫu nhiên',
};

const ReservationCard: React.FC<Props> = ({ reservation, onCancel }) => {
  const dispatch = useDispatch();
  const reservationCode = (
    reservation._id?.slice(-6) || '000000'
  ).toUpperCase();

  const tableTypeName =
    seatingMap[reservation.table_type] || reservation.table_type;
  const statusLabel = statusLabelMap[reservation.status] || reservation.status;

  const handleCancelClick = () => {
    confirmAlert({
      overlayClassName: 'custom-overlay',
      customUI: ({ onClose }) => (
        <div className="custom-ui bg-headerBackground text-white p-6 rounded shadow-md max-w-md mx-auto text-center">
          <h2 className="text-xl mb-4 text-red-400 font-semibold">
            Xác nhận hủy
          </h2>
          <p className="mb-6">
            Bạn có chắc chắn muốn hủy đơn đặt bàn này không?
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded"
              onClick={onClose}
            >
              Không
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              onClick={() => {
                onCancel(reservation._id!);
                onClose();
              }}
            >
              Có, hủy đơn
            </button>
          </div>
        </div>
      ),
    });
  };

  return (
    <div className="relative text-white p-4 md:p-6 border border-white/10 rounded-md">
      {/* Mã đơn + Trạng thái */}
      <div className="flex justify-between md:text-sm mb-2 flex-col md:flex-row md:items-center gap-1 md:gap-4">
        <div className="text-white/80 text-lg">
          Mã đơn: <span className="font-medium">{reservationCode}</span>{' '}
          <span className="text-white/50 text-sm">
            (
            {reservation.createdAt
              ? new Date(reservation.createdAt).toLocaleString('vi-VN')
              : 'Không rõ thời gian'}
            )
          </span>
        </div>
        <span
          className={`font-semibold px-2 py-1 rounded ${statusColorMap[reservation.status]}`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Nội dung đặt bàn */}
      <div className="border-y border-white/20 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm flex items-center gap-2">
            <span className="text-secondaryColor uppercase font-semibold">
              Khách:
            </span>
            <span className="text-white/90">{reservation.full_name}</span>
          </p>
          <p className="text-sm flex items-center gap-2">
            <span className="text-secondaryColor uppercase font-semibold">
              Ngày:
            </span>
            <span className="text-white/90">{reservation.date}</span>
          </p>
          <p className="text-sm flex items-center gap-2">
            <span className="text-secondaryColor uppercase font-semibold">
              Giờ:
            </span>
            <span className="text-white/90">{reservation.time}</span>
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm flex items-center gap-2">
            <span className="text-secondaryColor uppercase font-semibold">
              Bàn:
            </span>
            <span className="text-white/90">{tableTypeName}</span>
          </p>
          <p className="text-sm flex items-center gap-2">
            <span className="text-secondaryColor uppercase font-semibold">
              Số lượng người:
            </span>
            <span className="text-white/90">
              {reservation.number_of_people}
            </span>
          </p>
          <p className="text-sm flex items-start gap-2">
            <span className="text-secondaryColor uppercase font-semibold">
              Ghi chú:
            </span>
            <span className="text-white/80 italic">
              {reservation.note?.trim() || '—'}
            </span>
          </p>
        </div>
      </div>

      {/* Các nút hành động */}
      <div className="mt-3 flex justify-end flex-wrap gap-2">
        {reservation.status === 'PENDING' && (
          <button
            className="px-4 py-1.5 text-xs bg-transparent border border-secondaryColor text-white font-normal font-sans hover:bg-secondaryColor hover:text-headerBackground focus:ring-bodyBackground active:bg-secondaryColor/90 active:text-headerBackground"
            onClick={handleCancelClick}
          >
            Hủy đặt bàn
          </button>
        )}

        {reservation.status === 'CONFIRMED' && (
          <button
            className="px-4 py-1.5 text-xs bg-transparent border border-secondaryColor text-white font-normal font-sans"
            disabled
          >
            Yêu cầu huỷ đặt bàn
          </button>
        )}

        {reservation.status === 'CANCELLED' && (
          <button
            className="px-4 py-1.5 text-xs bg-transparent border border-secondaryColor text-white font-normal font-sans"
            disabled
          >
            Đã hủy
          </button>
        )}

        <button
          className="px-4 py-1.5 text-xs bg-transparent border border-secondaryColor text-white font-normal font-sans hover:bg-secondaryColor hover:text-headerBackground"
          onClick={() => dispatch(openReservationModal(reservation._id!))}
        >
          Xem món đã đặt
        </button>
      </div>
    </div>
  );
};

export default ReservationCard;
