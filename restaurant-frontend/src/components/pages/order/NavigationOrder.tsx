import React from 'react';

export const tabs = [
  'Tất cả đơn hàng',
  'Chờ xác nhận',
  'Đang chuẩn bị',
  'Đang giao hàng',
  'Đã giao hàng',
  'Đã hủy',
  'Đã trả hàng',
];

export type DeliveryStatusMapping = {
  delivery_status: string[] | null;
};

export const deliveryStatusMapping: Record<string, DeliveryStatusMapping> = {
  'Tất cả đơn hàng': { delivery_status: null },
  'Chờ xác nhận': { delivery_status: ['PENDING'] },
  'Đang chuẩn bị': { delivery_status: ['PENDING_PICKUP', 'CANCEL_REQUESTED'] },
  'Đang giao hàng': { delivery_status: ['PICKED_UP', 'IN_TRANSIT'] },
  'Đã giao hàng': { delivery_status: ['DELIVERED', 'RETURN_REQUESTED'] },
  'Đã hủy': { delivery_status: ['CANCELLED'] },
  'Đã trả hàng': { delivery_status: ['RETURNED'] }
};

interface NavigationOrderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavigationOrder: React.FC<NavigationOrderProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="text-white px-2 md:px-0 py-4">
      <h1 className="text-xl md:text-2xl mb-4">Đơn hàng của tôi</h1>
      <div className="overflow-x-auto">
        <div className="flex text-xs lg:justify-between md:text-base whitespace-nowrap space-x-4 md:justify-between pb-4 border-b border-white/20">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`hover:underline transition ${activeTab === tab ? 'underline text-secondaryColor' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationOrder;
