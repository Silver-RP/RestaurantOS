import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Order, OrderItem } from '@/types/Order.type';

interface OrderItemProps {
  order: Order;
  reviewDate: string;
}

const OrderItemComponent: React.FC<OrderItemProps> = ({ order, reviewDate }) => {
  const [showMore, setShowMore] = useState(false);

  const orderItems = order.order_items ?? [];

  if (orderItems.length === 0) {
    return <div className="text-white">Không có sản phẩm trong đơn hàng này.</div>;
  }
  const normalizeItem = (item: OrderItem) => {
    return {
      _id: item._id,
      name: item.dish_id.name,
      image: item.dish_id.images?.[0] || '',  
      category: item.dish_id.categories?.[0] || '', 
      quantity: item.quantity,
      price: item.unit_price,
      discount_price: item.dish_id.discount_price ?? null,
    };
  };

  const normalizedItems = orderItems.map(normalizeItem);
  const [firstItem, ...remainingItems] = normalizedItems;

  const totalPrice = normalizedItems.reduce(
    (sum, item) => sum + (item.discount_price ?? item.price) * item.quantity,
    0
  );

  return (
    <div className="relative text-white p-4 md:p-6 border border-white/10 rounded-md bg-[#0a1e2d]">
      {/* Trạng thái đơn */}
      <div className="flex justify-end text-xs md:text-sm mb-2 space-x-4">
        <span className="text-green-400">{order.delivery_status}</span>
        <span className="text-secondaryColor font-semibold">{order.status}</span>
      </div>

      {/* Sản phẩm đầu tiên */}
      <div className="border-y border-white/20 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center min-w-0 flex-grow">
          <img
            src={firstItem.image}
            alt={firstItem.name}
            className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 object-cover rounded-md"
          />
          <div className="ml-4 min-w-0">
            <h2 className="font-bold text-sm md:text-lg lg:text-xl line-clamp-2 lg:line-clamp-1">
              {firstItem.name}
            </h2>
            <p className="text-xs md:text-sm mt-1">Phân loại: {firstItem.category}</p>
            <p className="text-xs md:text-sm mt-1">x{firstItem.quantity}</p>
          </div>
        </div>
        <div className="text-right whitespace-nowrap">
          <p className="text-xs md:text-sm line-through text-white/60">
            {(firstItem.price * firstItem.quantity).toLocaleString()} VND
          </p>
          <p className="text-secondaryColor text-sm md:text-lg font-bold">
            {((firstItem.discount_price ?? firstItem.price) * firstItem.quantity).toLocaleString()} VND
          </p>
        </div>
      </div>

      {/* Các sản phẩm còn lại */}
      {showMore && remainingItems.length > 0 && (
        <div className="mt-4 space-y-4">
          {remainingItems.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b border-white/10 pb-2 gap-4">
              <div className="flex items-center flex-grow min-w-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-cover rounded-md"
                />
                <div className="ml-3 min-w-0">
                  <h3 className="font-semibold text-xs md:text-sm line-clamp-2">{item.name}</h3>
                  <p className="text-[10px] md:text-xs mt-1">Phân loại: {item.category}</p>
                  <p className="text-[10px] md:text-xs mt-1">x{item.quantity}</p>
                </div>
              </div>
              <div className="text-right whitespace-nowrap">
                <p className="text-[10px] md:text-xs line-through text-white/60">
                  {(item.price * item.quantity).toLocaleString()} VND
                </p>
                <p className="text-secondaryColor text-xs md:text-sm font-bold">
                  {((item.discount_price ?? item.price) * item.quantity).toLocaleString()} VND
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nút "Xem thêm"/"Thu gọn" */}
      {remainingItems.length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center text-xs text-white/70 hover:underline"
          >
            {showMore ? 'Thu gọn' : 'Xem thêm'}
            {showMore ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
          </button>
        </div>
      )}

      {/* Tổng tiền + Nút thao tác */}
      <div className="mt-4 flex flex-col gap-3">
        <div className="flex justify-between gap-2 w-full">
          <p className="text-xs text-white/50">
            Đánh giá đơn hàng trước: <span className="underline">{reviewDate}</span>
          </p>
          <p className="text-sm md:text-lg text-right">
            Thành tiền:{' '}
            <span className="text-secondaryColor font-bold">{totalPrice.toLocaleString()} VND</span>
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button className="bg-[#083344] hover:bg-[#0f4a5c] px-3 py-2 rounded text-white text-xs md:text-sm">
            Đánh Giá
          </button>
          <button className="bg-[#1f2937] hover:bg-[#374151] px-3 py-2 rounded text-white text-xs md:text-sm">
            Liên Hệ Người Bán
          </button>
          <button className="bg-[#1f2937] hover:bg-[#374151] px-3 py-2 rounded text-white text-xs md:text-sm">
            Mua Lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderItemComponent;
