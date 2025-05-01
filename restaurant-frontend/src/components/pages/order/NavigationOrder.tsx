import React from 'react';

const tabs = ['Tất cả đơn hàng', 'Chưa xử lý', 'Đã xử lý', 'Đang giao hàng', 'Đã giao hàng', 'Đã hủy'];

interface NavigationOrderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavigationOrder: React.FC<NavigationOrderProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="text-white px-2 md:px-4 py-4">
      <h1 className="text-xl md:text-2xl font-semibold mb-4">Đơn hàng của tôi</h1>

      <div className="overflow-x-auto">
        <div className="flex text-xs lg:justify-between md:text-base whitespace-nowrap space-x-4 md:justify-between pb-4 border-b border-white/20">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`hover:underline transition ${
                activeTab === tab ? 'underline text-secondaryColor' : ''
              }`}
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
