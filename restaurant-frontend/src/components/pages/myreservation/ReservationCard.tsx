import React from 'react';
import { IReservation } from '@/types/reservation.type';
import ButtonComponents from '../../common/ButtonComponents';
import { FaUtensils } from 'react-icons/fa';

interface Props {
  reservation: IReservation;
  onView: () => void;
}

const statusColorMap: Record<IReservation['status'], string> = {
  PENDING: 'text-yellow-400 bg-yellow-400/10',
  CONFIRMED: 'text-green-400 bg-green-400/10',
  CANCELLED: 'text-red-400 bg-red-400/10',
  DONE: 'text-gray-400 bg-gray-400/10',
};

const ReservationCard: React.FC<Props> = ({ reservation, onView }) => {
  return (
    <div className="w-full bg-[#152a3d] rounded-xl border border-secondaryColor/30 shadow-md p-5 mb-5 text-sm text-white space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
        <div className="flex items-center gap-2">
          <span>📅</span>
          <span><strong>Ngày:</strong> {reservation.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>⏰</span>
          <span><strong>Giờ:</strong> {reservation.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>👤</span>
          <span><strong>Khách:</strong> {reservation.full_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🍽</span>
          <span><strong>Bàn:</strong> {reservation.table_type}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>📌</span>
          <span>
            <strong>Trạng thái:</strong>{' '}
            <span className={`font-semibold px-2 py-1 rounded ${statusColorMap[reservation.status]}`}>
              {reservation.status}
            </span>
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-white/10">
        <div className="flex flex-wrap gap-4 pt-4">
          <ButtonComponents
            size="small"
            variant="filled"
            onClick={onView}
            className="rounded-full px-6 py-2 bg-secondaryColor text-headerBackground font-bold shadow hover:bg-yellow-400/90 transition"
          >
            Xem chi tiết
          </ButtonComponents>
          {!reservation.is_choose_later && (
            <button
              onClick={onView}
              className="flex items-center gap-2 text-sm text-secondaryColor hover:underline hover:text-yellow-300 transition"
            >
              <FaUtensils className="text-base" /> Xem món đã chọn
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;