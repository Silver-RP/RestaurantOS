import React from 'react';
import { formatDate } from '@/utils/formatDate';
import { useOrderDetail } from '@/hooks/useOrder';
import { OrderItem } from '@/types/Order.type';

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

  if (!isOpen) return null;
  if (isLoading)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
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
  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + '₫';
  const address =
    typeof order.address_id === 'object' && order.address_id !== null
      ? order.address_id
      : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div
        className="bg-bodyBackground rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-0 relative border border-white/10 custom-scroll"
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
          className="absolute top-4 right-4 text-white hover:text-secondaryColor font-bold text-2xl z-10"
          aria-label="Đóng"
        >
          &times;
        </button>
        <div className="p-8 pb-4">
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
                    {order.status === 'SHIPPING'
                      ? 'Đang giao'
                      : order.status === 'COMPLETED'
                        ? 'Hoàn thành'
                        : order.status === 'CANCELLED'
                          ? 'Đã hủy'
                          : order.status === 'RETURNED'
                            ? 'Đã trả hàng'
                            : order.status === 'PENDING'
                              ? 'Chờ xác nhận'
                              : order.status}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="font-semibold">Giao hàng:</span>
                  <span className="text-md">
                    {order.delivery_status === 'IN_TRANSIT'
                      ? 'Đang vận chuyển'
                      : order.delivery_status === 'DELIVERED'
                        ? 'Đã giao'
                        : order.delivery_status === 'CANCELLED'
                          ? 'Đã hủy'
                          : order.delivery_status === 'RETURNED'
                            ? 'Đã trả hàng'
                            : order.delivery_status === 'PENDING_PICKUP'
                              ? 'Chờ lấy hàng'
                              : order.delivery_status}
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
                {order.scheduled_time && (
                  <div className="flex gap-2 items-center">
                    <span className="font-semibold">Lịch hẹn:</span>
                    <span className="text-md">
                      {formatDate(order.scheduled_time)}
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
                        ? 'Thẻ tín dụng'
                        : order.payment_method === 'BANK_TRANSFER'
                          ? 'Chuyển khoản'
                          : order.payment_method === 'MOMO'
                            ? 'Momo'
                            : order.payment_method === 'ZALOPAY'
                              ? 'ZaloPay'
                              : order.payment_method}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="font-semibold">Trạng thái:</span>
                  <span className="text-md">
                    {order.is_paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
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
              </div>
            </div>
          </section>

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
              <h3 className="text-lg font-semibold mb-2 text-white">Ghi chú đơn hàng</h3>
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
                        src={
                          item.dish_id?.images?.[0] || '/placeholder-image.jpg'
                        }
                        alt={item.dish_name}
                        className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg border-2 border-secondaryColor bg-white/10"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <p className="font-bold text-lg text-secondaryColor mb-1 ">
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
                            <p>
                              <span className="font-semibold">Tổng:</span>{' '}
                              {formatPrice(item.total_amount)}
                            </p>
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
