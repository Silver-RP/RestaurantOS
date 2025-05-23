import React, { useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { FiFilter } from 'react-icons/fi';
import { FiSearch } from 'react-icons/fi';
import { useFoods } from '@/hooks/useFoods';
import Pagination from '@components/common/Pagination';
import ButtonComponents from '@components/common/ButtonComponents';
import ReservationMenuItemCard from '@/components/pages/reservation/ReservationMenuItemCard';
import FilterSidebar from '@/components/pages/menu/FilterSidebar';
import { ReservationFormData } from '../../../types/ReservationFormData.type';
import ReservationOrderSidebar from '@/components/pages/reservation/ReservationOrderSidebar';
import AddReservationItemModal from './AddItemModal';

interface Step3MenuProps {
  formData: ReservationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReservationFormData>>;
  onNext: () => void;
  onBack: () => void;
}
export interface Food {
  _id: string;
  name: string;
  price: number;
  discount_price?: number;
  images?: string[];
  categories?: { Cate_name: string }[];
}

const Step3Menu: React.FC<Step3MenuProps> = ({
  formData,
  setFormData,
  onNext,
  onBack,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [chooseLater, setChooseLater] = useState<boolean>(false);
  const { foods, loading, error, pagination, setSearchParams, setPagination } =
    useFoods();

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

  return (
    <div className="px-4 md:px-8 flex gap-8 py-10 w-full max-w-[1500px] mx-auto text-white">
      {chooseLater === false && (
        <>
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

                {/* Ô dropdown sắp xếp */}
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

                  {/* Icon: đổi FiSearch → BsChevronDown */}
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-secondaryColor">
                    <BsChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Ô tìm kiếm */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm món ăn..."
                    className="bg-bodyBackground border border-gray-500 text-white placeholder:text-gray-400 rounded px-3 py-2 text-sm w-[180px] focus:outline-none focus:ring-2 focus:ring-secondaryColor"
                    onChange={(e) => {
                      const keyword = e.target.value;
                      setSearchParams((prev) => {
                        const newParams = new URLSearchParams(prev);
                        newParams.set('search', keyword);
                        newParams.set('page', '1');
                        return newParams;
                      });
                    }}
                  />
                  <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-secondaryColor w-4 h-4" />
                </div>
                <ButtonComponents
                  variant="filled"
                  size="small"
                  onClick={() => setIsSidebarOpen(true)}
                  className="ml-2"
                >
                  Xem món đã chọn
                </ButtonComponents>
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
              <div className="text-center py-20">
                Đang tải dữ liệu món ăn...
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-20">{error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {foods?.docs?.map((item) => (
                  <div
                    key={item._id}
                    className={`rounded border transition hover:scale-[1.01] ${
                      formData.menu === item._id
                        ? 'border-secondaryColor'
                        : 'border-transparent'
                    }`}
                  >
                    <ReservationMenuItemCard
                      image={item.images?.[0]}
                      name={item.name}
                      category={item.categories?.[0]?.Cate_name || 'Khác'}
                      price={`${item.discount_price || item.price} VND`}
                      onAdd={() => {
                        setSelectedFood(item);
                        setModalOpen(true);
                      }}
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
              onLimitChange={(newLimit) => {
                setSearchParams((prev) => {
                  const newParams = new URLSearchParams(prev);
                  newParams.set('limit', newLimit.toString());
                  newParams.set('page', '1'); // Reset về trang 1
                  return newParams;
                });
                setPagination((prev) => ({
                  ...prev,
                  limit: newLimit,
                  currentPage: 1,
                }));
              }}
            />

            {/* Action buttons */}
            <div className="flex justify-between mt-8">
              <ButtonComponents variant="outline" size="small" onClick={onBack}>
                Quay lại
              </ButtonComponents>
              <ButtonComponents
  variant="filled"
  size="small"
  onClick={() => {
    if (formData.selectedItems.length === 0) {
      setChooseLater(true);
    }
    onNext();
  }}
>
  {formData.selectedItems.length === 0 ? 'Sẽ chọn tại nhà hàng' : 'Tiếp tục'}
</ButtonComponents>
            </div>
          </main>
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <ReservationOrderSidebar
  items={formData.selectedItems}
  isOpen={isSidebarOpen}
  onClose={() => setIsSidebarOpen(false)}
  onCheckout={() => {
    setIsSidebarOpen(false);
    onNext();
  }}
  onRemoveItem={(id, note) => {
    setFormData((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.filter(
        (item) => !(item.id === id && item.note === note),
      ),
    }));
  }}
/>
          <AddReservationItemModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={(quantity, note) => {
              if (!selectedFood) return;
              setFormData((prev) => {
                const exist = prev.selectedItems.find(
                  (f) => f.id === selectedFood._id && f.note === note,
                );

                let newItems;

                if (exist) {
                  newItems = prev.selectedItems.map((f) =>
                    f.id === selectedFood._id && f.note === note
                      ? { ...f, quantity: f.quantity + quantity }
                      : f,
                  );
                } else {
                  newItems = [
                    ...prev.selectedItems,
                    {
                      id: selectedFood._id,
                      name: selectedFood.name,
                      price: selectedFood.discount_price || selectedFood.price,
                      quantity,
                      image: selectedFood.images?.[0] || '',
                      note,
                      category:
                        selectedFood.categories?.[0]?.Cate_name || 'Khác',
                    },
                  ];
                }

                return { ...prev, selectedItems: newItems };
              });
            }}
            itemName={selectedFood?.name || ''}
            itemPrice={selectedFood?.discount_price || selectedFood?.price || 0}
          />
        </>
      )}
    </div>
  );
};

export default Step3Menu;
