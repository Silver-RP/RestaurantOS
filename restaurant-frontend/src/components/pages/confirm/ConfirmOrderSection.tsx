/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonComponents from '@components/common/ButtonComponents';
import { usePlaceDirectOrder } from '@/hooks/useOrder';
import { PlaceOrderRequest } from '@/types/Order.type';
import { toast } from 'react-toastify';
// import { motion } from "framer-motion";

// Define the expected order data structure from localStorage
interface OrderItem {
  dish_id: string;
  quantity: number;
  note?: string;
  name?: string;
  image?: string;
  price?: number;
  discountedPrice?: number;
}

interface OrderData {
  address_id?: string;
  address?: {
    full_name: string;
    phone: string;
    street_address: string;
    ward: string;
    district: string;
    province: string;
  };
  payment_method: string;
  delivery_type: 'DELIVERY' | 'PICKUP';
  items: OrderItem[];
  order_type: 'ONLINE';
  delivery_time_type: 'ASAP' | 'SCHEDULED';
  scheduled_time?: string;
  note?: string;
  receiver?: string | null;
  receiver_phone?: string | undefined;
  shipping_fee: number;
  items_price: number;
  vat_amount: number;
  total_price: number;
  total_quantity: number;
  voucher_id?: string | null;
  discount_amount?: number;
}

const OrderConfirmation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const navigate = useNavigate();
  const placeDirectOrderMutation = usePlaceDirectOrder();

  useEffect(() => {
    // Retrieve order data from localStorage
    const storedOrderData = localStorage.getItem('orderConfirmationData');
    const storedCartItems = localStorage.getItem('selectedCartItems');

    if (!storedOrderData) {
      // If no order data is found, redirect to checkout
      navigate('/checkout');
      return;
    }

    try {
      const parsedOrderData = JSON.parse(storedOrderData) as OrderData;
      console.log('orderData in Confirm:', parsedOrderData);
      setOrderData(parsedOrderData);

      if (storedCartItems) {
        const cartItems = JSON.parse(storedCartItems);

        // Create enhanced order items with product details
        const enhancedItems = parsedOrderData.items.map((item) => {
          const cartItem = cartItems.find((ci: any) => ci.id === item.dish_id);
          return {
            ...item,
            name: cartItem?.name || 'Unknown Product',
            image: cartItem?.imageUrl || 'https://via.placeholder.com/150',
            price: cartItem?.price || 0,
            discountedPrice: cartItem?.discountedPrice || cartItem?.price || 0,
            category: cartItem?.category || 'Món chính',
          };
        });

        setOrderItems(enhancedItems);
      }
    } catch (error) {
      console.error('Error parsing order data:', error);
      navigate('/checkout');
    }
  }, [navigate]);

  // Get display values
  const getDeliveryMethodDisplay = () => {
    if (!orderData) return '';
    return orderData.delivery_type === 'DELIVERY'
      ? 'Giao hàng tận nơi'
      : 'Đến lấy tại cửa hàng ';
  };

  const getPaymentMethodDisplay = () => {
    if (!orderData) return '';

    const paymentMethodMap: Record<string, string> = {
      CASH: 'Thanh toán khi nhận hàng',
      BANKING: 'Chuyển khoản ngân hàng',
      VNPAY: 'Thanh toán qua VNPAY',
      MOMO: 'Thanh toán qua MOMO',
      MOMO_ATM: 'Thanh toán thẻ qua MOMO',
      CREDIT_CARD: 'Thanh toán bằng thẻ tín dụng qua PayPal',
    };

    return (
      paymentMethodMap[orderData.payment_method] || orderData.payment_method
    );
  };

  const getAddressDisplay = () => {
    if (!orderData || !orderData.address) return '';

    const addr = orderData.address;
    return `${addr.street_address}, ${addr.ward}, ${addr.district}, ${addr.province}`;
  };

  const getScheduledTimeDisplay = () => {
    if (!orderData || !orderData.scheduled_time) {
      return orderData?.delivery_time_type === 'ASAP'
        ? 'Giao hàng ngay khi chuẩn bị xong'
        : '';
    }

    const scheduledDate = new Date(orderData.scheduled_time);
    return scheduledDate.toLocaleString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePlaceOrder = async () => {
    if (!orderData || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Prepare the order data according to the API requirements
      const apiOrderData: PlaceOrderRequest = {
        address_id: orderData.address_id,
        payment_method: orderData.payment_method as any,
        delivery_type: orderData.delivery_type,
        order_type: orderData.order_type,
        delivery_time_type: orderData.delivery_time_type,
        items: orderData.items.map((item) => ({
          dish_id: item.dish_id,
          quantity: item.quantity,
          note: item.note,
        })),
        note: orderData.note,
        shipping_fee: orderData.shipping_fee,
        receiver: orderData.receiver || '',
        receiver_phone: orderData.receiver_phone || '',
        voucher_id: orderData.voucher_id || undefined,
        discount_amount: orderData.discount_amount || 0,
      };

      // Add address if delivery type is DELIVERY
      if (orderData.delivery_type === 'DELIVERY' && orderData.address) {
        apiOrderData.address = {
          full_name: orderData.address.full_name,
          phone: orderData.address.phone,
          street_address: orderData.address.street_address,
          ward: orderData.address.ward,
          district: orderData.address.district,
          province: orderData.address.province,
        };
      }

      // Add scheduled time if delivery time type is SCHEDULED
      if (
        orderData.delivery_time_type === 'SCHEDULED' &&
        orderData.scheduled_time
      ) {
        apiOrderData.scheduled_time = orderData.scheduled_time;
      }
      const response = await placeDirectOrderMutation.mutateAsync(apiOrderData);

      if (response.postPayment?.bankingInfo !== null) {
        sessionStorage.setItem(
          'recentBankingInfo',
          JSON.stringify(response.postPayment.bankingInfo),
        );
      } else {
        sessionStorage.removeItem('recentBankingInfo');
      }

      if (response.postPayment?.orderTotal) {
        sessionStorage.setItem(
          'orderTotal',
          JSON.stringify(response.postPayment.orderTotal),
        );
      }

      sessionStorage.setItem('recentOrderSuccess', 'true');
      localStorage.removeItem('orderConfirmationData');
      localStorage.removeItem('selectedCartItems');

      toast.success(
        'Đặt hàng thành công! Vui lòng kiểm tra email để xem chi tiết đơn hàng.',
      );

      if (response.postPayment?.redirectUrl) {
        window.location.href = response.postPayment.redirectUrl;
        return;
      }

      navigate('/payment-success');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-[#012B40] text-white flex items-center justify-center">
        <p>Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#012B40] text-white">
      {/* Main Content */}
      <main className=" mx-auto pt-10 pb-12">
        <h1 className="text-4xl font-bold text-center mb-12">
          Xác nhận đơn hàng
        </h1>

        {/* User Information */}
        <section className="border text-white placeholder:text-gray-400 border-[#074b6b] rounded p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Thông tin khách hàng</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {orderData.address && (
              <>
                <InfoItem label="Họ tên" value={orderData.address.full_name} />
                <InfoItem
                  label="Số điện thoại"
                  value={orderData.address.phone}
                />
                <InfoItem label="Địa chỉ" value={getAddressDisplay()} />
              </>
            )}
            {orderData.receiver && (
              <>
                <InfoItem label="Họ tên" value={orderData.receiver || ''} />
                <InfoItem
                  label="Số điện thoại"
                  value={orderData.receiver_phone || ''}
                />
              </>
            )}
            {/* {orderData.delivery_time_type === "SCHEDULED" && (
              <InfoItem label="Thời gian giao hàng" value={getScheduledTimeDisplay()} />
            )} */}
          </div>
        </section>

        {/* Order Items */}
        <section className="border text-white placeholder:text-gray-400 border-[#074b6b] rounded p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Món ăn đã chọn</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4">Món ăn</th>
                  <th className="text-center py-4">Số lượng</th>
                  <th className="text-right py-4">Đơn giá</th>
                  <th className="text-right py-4">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item, index) => (
                  <tr key={index} className="border-b border-white/20">
                    <td className="py-4">
                      <div className="flex items-center space-x-4 w-full">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                        <div className="flex flex-col flex-grow">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-gray-300">
                            Phân loại: {item.category}
                          </span>
                          <span className="text-sm italic text-gray-400 mt-1">
                            Ghi chú: {item.note || 'Không có ghi chú'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">
                      {' '}
                      <div>
                        {item.discountedPrice !== item.price ? (
                          <div className="text-sm mt-1 flex flex-col">
                            <span className="line-through text-gray-400">
                              {item.price?.toLocaleString()} VNĐ
                            </span>
                            <span className="text-secondaryColor font-semibold">
                              {item.discountedPrice?.toLocaleString()} VNĐ
                            </span>
                          </div>
                        ) : (
                          <div className="text-sm mt-1">
                            {item.price?.toLocaleString()} VNĐ
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="text-right">
                      {(
                        (item.discountedPrice || item.price) * item.quantity
                      ).toLocaleString()}{' '}
                      VNĐ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Order Details */}
        <section className="border text-white placeholder:text-gray-400 border-[#074b6b] rounded p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <InfoItem
              label="Phương thức giao hàng"
              value={getDeliveryMethodDisplay()}
            />
            <InfoItem
              label="Phương thức thanh toán"
              value={getPaymentMethodDisplay()}
            />

            {orderData.delivery_type === 'DELIVERY' ? (
              <InfoItem
                label="Thời gian nhận hàng"
                value={getScheduledTimeDisplay()}
              />
            ) : (
              ''
            )}
            {orderData.delivery_type === 'PICKUP' ? (
              <>
                <div>
                  <span className="text-gray-300">Thời gian đến lấy hàng:</span>
                  <p className="font-medium">{getScheduledTimeDisplay()}</p>
                  <p>
                    Địa chỉ: Nhà Hàng BeefBeef – 161 Quốc Hương, Thảo Điền, Quận
                    2
                  </p>
                </div>
              </>
            ) : (
              ''
            )}
            {orderData.delivery_time_type !== 'SCHEDULED' &&
              orderData.delivery_type === 'DELIVERY' ? (
                <InfoItem
                  label="Thời gian giao hàng"
                  value="Trong 45-90 phút tính từ lúc đặt hàng."
                />
              ) : (
                ''
              )}
            {orderData.note && (
              <InfoItem label="Ghi chú" value={orderData.note} />
            )}
          </div>
        </section>

        {/* Price Summary */}
        <section className="border text-white placeholder:text-gray-400 border-[#074b6b] rounded p-6 mb-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{orderData.items_price.toLocaleString()} VNĐ</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (8%):</span>
              <span>{orderData.vat_amount.toLocaleString()} VNĐ</span>
            </div>
            <div className="flex justify-between">
              <span>Phí giao hàng:</span>
              <span>{orderData.shipping_fee.toLocaleString()} VNĐ</span>
            </div>
            {orderData.discount_amount && orderData.discount_amount > 0 && (
              <div className="flex justify-between">
                <span>Giảm giá voucher:</span>
                <span className="text-green-400">- {orderData.discount_amount.toLocaleString()} VNĐ</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/20">
              <span>Tổng cộng:</span>
              <span className="text-secondaryColor">
                {(orderData.total_price).toLocaleString()} VNĐ
              </span>
            </div>
          </div>
        </section>

        {/* Confirmation Button */}
        <div className="text-center">
          <ButtonComponents
            variant="filled"
            size="large"
            className="mt-2"
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
          </ButtonComponents>
        </div>
      </main>
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <span className="text-gray-300">{label}:</span>
    <p className="font-medium">{value}</p>
  </div>
);

export default OrderConfirmation;
