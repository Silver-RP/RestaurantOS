import React, { useState } from 'react';
import { BsGridFill, BsListUl } from 'react-icons/bs';
import { FiFilter } from 'react-icons/fi';
import { FiSearch } from 'react-icons/fi';
import { useSidebar } from '@/contexts/SidebarContext';
import { useFoods } from '@/hooks/useFoods';
import Pagination from '@components/common/Pagination';
import ButtonComponents from '@components/common/ButtonComponents';
import ReservationMenuItemCard from '@/components/common/ReservationMenuItemCard';
import FilterSidebar from '@/components/pages/menu/FilterSidebar';
import { ReservationFormData } from '../../../types/ReservationFormData.type';

interface Step3MenuProps {
  formData: ReservationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReservationFormData>>;
  onNext: () => void;
  onBack: () => void;
}

const Step3Menu: React.FC<Step3MenuProps> = ({ formData, setFormData, onNext, onBack }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { isExtended } = useSidebar();
  const {
    foods,
    loading,
    error,
    pagination,
    searchParams,
    setSearchParams,
    setPagination,
  } = useFoods();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value;
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set('sort', sortValue);
      newParams.set('page', '1');
      return newParams;
    });
  };

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const handleSelect = (id: string) => {
    setFormData((prev) => ({ ...prev, menu: id }));
  };

  return (
    <div className="px-4 md:px-8 flex gap-8 py-10 w-full max-w-[1500px] mx-auto text-white">
      {/* Overlay + Sidebar Filter */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={toggleFilter}
        />
      )}
      <div
        className={`fixed top-0 left-0 w-80 bg-bodyBackground h-full z-50 transform ${
          isFilterOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 overflow-y-auto h-full">
          <FilterSidebar onClose={() => setIsFilterOpen(false)} />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 space-y-8">
        {/* Header actions */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={toggleFilter}
              className="flex items-center gap-2 text-white hover:text-secondaryColor transition"
            >
              <FiFilter className="h-5 w-5" />
              <span className="text-sm">Lọc</span>
            </button>

            <div className="relative">
              <select
                onChange={handleSortChange}
                className="appearance-none bg-bodyBackground border border-gray-500 text-white rounded px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-secondaryColor"
              >
                <option value="relevance">Mặc định</option>
                <option value="priceLow">Giá thấp đến cao</option>
                <option value="priceHigh">Giá cao đến thấp</option>
                <option value="newest">Mới nhất</option>
                <option value="highestRated">Đánh giá cao nhất</option>
                <option value="mostViewed">Lượt xem nhiều nhất</option>
                <option value="mostOrdered">Đặt hàng nhiều nhất</option>
                <option value="mostFavorite">Được yêu thích nhất</option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-secondaryColor">
                <FiSearch className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Display count */}
          <div className="text-sm text-white">
            Hiển thị{' '}
            <span className="font-semibold text-secondaryColor">
              {(pagination.currentPage - 1) * pagination.limit + 1} -{' '}
              {Math.min(
                pagination.currentPage * pagination.limit,
                foods?.totalDocs || 0,
              )}
            </span>{' '}
            trên tổng{' '}
            <span className="font-semibold text-secondaryColor">
              {foods?.totalDocs || 0}
            </span>{' '}
            sản phẩm
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">Đang tải dữ liệu món ăn...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-20">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {foods?.docs?.map((item) => (
              <div
                key={item._id}
                className={`rounded border transition hover:scale-[1.01] ${
                  formData.menu === item._id ? 'border-secondaryColor' : 'border-transparent'
                }`}
                onClick={() => handleSelect(item._id)}
              >
                <ReservationMenuItemCard
                  image={item.images?.[0]}
                  name={item.name}
                  category={item.categories?.[0]?.Cate_name || 'Khác'}
                  price={`${item.discount_price || item.price} VND`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(newPage) => {
            setSearchParams((prev) => {
              const newParams = new URLSearchParams(prev);
              newParams.set('page', newPage.toString());
              return newParams;
            });
            setPagination((prev) => ({
              ...prev,
              currentPage: newPage,
              prevPage: Math.max(newPage - 1, 1),
              nextPage: Math.min(newPage + 1, pagination.totalPages),
            }));
          }}
          limit={pagination.limit}
          onLimitChange={() => {}}
        />

        {/* Action buttons */}
        <div className="flex justify-between mt-8">
          <ButtonComponents variant="outline" size="small" onClick={onBack}>
            Quay lại
          </ButtonComponents>
          <ButtonComponents
            variant="filled"
            size="small"
            onClick={onNext}
            disabled={!formData.menu}
          >
            Tiếp tục
          </ButtonComponents>
        </div>
      </main>
    </div>
  );
};

export default Step3Menu;