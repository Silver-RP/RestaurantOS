import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface Item {
  image: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  originalPrice: number;
}

interface OrderItemProps {
  items: Item[];
  reviewDate: string;
}

const OrderItem: React.FC<OrderItemProps> = ({ items, reviewDate }) => {
  const [expanded, setExpanded] = useState(false);
  const firstItem = items[0];
  const otherItems = items.slice(1);
  const totalPrice = items.reduce((total, item) => total + item.price, 0);

  return (
    <div className="relative text-white p-4 md:p-6 border border-white/10 rounded-md">
      <div className="flex justify-end text-xs md:text-sm mb-2 space-x-2 md:space-x-4">
        <span className="text-green-400">Giao hàng thành công</span>
        <span className="text-secondaryColor font-semibold">HOÀN THÀNH</span>
      </div>

      <div className="border-t border-b border-white/20 py-4 flex justify-between items-center gap-4">
      <div className="flex flex-grow items-center min-w-0">
        <img
          src={firstItem.image}
          alt={firstItem.name}
          className="w-20 h-20 lg:w-32 lg:h-32 md:w-24 md:h-24 object-cover rounded-md"
        />
        <div className="ml-4 min-w-0">
          <h2 className="font-bold text-sm lg:text-xl md:text-lg line-clamp-2 lg:line-clamp-1">
            {firstItem.name}
          </h2>
          <p className="text-xs md:text-sm mt-1">Phân loại: {firstItem.category}</p>
          <p className="text-xs md:text-sm mt-1">x{firstItem.quantity}</p>
        </div>
      </div>

      {/* Bên phải: giá */}
      <div className="text-right whitespace-nowrap">
        <p className="text-xs lg:text-sm md:text-sm line-through text-white/60">
          {firstItem.originalPrice.toLocaleString()} VND
        </p>
        <p className="text-secondaryColor text-sm font-bold lg:text-lg md:text-lg">
          {firstItem.price.toLocaleString()} VND
        </p>
      </div>
    </div>


{/* Các sản phẩm khác */}
{expanded && (
  <div className="mt-4 space-y-4">
    {otherItems.map((item, index) => (
      <div key={index} className="flex justify-between items-center border-b border-white/10 pb-2 gap-4">
        {/* Bên trái: ảnh + thông tin */}
        <div className="flex items-center flex-grow min-w-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 lg:w-24 lg:h-24 md:w-20 md:h-20 object-cover rounded-md"
          />
          <div className="ml-3 min-w-0">
            <h3 className="font-semibold text-xs md:text-sm line-clamp-2">
              {item.name}
            </h3>
            <p className="text-[10px] md:text-xs mt-1">Phân loại: {item.category}</p>
            <p className="text-[10px] md:text-xs mt-1">x{item.quantity}</p>
          </div>
        </div>

        {/* Bên phải: giá */}
        <div className="text-right whitespace-nowrap">
          <p className="text-[10px] md:text-xs line-through text-white/60">
            {item.originalPrice.toLocaleString()} VND
          </p>
          <p className="text-secondaryColor text-xs font-bold md:text-sm">
            {item.price.toLocaleString()} VND
          </p>
        </div>
      </div>
    ))}
  </div>
)}

      {/* Nút xem thêm / thu gọn */}
      {otherItems.length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center text-xs text-white/70 hover:underline"
          >
            {expanded ? 'Thu gọn' : 'Xem thêm'}
            {expanded ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
          </button>
        </div>
      )}

      {/* Thành tiền và nút */}
      <div className="mt-4 flex flex-col gap-3">    
        <div className="flex justify-between gap-2 w-full">
        <p className="text-xs text-white/50">
          Đánh giá đơn hàng trước: <span className="underline">{reviewDate}</span>
        </p>
          <p className="text-sm md:text-lg text-right">
            Thành tiền:{' '}
            <span className="text-secondaryColor font-bold">
              {totalPrice.toLocaleString()}VND
            </span>
          </p>

        </div>
        <div className="flex justify-end gap-2">
            <button className="bg-[#083344] hover:bg-[#0f4a5c] px-2 py-2 lg:px-4 md:px-4 rounded text-white text-xs md:text-sm">
              Đánh Giá
            </button>
            <button className="bg-[#1f2937] hover:bg-[#374151] px-2 py-2 lg:px-4 md:px-4 rounded text-white text-xs md:text-sm">
              Liên Hệ Người Bán
            </button>
            <button className="bg-[#1f2937] hover:bg-[#374151] px-2 py-2 lg:px-4 md:px-4 rounded text-white text-xs md:text-sm">
              Mua Lại
            </button>
          </div>
      </div>
    </div>
  );
};

export default OrderItem;
