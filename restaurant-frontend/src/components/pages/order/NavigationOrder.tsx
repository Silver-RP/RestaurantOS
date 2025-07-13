import React, { useState, useRef } from 'react';
import { FaSort, FaSearch } from 'react-icons/fa';

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
  onSort: (type: 'newest' | 'oldest') => void;
  currentSort: 'newest' | 'oldest';
  onSearch: (term: string) => void;
  searchTerm: string;
}

const NavigationOrder: React.FC<NavigationOrderProps> = ({ 
  activeTab, 
  onTabChange,
  onSort,
  currentSort,
  onSearch,
  searchTerm
}) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const debounceRef = useRef<number | null>(null);

  const handleSort = (type: 'newest' | 'oldest') => {
    onSort(type);
    setShowSortDropdown(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(value);
    }, 1000);
  };

  return (
    <div className="text-white px-2 md:px-0 py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h1 className="text-xl md:text-2xl">Đơn hàng của tôi</h1>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-grow md:flex-grow-0">
            <input
              type="text"
              placeholder="Tìm kiếm mã đơn hàng "
              value={searchTerm}
              onChange={handleSearch}
              className="w-full md:w-64 px-4 py-2 bg-[#14324a] text-white rounded-lg border border-white/20 focus:border-secondaryColor focus:outline-none"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          </div>
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-[#14324a] text-white rounded-lg border border-white/20 hover:border-secondaryColor focus:outline-none"
            >
              <FaSort />
              <span>Sắp xếp</span>
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[#14324a] rounded-lg shadow-lg border border-white/20 z-10">
                <button
                  onClick={() => handleSort('newest')}
                  className={`w-full text-left px-4 py-2 hover:bg-white/10 ${
                    currentSort === 'newest' ? 'text-secondaryColor' : 'text-white'
                  }`}
                >
                  Mới nhất
                </button>
                <button
                  onClick={() => handleSort('oldest')}
                  className={`w-full text-left px-4 py-2 hover:bg-white/10 ${
                    currentSort === 'oldest' ? 'text-secondaryColor' : 'text-white'
                  }`}
                >
                  Cũ nhất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

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
