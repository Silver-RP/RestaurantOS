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

export type StatusMapping = {
  status: string[] | null;
};

export const statusMapping: Record<string, StatusMapping> = {
  'Tất cả đơn hàng': { status: null },
  'Chờ xác nhận': { status: ['ORDER_PLACED'] },
  'Đang chuẩn bị': { status: ['ORDER_CONFIRMED', 'PENDING_PICKUP'] },
  'Đang giao hàng': { status: ['PICKED_UP', 'IN_TRANSIT'] },
  'Đã giao hàng': { status: ['DELIVERED', 'RETURN_REQUESTED', 'RETURN_APPROVED', 'RETURN_REJECTED'] },
  'Đã hủy': { status: ['CANCELLED'] },
  'Đã trả hàng': { status: ['RETURNED'] }
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
