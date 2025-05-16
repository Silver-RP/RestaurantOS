import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Order, OrderItem } from '@/types/Order.type';
import { deliveryStatusMapping } from './NavigationOrder';
import OrderDetailModal from './OrderDetailModal';

interface OrderItemProps {
  order: Order;
  reviewDate: string;
}

const OrderItemComponent: React.FC<OrderItemProps> = ({ order }) => {
  const [showMore, setShowMore] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const items = order.order_items || [];

  if (!items.length) {
    return <div className="text-white">Không có sản phẩm trong đơn hàng này.</div>;
  }

  const orderCode = (order._id?.slice(-6) || '000000').toUpperCase();  

  const getStatusTabName = (status: string | null | undefined): string => {
    for (const [tabName, config] of Object.entries(deliveryStatusMapping)) {
      const statusConfig = config.delivery_status;
      if (statusConfig === null) continue;

      if (Array.isArray(statusConfig)) {
        if (status && statusConfig.includes(status)) return tabName;
      } else {
        if (status === statusConfig) return tabName;
      }
    }
    return 'Tất cả đơn hàng';
  };

  const statusText = getStatusTabName(order.delivery_status);

  const normalizeItem = (item: OrderItem) => ({
    _id: item._id,
    name: item.dish_name,
    image: item.dish_images?.[0] || '/placeholder-image.jpg',
    category: item.categories?.[0] || 'Không phân loại',
    quantity: item.quantity,
    price: item.unit_price,
    total: item.total_amount,
  });

  const normalized = items.map(normalizeItem);
  const [firstItem, ...others] = normalized;

  const calcTotal = order.total_price;

  return (
    <div className="relative text-white p-4 md:p-6 border border-white/10 rounded-md">
      {/* Mã đơn + Trạng thái */}
      <div className="flex justify-between md:text-sm mb-2">
        <span className="text-white/80 text-lg">Mã đơn: <span className="font-medium">{orderCode}</span></span>
        <span className="text-secondaryColor font-semibold">{statusText}</span>
      </div>

      {/* Sản phẩm đầu tiên */}
      <div className="border-y border-white/20 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center min-w-0 flex-grow">
          <img 
            src={firstItem.image} 
            alt={firstItem.name} 
            className="w-20 h-20 object-cover rounded-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.jpg';
            }}
          />
          <div className="ml-4 min-w-0">
            <h2 className="font-bold text-sm md:text-lg line-clamp-2">{firstItem.name}</h2>
            <p className="text-xs mt-1">Phân loại: {firstItem.category}</p>
            <p className="text-xs mt-1">x{firstItem.quantity}</p>
          </div>
        </div>
        <div className="text-right whitespace-nowrap">
          <p className="text-secondaryColor text-sm font-bold">
            {firstItem.total.toLocaleString()} VND
          </p>
        </div>
      </div>

      {/* Các sản phẩm còn lại */}
      {showMore && others.length > 0 && (
        <div className="mt-4 space-y-4">
          {others.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b border-white/10 pb-2 gap-4">
              <div className="flex items-center flex-grow min-w-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.jpg';
                  }}
                />
                <div className="ml-3 min-w-0">
                  <h3 className="font-semibold text-xs line-clamp-2">{item.name}</h3>
                  <p className="text-[10px] mt-1">Phân loại: {item.category}</p>
                  <p className="text-[10px] mt-1">x{item.quantity}</p>
                </div>
              </div>
              <div className="text-right whitespace-nowrap">
                <p className="text-secondaryColor text-xs font-bold">
                  {item.total.toLocaleString()} VND
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toggle nút Xem thêm / Thu gọn */}
      {others.length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center text-xs text-white/70 hover:underline"
          >
            {showMore ? 'Thu gọn' : 'Xem thêm'}{" "}
            {showMore ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
          </button>
        </div>
      )}

      {/* Tổng tiền */}
      <div className="mt-4 text-right">
        <span className="text-sm md:text-base font-medium">Tổng tiền: </span>
        <span className="text-secondaryColor text-base md:text-lg font-bold">
          {calcTotal.toLocaleString()} VND
        </span>
      </div>

      {/* Các nút hành động */}
      <div className="mt-3 flex justify-end flex-wrap gap-2">
        <button
          className="px-4 py-1.5 text-xs font-medium bg-transparent border border-secondaryColor text-white font-normal font-sans hover:bg-secondaryColor hover:text-headerBackground focus:ring-bodyBackground active:bg-secondaryColor/90 active:text-headerBackground"
          onClick={() => alert('Đánh giá đơn hàng')}
        >
          Đánh giá
        </button>

        <button
          className="px-4 py-1.5 text-xs bg-transparent border border-secondaryColor text-white font-normal font-sans hover:bg-secondaryColor hover:text-headerBackground focus:ring-bodyBackground active:bg-secondaryColor/90 active:text-headerBackground"
          onClick={() => alert('Mua lại đơn hàng')}
        >
          Mua lại
        </button>

        <button
          className="px-4 py-1.5 text-xs bg-transparent border border-secondaryColor text-white font-normal font-sans hover:bg-secondaryColor hover:text-headerBackground focus:ring-bodyBackground active:bg-secondaryColor/90 active:text-headerBackground"
          onClick={() => setIsModalOpen(true)}
        >
          Xem chi tiết
        </button>
      </div>

      {/* Modal chi tiết đơn hàng */}
      <OrderDetailModal
        isOpen={isModalOpen}
        orderId={order._id}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default OrderItemComponent;
