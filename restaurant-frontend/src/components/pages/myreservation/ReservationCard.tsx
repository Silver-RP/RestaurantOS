import React, { useState } from 'react';
import { IReservation } from '@/types/Reservation.type';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useDispatch } from 'react-redux';
import { openReservationModal } from '@/redux/feature/modal/reservationModalSlice';
import {
  useHandleRetryPayment,
  useHandleChangePaymentMethod,
} from '@/hooks/useOrder';
import PaymentMethodSelector from '../checkout/PaymentMethodSelector';
import { paymentMethods } from '../../pages/trackingReservation/TrackingReservationResult';

interface Props {
  reservation: IReservation;
  onView: () => void;
  onCancel: (reservationId: string) => void;
}

const statusColorMap: Record<IReservation['status'], string> = {
  PENDING: 'text-yellow-400 bg-yellow-400/10',
  BOOKED: 'text-green-400 bg-green-400/10',
  CANCELLED: 'text-red-400 bg-red-400/10',
  DONE: 'text-gray-400 bg-gray-400/10',
};

const statusLabelMap: Record<IReservation['status'], string> = {
  PENDING: 'Chờ xác nhận',
  BOOKED: 'Đã đặt bàn',
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
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showSelector, setShowSelector] = useState(false);
  const { mutate: retryPaymentMutate, isPending: retrying } =
    useHandleRetryPayment();
  const handleRetryPayment = () => {
    retryPaymentMutate({ type: 'reservation', id: reservation?._id || '' });
  };
  const {
    mutate: changePaymentMethodMutate,
    isSuccess,
    data: changeMethodResult,
    isPending: changingMethod,
  } = useHandleChangePaymentMethod();

  const handleChangePaymentMethod = () => {
    setShowSelector(true);
  };

  const handleConfirmChangePaymentMethod = () => {
    if (!selectedMethod || selectedMethod === reservation?.payment_method)
      return;

    if (reservation?._id) {
      changePaymentMethodMutate({
        objectId: reservation._id,
        paymentMethod: selectedMethod,
        objectType: 'reservation',
      });
    }
  };

  const tableTypeName =
    seatingMap[reservation.table_type] || reservation.table_type;
  const statusLabel = statusLabelMap[reservation.status] || reservation.status;

  const handleCancelClick = () => {
    const isBooked = reservation.status === 'BOOKED';
    const title = isBooked ? 'Yêu cầu hủy đặt bàn' : 'Xác nhận hủy đặt bàn';
    const message = isBooked
      ? 'Bạn có chắc chắn muốn yêu cầu hủy đơn đặt bàn này không? Yêu cầu sẽ được gửi đến nhà hàng để xem xét.'
      : 'Bạn có chắc chắn muốn hủy đơn đặt bàn này không?';
    const buttonText = isBooked ? 'GỬI YÊU CẦU' : 'CÓ, HỦY ĐƠN';

    confirmAlert({
      overlayClassName: 'custom-overlay',
      customUI: ({ onClose }) => {
        let reason = '';
        return (
          <div className="custom-ui bg-bodyBackground border border-secondaryColor text-white p-6 rounded-xl shadow-2xl max-w-md mx-auto text-center">
            <h2 className="text-xl mb-4 text-secondaryColor font-semibold uppercase tracking-wide">
              {title}
            </h2>
            <p className="mb-4 text-white/90">{message}</p>
            <textarea
              placeholder="Lý do bạn muốn hủy..."
              onChange={(e) => (reason = e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-[#14324a] p-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-secondaryColor focus:border-secondaryColor mb-6 resize-none"
              rows={3}
            />
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 text-sm bg-transparent border border-white/20 text-white hover:bg-white/10 transition-colors"
                onClick={onClose}
              >
                KHÔNG
              </button>
              <button
                className="px-6 py-2 text-sm bg-secondaryColor text-headerBackground hover:bg-secondaryColor/90 transition-colors font-medium"
                onClick={() => {
                  console.log('Lý do hủy:', reason);
                  onCancel(reservation._id!);
                  onClose();
                }}
              >
                {buttonText}
              </button>
            </div>
          </div>
        );
      },
    });
  };

  const paymentMethodLabels: Record<string, string> = {
    CASH: 'Tiền mặt',
    VNPAY: 'VNPay',
    CREDIT_CARD: 'Thẻ tín dụng (Paypal)',
    BANK_TRANSFER: 'Chuyển khoản',
    MOMO: 'Momo (QR)',
    MOMO_ATM: 'Momo ATM/Thẻ',
  };

  const paymentStatusLabel: Record<string, string> = {
    PAID: 'Đã thanh toán',
    UNPAID: 'Chưa thanh toán',
    FAILED: 'Thanh toán thất bại',
    REFUNDED: 'Đã hoàn tiền',
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
      <div className="border-y border-white/20 py-4 grid grid-cols-1 md:grid-cols-2 md:gap-x-12 md:gap-y-3">
        <div className="space-y-2 md:space-y-3">
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
          <p className="text-sm flex items-center gap-2">
        <span className="text-secondaryColor uppercase font-semibold">
          Số điện thoại:
        </span>
        <span className="text-white/90">{reservation.phone || '—'}</span>
          </p>
          <p className="text-sm flex items-center gap-2">
        <span className="text-secondaryColor uppercase font-semibold">
          Email:
        </span>
        <span className="text-white/90">{reservation.email || '—'}</span>
          </p>
        </div>

        <div className="space-y-2 md:space-y-3">
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
          <p className="text-sm flex items-center gap-2">
        <span className="text-secondaryColor uppercase font-semibold">
          Ghi chú:
        </span>
        <span className="text-white/80 italic">
          {reservation.note?.trim() || '—'}
        </span>
          </p>
          {reservation.deposit_amount !== undefined && reservation.deposit_amount > 0 ? (
        <>
          <p className="text-sm flex items-center gap-2">
            <span className="text-secondaryColor uppercase font-semibold">
          Phương thức thanh toán:
            </span>
            <span className="text-md text-white/90">
          {paymentMethodLabels[reservation.payment_method] || '-'}
            </span>
          </p>
          <p className="text-sm flex items-center gap-2">
            <span className="text-secondaryColor uppercase font-semibold">
          Trạng thái thanh toán:
            </span>
            <span className="text-white/90">
          {paymentStatusLabel[reservation.payment_status] || '-'}
            </span>
          </p>
        </>
          ) : null}
          <p className="text-sm flex items-center gap-2">
            <span className="text-secondaryColor uppercase font-semibold">
              Số tiền cọc:
            </span>
            <span className="text-white/90">
              {reservation.deposit_amount
                ? `${reservation.deposit_amount.toLocaleString()}₫`
                : '—'}
            </span>
          </p>
          {reservation.deposit_amount !== undefined && reservation.deposit_amount > 0 && reservation.payment_status !== 'PAID' && reservation.status !== 'CANCELLED' && (
        <>
          {reservation.payment_method !== 'CASH' && (
            <div className="bg-yellow-100 text-yellow-800 text-xs rounded-md px-3 py-2 mb-3 max-w-md text-justify leading-relaxed">
          {reservation.cancelled_reason ||
            'Đặt bàn của bạn sẽ bị hủy sau 60 phút nếu thanh toán không được hoàn tất. Hãy thanh toán sớm để giữ chỗ.'}
            </div>
          )}

          {!showSelector ? (
            <div className="flex gap-2">
          {reservation.payment_method !== 'CASH' && (
            <button
              disabled={retrying}
              className="px-4 py-1.5 text-xs bg-secondaryColor border border-secondaryColor text-black font-normal font-sans hover:bg-bodyBackground hover:text-white disabled:opacity-50"
              onClick={handleRetryPayment}
            >
              {retrying ? 'Đang xử lý...' : 'Thanh toán lại'}
            </button>
          )}
          <button
            disabled={changingMethod}
            className="px-4 py-1.5 text-xs bg-secondaryColor border border-secondaryColor text-black font-normal font-sans hover:bg-bodyBackground hover:text-white disabled:opacity-50"
            onClick={handleChangePaymentMethod}
          >
            {changingMethod
              ? 'Đang cập nhật...'
              : 'Thay đổi phương thức'}
          </button>
            </div>
          ) : (
            <>
          <PaymentMethodSelector
            selectedMethod={selectedMethod}
            onChange={setSelectedMethod}
            size="sm"
            methods={paymentMethods}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleConfirmChangePaymentMethod}
              disabled={
            changingMethod ||
            !selectedMethod ||
            selectedMethod === reservation.payment_method
              }
              className="px-4 py-1.5 text-xs bg-secondaryColor border border-secondaryColor text-black font-normal font-sans hover:bg-bodyBackground hover:text-white disabled:opacity-50"
            >
              Xác nhận
            </button>
            <button
              onClick={() => {
            setShowSelector(false);
            setSelectedMethod(reservation.payment_method);
              }}
              className="px-4 py-1.5 text-xs bg-bodyBackground border border-secondaryColor text-white font-normal font-sans hover:bg-secondaryColor hover:text-black disabled:opacity-50"
            >
              Hủy
            </button>
          </div>
            </>
          )}
        </>
          )}
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

        {reservation.status === 'BOOKED' && (
          <button
            className="px-4 py-1.5 text-xs bg-transparent border border-secondaryColor text-white font-normal font-sans hover:bg-secondaryColor hover:text-headerBackground focus:ring-bodyBackground active:bg-secondaryColor/90 active:text-headerBackground"
            onClick={handleCancelClick}
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
