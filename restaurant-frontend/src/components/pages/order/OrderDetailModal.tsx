/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { formatDate } from '@/utils/formatDate';
import { useNavigate } from 'react-router-dom';
import {
  useOrderDetail,
  useHandleRetryPayment,
  useHandleChangePaymentMethod,
} from '@/hooks/useOrder';
import { Order, OrderItem } from '@/types/Order.type';
import PaymentMethodSelector, { paymentMethods } from '../checkout/PaymentMethodSelector';
import { FiDownload } from 'react-icons/fi';

interface OrderDetailModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  orderId,
  isOpen,
  onClose,
}) => {
  const { data, isLoading, isError, error } = useOrderDetail(orderId);
  const { mutate: retryPaymentMutate, isPending: retrying } =
    useHandleRetryPayment();
  const {
    mutate: changePaymentMethodMutate,
    isSuccess,
    data: changeMethodResult,
    isPending: changingMethod,
  } = useHandleChangePaymentMethod();
  const navigate = useNavigate();

  const [showSelector, setShowSelector] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [bankingInfo, setBankingInfo] = useState<any | null>(null);
  const shortOrderId = bankingInfo?.transfer_note
    ? bankingInfo.transfer_note.slice(-6).toUpperCase()
    : '';
  const [showBankingInfo, setShowBankingInfo] = useState(false);

  useEffect(() => {
    if (data?.order) {
      setSelectedMethod(data.order.payment_method);
    }
  }, [data?.order]);

  const handleRetryPayment = () => {
    retryPaymentMutate({ type: 'order', id: orderId }); 
  };
  const handleChangePaymentMethod = () => {
    setShowSelector(true);
  };

  const handleConfirmChangePaymentMethod = () => {
    if (!selectedMethod || selectedMethod === data?.order?.payment_method)
      return;
    changePaymentMethodMutate({ objectId: orderId, paymentMethod: selectedMethod, objectType: 'order' });
  };

  useEffect(() => {
    if (isSuccess && changeMethodResult) {
      const postPayment = changeMethodResult.postPayment;

      if (postPayment?.type === 'BANKING' && postPayment?.bankingInfo) {
        setBankingInfo(postPayment.bankingInfo);
        setShowBankingInfo(true);
      } else if (postPayment?.redirectUrl) {
        window.location.href = postPayment.redirectUrl;
      } else {
        setShowBankingInfo(false);
        setBankingInfo(null);
      }
    }
  }, [isSuccess, changeMethodResult]);

  useEffect(() => {
    if (
      data?.order.payment_method === 'BANKING' &&
      data?.order.postPayment?.bankingInfo
    ) {
      setBankingInfo(data?.order.postPayment.bankingInfo);
      setShowBankingInfo(true);
    } else {
      setShowBankingInfo(false);
      setBankingInfo(null);
    }
  }, [data?.order]);

  function getFormattedDeliveryTime(order: Order): string {
    if (order.delivery_time_type === 'ASAP' && !order.scheduled_time) {
      const created = new Date(order.createdAt ?? Date.now());

      const min = new Date(created.getTime() + 45 * 60000);
      const max = new Date(created.getTime() + 90 * 60000);

      const roundTime = (date: Date, direction: 'up' | 'down') => {
        const d = new Date(date);
        const minutes = d.getMinutes();
        const roundedMinutes =
          direction === 'up'
            ? Math.ceil(minutes / 5) * 5
            : Math.floor(minutes / 5) * 5;
        if (roundedMinutes === 60) {
          d.setHours(d.getHours() + 1);
          d.setMinutes(0);
        } else {
          d.setMinutes(roundedMinutes);
        }
        d.setSeconds(0);
        return d;
      };

      const minRounded = roundTime(min, 'down');
      const maxRounded = roundTime(max, 'up');

      const minStr = minRounded.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const maxStr = maxRounded.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return `Dự kiến khoảng ${minStr} – ${maxStr} (tính từ lúc đặt hàng)`;
    }

    if (order.delivery_time_type === 'SCHEDULED' && order.scheduled_time) {
      return `Giao vào ${new Date(order.scheduled_time).toLocaleString(
        'vi-VN',
        {
          weekday: 'long',
          day: 'numeric',
          month: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        },
      )}`;
    }

    return 'Chưa xác định thời gian giao hàng';
  }

  const handleNavigateToDetail = (slug: string) => {
    onClose();
    navigate(`/foods/${slug}`);
  };

  const handleNavigateToDetails = (slug: string, state?: any) => {
    onClose();
    navigate(`/foods/${slug}`, { state });
  };
  

  if (isLoading || retrying || changingMethod)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[120]">
        <div className="bg-bodyBackground rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex items-center justify-center p-8 border border-white/10">
          <span className="text-white text-lg">
            Đang tải dữ liệu đơn hàng...
          </span>
        </div>
      </div>
    );

  if (isError || !data?.order)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
        <div className="bg-bo rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex items-center justify-center p-8 border border-white/10">
          <span className="text-red-400 text-lg">
            Lỗi: {(error as Error)?.message || 'Không tìm thấy đơn hàng'}
          </span>
        </div>
      </div>
    );

  const order = data.order;
  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + ' VND';
  const address =
    typeof order?.address_id === 'object' && order?.address_id !== null
      ? order?.address_id
      : null;

  const discountAmount = (order as any).discount_amount || 0;
  const voucherCode = (order as any).voucher_code || (order as any).voucher_id?.code || '';

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50  ${!isOpen ? 'hidden' : ''}`}
    >
      <div
        className="bg-bodyBackground rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-0 border border-white/10 custom-scroll"
        style={{ scrollbarColor: '#FFDA95 #0a2233', scrollbarWidth: 'thin' }}
      >
        <style>{`
          .custom-scroll::-webkit-scrollbar {
            width: 10px;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: #FFDA95;
            border-radius: 8px;
          }
          .custom-scroll::-webkit-scrollbar-track {
            background: #0a2233;
            border-radius: 8px;
          }
        `}</style>
        <button
          onClick={onClose}
          className="sticky top-2 left-[96.5%] text-white hover:text-secondaryColor font-bold text-2xl z-10"
          aria-label="Đóng"
        >
          &times;
        </button>
        <div className="pl-8 pr-8 pb-8">
          <div className="text-2xl font-bold mb-6 text-secondaryColor flex items-center gap-2">
            <span>Đơn #{order._id.slice(-6).toUpperCase()}</span>
            <span className="text-sm text-white/60 font-normal">
              ({formatDate(order.createdAt)})
            </span>
          </div>

          {/* Thông tin đơn hàng */}
          <section className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/90">
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <span className="font-semibold">Trạng thái:</span>
                  <span className="px-2 py-0.5 rounded bg-secondaryColor/80 text-headerBackground font-bold text-md">
                    {order.status === 'ORDER_PLACED'
                      ? 'Chờ xác nhận'
                      : order.status === 'ORDER_CONFIRMED'
                        ? 'Đã xác nhận'
                        : order.status === 'PENDING_PICKUP'
                          ? 'Đang chuẩn bị'
                          : order.status === 'PICKED_UP'
                            ? 'Đã lấy hàng'
                            : order.status === 'IN_TRANSIT'
                              ? 'Đang giao hàng'
                              : order.status === 'DELIVERED'
                                ? 'Đã giao hàng'
                                : order.status === 'RETURN_REQUESTED'
                                  ? 'Đã yêu cầu trả hàng'
                                  : order.status === 'RETURN_APPROVED'
                                    ? 'Đã duyệt trả hàng'
                                    : order.status === 'RETURN_REJECTED'
                                      ? 'Đã từ chối trả hàng'
                                      : order.status === 'CANCELLED'
                                        ? 'Đã hủy'
                                        : order.status === 'RETURNED'
                                          ? 'Đã trả hàng'
                                          : order.status}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="font-semibold">Loại:</span>
                  <span className="text-md">
                    {order.order_type === 'ONLINE' ? 'Online' : 'Tại quán'}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="font-semibold">Giao:</span>
                  <span className="text-md">
                    {order.delivery_type === 'DELIVERY'
                      ? 'Tận nơi'
                      : 'Tại quán'}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="font-semibold">Thời gian:</span>
                  <span className="text-md">
                    {order.delivery_time_type === 'ASAP'
                      ? 'Giao ngay'
                      : 'Giao theo lịch'}
                  </span>
                </div>
                {order.delivery_time_type && (
                  <div className="flex flex-wrap gap-2 items-start">
                    <span className="font-semibold whitespace-nowrap">
                      Chi tiết:
                    </span>
                    <span className="text-md break-words flex-1 min-w-[200px]">
                      {getFormattedDeliveryTime(order)}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <span className="font-semibold">Thanh toán:</span>
                  <span className="text-md">
                    {order.payment_method === 'CASH'
                      ? 'Tiền mặt'
                      : order.payment_method === 'CREDIT_CARD'
                        ? 'Thẻ tín dụng (Paypal)'
                        : order.payment_method === 'BANK_TRANSFER'
                          ? 'Chuyển khoản'
                          : order.payment_method === 'MOMO'
                            ? 'Momo (QR)'
                            : order.payment_method === 'MOMO_ATM'
                              ? 'Momo ATM/Thẻ'
                              : order.payment_method}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="font-semibold">Trạng thái thanh toán:</span>
                  <span className="text-md">
                    {{
                      PAID: 'Đã thanh toán',
                      PENDING: 'Đang chờ thanh toán',
                      UNPAID: 'Chưa thanh toán',
                      FAILED: 'Thanh toán thất bại',
                      REFUNDED: 'Đã hoàn tiền',
                    }[
                      order.payment_status as keyof typeof order.payment_status
                    ] || 'Chưa thanh toán'}
                  </span>
                </div>
                {order.paid_at && (
                  <div className="flex gap-2 items-center">
                    <span className="font-semibold">Thanh toán lúc:</span>
                    <span className="text-md">{formatDate(order.paid_at)}</span>
                  </div>
                )}
                {order.delivered_at && (
                  <div className="flex gap-2 items-center">
                    <span className="font-semibold">Giao lúc:</span>
                    <span className="text-md">
                      {formatDate(order.delivered_at)}
                    </span>
                  </div>
                )}
                {order.cancelled_at && (
                  <div className="flex gap-2 items-center">
                    <span className="font-semibold">Hủy lúc:</span>
                    <span className="text-md">
                      {formatDate(order.cancelled_at)}
                    </span>
                  </div>
                )}
                {order.returned_at && (
                  <div className="flex gap-2 items-center">
                    <span className="font-semibold">Trả hàng lúc:</span>
                    <span className="text-md">
                      {formatDate(order.returned_at)}
                    </span>
                  </div>
                )}
                {order.cancelled_reason && (
                  <div className="flex gap-2 items-center">
                    <span className="font-semibold">Lý do hủy:</span>
                    <span className="text-md">{order.cancelled_reason}</span>
                  </div>
                )}
                {order.payment_status !== 'PAID' &&
                  ['ORDER_PLACED', 'ORDER_CONFIRMED'].includes(order.status) && (
                    
                    <div className="pt-2">
                      {order.payment_method !== 'CASH' && (
                        <div className="bg-yellow-100 text-yellow-800 text-xs rounded-md px-3 py-2 mb-3 max-w-md text-justify leading-relaxed">
                          Đơn hàng sẽ tự động <strong>hủy sau 30 phút</strong> nếu không được thanh toán thành công.
                          Vui lòng hoàn tất thanh toán càng sớm càng tốt để tránh bị hủy.
                        </div>
                      )}
                      {!showSelector ? (
                        <div className="flex gap-2">
                          {order.payment_method !== 'CASH' && (
                            <button
                              disabled={retrying}
                              className="px-4 py-1.5 text-xs bg-secondaryColor border border-secondaryColor text-black font-normal font-sans hover:bg-bodyBackground hover:text-white focus:ring-bodyBackground active:bg-bodyBackground/90 active:text-headerBackground disabled:opacity-50"
                              onClick={handleRetryPayment}
                            >
                              {retrying ? 'Đang xử lý...' : 'Thanh toán lại'}
                            </button>
                          )}
                          <button
                            disabled={changingMethod}
                            className="px-4 py-1.5 text-xs bg-secondaryColor border border-secondaryColor text-black font-normal font-sans hover:bg-bodyBackground hover:text-white focus:ring-bodyBackground active:bg-bodyBackground/90 active:text-headerBackground disabled:opacity-50"
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
                                selectedMethod === order.payment_method
                              }
                              className="px-4 py-1.5 text-xs bg-secondaryColor border border-secondaryColor text-black font-normal font-sans hover:bg-bodyBackground hover:text-white focus:ring-bodyBackground active:bg-bodyBackground/90 active:text-headerBackground disabled:opacity-50"
                            >
                              Xác nhận
                            </button>
                            <button
                              onClick={() => {
                                setShowSelector(false);
                                setSelectedMethod(order.payment_method);
                              }}
                              className="px-4 py-1.5 text-xs bg-bodyBackground border border-secondaryColor text-white font-normal font-sans hover:bg-secondaryColor hover:text-black focus:ring-bodyBackground active:bg-bodyBackground/90 active:text-headerBackground disabled:opacity-50"
                            >
                              Hủy
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </section>
          {order.payment_method === 'BANKING' &&
            (order.payment_status === 'UNPAID' ||
              (order.payment_status === 'FAILED' &&
                bankingInfo &&
                showBankingInfo)) && (
              <div className="bg-bodyBackground flex justify-center px-4 pb-24">
                <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-6 w-full max-w-2xl text-left text-white border border-white/10">
                  <h2 className="text-2xl font-semibold mb-4 text-white">
                    Thông tin chuyển khoản
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-2">
                      <p>
                        <strong>Ngân hàng:</strong> {bankingInfo?.bank_name}
                      </p>
                      <p>
                        <strong>Chủ tài khoản:</strong>{' '}
                        {bankingInfo?.account_name}
                      </p>
                      <p>
                        <strong>Số tài khoản:</strong>{' '}
                        {bankingInfo?.account_number}
                      </p>
                      <p>
                        <strong>Số tiền:</strong>
                        <span className="ml-1 font-semibold text-green-300">
                          {order.total_price.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        </span>
                      </p>
                      <p>
                        <strong>Nội dung chuyển khoản:</strong> <br />
                        <span className="font-semibold text-yellow-300">
                          ORDER-{shortOrderId}
                        </span>
                      </p>
                      <p>
                        <strong>Mã đơn hàng:</strong>{' '}
                        <span className="font-semibold text-green-300">
                          {shortOrderId}
                        </span>
                      </p>
                      <p className="text-red-400 text-sm font-medium">
                        ⚠️ Vui lòng nhập chính xác nội dung chuyển khoản{' '}
                        <strong className="text-yellow-300">
                          ORDER-{shortOrderId}
                        </strong>{' '}
                        để hệ thống xác nhận tự động.
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-4">
                      <img
                        src={bankingInfo?.qr_code}
                        alt="QR Code"
                        className="w-52 h-52 object-contain border rounded-xl shadow-lg bg-white"
                      />
                      <a
                        href={bankingInfo?.qr_code}
                        download={`QR_ORDER_${shortOrderId}.png`}
                        className="flex items-center gap-2 text-sm px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                      >
                        <FiDownload />
                        Tải mã QR
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          {/* Địa chỉ giao hàng */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-white">
              Địa chỉ giao hàng
            </h3>
            <div className="bg-[#14324a] p-4 rounded-lg text-white/90 border border-white/10">
              {address ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <p className="mb-1">
                      <span className="font-semibold">Người nhận:</span>{' '}
                      {address.full_name}
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">Điện thoại:</span>{' '}
                      {address.phone}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1">
                      <span className="font-semibold">Địa chỉ:</span>{' '}
                      {address.street_address}, {address.ward},{' '}
                      {address.district}, {address.province}
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">Loại:</span>{' '}
                      {address.address_type === 'HOME'
                        ? 'Nhà riêng'
                        : address.address_type === 'WORK'
                          ? 'Cơ quan'
                          : 'Khác'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="italic text-white/60">
                  Không có thông tin địa chỉ giao hàng
                </p>
              )}
            </div>
          </section>

          {/* Ghi chú của đơn hàng */}
          {order.note && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-white">
                Ghi chú đơn hàng
              </h3>
              <div className="bg-[#14324a] p-4 rounded-lg text-white/90 border border-white/10">
                {order.note}
              </div>
            </section>
          )}

          {/* Món ăn */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-white">Món ăn</h3>
            <div className="space-y-5">
              {order.order_items?.length ? (
                order.order_items.map((item: OrderItem) => (
                  <div
                    key={item._id}
                    className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-[#1a3952] border border-white/10 shadow group"
                  >
                    <div className="flex-shrink-0 flex justify-center items-center">
                      <img
                        src={item.dish_id?.images?.[0] || '/placeholder-image.jpg'}
                        alt={item.dish_name}
                        className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg border-2 border-secondaryColor bg-white/10 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handleNavigateToDetail(item.dish_id?.slug || '')}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <p 
                          className="font-bold text-lg text-secondaryColor mb-1 cursor-pointer hover:text-secondaryColor/80 transition-colors"
                          onClick={() => handleNavigateToDetail(item.dish_id?.slug || '')}
                        >
                          {item.dish_name}
                        </p>
                        {item.dish_id?.shortDescription && (
                          <p className="text-sm text-white/80 mb-1 italic">
                            {item.dish_id.shortDescription}
                          </p>
                        )}
                        <div className="flex flex-col md:flex-row md:gap-6 text-white/90 text-sm">
                          <div className="space-y-1 min-w-[100px]">
                            <p>
                              <span className="font-semibold">Đơn giá:</span>{' '}
                              {formatPrice(item.unit_price)}
                            </p>
                            <p>
                              <span className="font-semibold">Số lượng:</span>{' '}
                              {item.quantity}
                            </p>
                            <div className="flex justify-between items-center">
                              <p>
                                <span className="font-semibold">Tổng:</span>{' '}
                                {formatPrice(item.total_amount)}
                              </p>
                              <button
                                className="ml-64 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium px-4 py-1 rounded"
                                onClick={() =>
                                  handleNavigateToDetails(item.dish_id?.slug || '', { openReview: true })
                                }
                              >
                                Đánh giá
                              </button>
                            </div>

                          </div>
                          <div className="space-y-1 md:text-right flex-1">
                            {item.note && (
                              <p>
                                <span className="font-semibold">Ghi chú:</span>{' '}
                                {item.note}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="italic text-white/60">
                  Không có món ăn nào trong đơn hàng này.
                </p>
              )}
            </div>
          </section>

          {/* Tổng tiền */}
          <section className="bg-[#14324a] p-5 rounded-lg mb-2 border border-white/10">
            <h3 className="text-lg font-semibold mb-3 text-white">Tổng đơn</h3>
            <div className="space-y-2 text-white/90">
              <div className="flex justify-between">
                <span>Tiền hàng:</span>{' '}
                <span>{formatPrice(order.items_price)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>{' '}
                <span>{formatPrice(order.shipping_fee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Thuế VAT:</span>{' '}
                <span>{formatPrice(order.vat_amount)}</span>
              </div>
              {/* Hiển thị giảm giá voucher nếu có */}
              {discountAmount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-white/80">
                    Giảm giá{voucherCode ? ` (${voucherCode})` : ''}
                  </span>
                  <span className="text-green-400">
                    -{discountAmount.toLocaleString()} VND
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2 text-secondaryColor">
                <span>Tổng cộng:</span>{' '}
                <span>{formatPrice(order.total_price)}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
