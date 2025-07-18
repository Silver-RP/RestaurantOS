import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getReservationReservationcodeAndPhoneNumber } from '@/api/ReservationApi';
import { IReservation } from '@/types/Reservation.type';
import { useReservations } from '@/hooks/useReservations';
import { reservationStatusMapping } from '@/components/pages/myreservation/NavigationReservation';

interface Props {
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

const ReservationCard = () => {
  const [searchParams] = useSearchParams();
  const [reservation, setReservation] = useState<IReservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const code = searchParams.get('reservationCode')?.toLocaleLowerCase() || '';
  const phone = searchParams.get('phone');
  const { updateReservationStatus } = useReservations();

  useEffect(() => {
    if (code && phone) {
      getReservationReservationcodeAndPhoneNumber(code, phone)
        .then((data) => {
          setReservation(data.data);
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError(true);
    }
  }, [code, phone]);

  const tableTypeName = reservation
    ? seatingMap[reservation.table_type] || reservation.table_type
    : '';

  const statusLabel = reservation
    ? statusLabelMap[reservation.status] || reservation.status
    : '';

    const handleCancel = async (reservationId: string) => {
            setLoading(true);
            await updateReservationStatus(reservationId, 'CANCELLED');
            if (code && phone) {
                const data = await getReservationReservationcodeAndPhoneNumber(code, phone);
                setReservation(data.data);
            }
            setLoading(false);
        };
      

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
                handleCancel(reservation?._id || '');
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

  const orderItems = reservation?.order_items || [];
  console.log('Reservation Data:', reservation);

  if (loading) return <p className="text-white">Đang tải dữ liệu...</p>;
  if (error || !reservation)
    return <p className="text-white">Không tìm thấy đơn đặt bàn.</p>;

  return (
    <div className="relative text-white bg-bodyBackground p-4 md:p-6 border border-white/10">
      {/* Header */}
      <div className="flex justify-between flex-col md:flex-row md:items-center gap-2 mb-2">
        <div className="text-white/80 text-lg">
          Mã đơn: <span className="font-medium">{code}</span>{' '}
          <span className="text-white/50 text-sm">
            (
            {reservation.createdAt
              ? new Date(reservation.createdAt).toLocaleString('vi-VN')
              : 'N/A'}
            )
          </span>
        </div>
        <span
          className={`font-semibold px-2 py-1 rounded ${statusColorMap[reservation.status]}`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Reservation Info */}
      <div className="border-y border-white/20 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Info label="Khách" value={reservation.full_name} />
          <Info label="Ngày" value={reservation.date} />
          <Info label="Giờ" value={reservation.time} />
        </div>
        <div className="space-y-2">
          <Info label="Bàn" value={tableTypeName} />
          <Info
            label="Số người"
            value={reservation.number_of_people?.toString()}
          />
          <Info
            label="Ghi chú"
            value={reservation.note?.trim() || '—'}
            italic
          />
        </div>
      </div>

      {/* Order Items */}
      {orderItems.length > 0 && (
        <div className="mt-4 border-t border-white/20 pt-4 space-y-4">
          {orderItems.map((item, index) => (
            <div
              key={index}
              className="flex bg-[#0C2B40] rounded overflow-hidden shadow-md transition border border-transparent hover:border-secondaryColor group h-[135px]"
            >
              {/* Ảnh bên trái */}
              <div className="w-[130px] h-full shrink-0 overflow-hidden">
                <img
                  src={item.image}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  alt={item.dish_name}
                />
              </div>

              {/* Nội dung bên phải */}
              <div className="flex-1 p-4 text-white flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-medium text-left line-clamp-2 min-h-[2.75rem] leading-snug break-words">
                    {item.dish_name}
                  </h4>
                  <p className="text-sm text-left text-gray-300">
                    Số lượng: {item.quantity}
                  </p>
                  <p className="text-sm text-left text-gray-300">
                    {item.category}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-left text-gray-300">
                    Giá mỗi món: {''}
                    <span className="text-secondaryColor ">
                      {item.unit_price.toLocaleString('vi-VN')}đ
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Info */}
      {reservation.payment_status === 'PAID' && reservation.paid_at && (
        <div className="mt-4 text-sm text-white/80">
          <div className="flex justify-between items-center border-t border-white/20 pt-4">
            <span className="text-secondaryColor font-semibold">
              Thanh toán
            </span>
            <span className="text-green-400 font-medium">Đã thanh toán</span>
          </div>
          <div className="text-xs mt-1 text-white/50">
            Phương thức: {reservation.payment_method.replace(/_/g, ' ')} ·{' '}
            {new Date(reservation.paid_at).toLocaleString('vi-VN')}
          </div>
          <div className="text-xs mt-1 text-white/50">
            Tiền cọc đặt chỗ:{' '}
            <span className="text-white/90 font-medium">
              {reservation.deposit_amount?.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-3 flex justify-end flex-wrap gap-2">
        {reservation.status === 'PENDING' && (
          <button
            className="px-4 py-1.5 text-xs border border-secondaryColor text-white hover:bg-secondaryColor hover:text-headerBackground"
            onClick={handleCancelClick}
          >
            Hủy đặt bàn
          </button>
        )}
        {reservation.status === 'CONFIRMED' && (
          <button
            className="px-4 py-1.5 text-xs border border-secondaryColor text-white"
            disabled
          >
            Yêu cầu huỷ đặt bàn
          </button>
        )}
        {reservation.status === 'CANCELLED' && (
          <button
            className="px-4 py-1.5 text-xs border border-secondaryColor text-white"
            disabled
          >
            Đã hủy
          </button>
        )}
      </div>
    </div>
  );
};

const Info = ({
  label,
  value,
  italic = false,
}: {
  label: string;
  value: string;
  italic?: boolean;
}) => (
  <p className="text-sm flex items-start gap-2">
    <span className="text-secondaryColor uppercase font-semibold">
      {label}:
    </span>
    <span className={`text-white/90 ${italic ? 'italic text-white/80' : ''}`}>
      {value}
    </span>
  </p>
);

export default ReservationCard;
