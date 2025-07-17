import React from 'react';
import { FiX } from 'react-icons/fi';
import ButtonComponents from '../../common/ButtonComponents';

interface ReservationOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  note?: string;
}

interface ReservationOrderSidebarProps {
  items: ReservationOrderItem[];
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  onRemoveItem: (id: string, note?: string) => void;
}

const ReservationOrderSidebar: React.FC<ReservationOrderSidebarProps> = ({
  items,
  isOpen,
  onClose,
  onCheckout,
  onRemoveItem
}) => {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-[#0C2B40] text-white z-50 shadow-lg transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-600">
        <h2 className="text-lg font-medium">Danh sách món đặt trước</h2>
        <button onClick={onClose}>
          <FiX className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="p-4 space-y-4 max-h-[calc(100%-200px)] overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id + (item.note || '')}
            className="flex h-[100px] border-b border-gray-700 pb-4"
          >
            {/* Ảnh kéo full chiều cao */}
            <div className="w-[100px] h-full shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover rounded"
              />
            </div>

            {/* Nội dung */}
            <div className="flex-1 text-left ml-3 flex flex-col justify-between">
              <div>
                <h3 className="text-base line-clamp-2 leading-snug min-h-[2.75rem] break-words">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-300 mt-1">
                  {item.quantity} × {item.price.toLocaleString()} VND
                </p>
              </div>
              {item.note && (
                <p className="text-sm mt-1">
                  <span className="text-gray-300 font-medium">Ghi chú: </span>
                  <span className="text-gray-200 italic">{item.note}</span>
                </p>
              )}
            </div>

            {/* Nút xoá */}
            <button
              className="ml-2 mt-1"
              onClick={() => onRemoveItem(item.id, item.note)}
            >
              <FiX className="text-white hover:text-red-400" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-600">
        <div className="flex justify-between mb-4">
          <span className="text-white text-base">Tổng cộng:</span>
          <span className="text-secondaryColor font-semibold">
            {total.toLocaleString()} VND
          </span>
        </div>
        <ButtonComponents
          onClick={onCheckout}
          variant="filled"
          size="medium"
          className="w-full bg-[#FFE4A0] text-black py-2"
        >
          XÁC NHẬN ĐƠN HÀNG
        </ButtonComponents>
      </div>
    </div>
  );
};

export default ReservationOrderSidebar;
