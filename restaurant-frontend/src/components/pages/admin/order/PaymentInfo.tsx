import React, { useState } from 'react';
import { Order } from '../../../../types/Order.type';
import { useUpdatePaymentStatus } from '@/hooks/useOrder';

interface PaymentInfoProps {
  order: Order;
  onPaymentConfirmed: (updatedOrder: Order) => void;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({
  order,
  onPaymentConfirmed,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: updatePaymentStatus } = useUpdatePaymentStatus();

  async function handleConfirmPayment() {
    setLoading(true);
    setError(null);
    try {
      const data: { order: Order } = await updatePaymentStatus({ paymentId: order.postPayment.paymentId, paidAmount: order.total_price }) as unknown as { order: Order };
      onPaymentConfirmed(data.order);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
      console.error('Error confirming payment:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
        Thông tin thanh toán
      </h3>
      <p className="text-gray-600">Phương thức thanh toán</p>
      <p className="font-medium">
        {order.payment_method === 'CASH' ? 'Tiền mặt' : order.payment_method}
      </p>
      <p
        className={`text-sm ${
          order.payment_status === 'PAID' ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
      </p>

      {(order.payment_status !== 'PAID' && order.status !== 'CANCELLED' ) && (
        <button
        className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md shadow hover:bg-blue-700 disabled:opacity-60 transition-all duration-200"
        onClick={handleConfirmPayment}
        disabled={loading}
      >
        {loading ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 1 1-10 10" stroke="currentColor" strokeWidth="2" />
            </svg>
            Đang xử lý...
          </>
        ) : (
          <>
            Xác nhận đã thanh toán
          </>
        )}
      </button>
      
      )}

      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
};

export default PaymentInfo;
