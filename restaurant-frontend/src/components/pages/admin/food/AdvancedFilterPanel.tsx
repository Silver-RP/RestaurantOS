import React, { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
type FiltersType = {
  category: string;
  priceMin: string;
  priceMax: string;
  discountMin: string;
  discountMax: string;
  stockMin: string;
  stockMax: string;
  viewsMin: string;
  viewsMax: string;
  orderedMin: string;
  orderedMax: string;
  ratingMin: string;
  ratingMax: string;
  status: string;
};
interface AdvancedFilterPanelProps {
  onApply: (filters: FiltersType) => void;
}
const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({
  onApply,
}) => {
  const { categories } = useCategories();
  const [filters, setFilters] = useState({
    category: '',
    priceMin: '',
    priceMax: '',
    discountMin: '',
    discountMax: '',
    stockMin: '',
    stockMax: '',
    viewsMin: '',
    viewsMax: '',
    orderedMin: '',
    orderedMax: '',
    ratingMin: '',
    ratingMax: '',
    status: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="border rounded p-4 bg-white shadow-md w-full mx-auto mb-6">
      <h2 className="text-lg font-semibold mb-4">Bộ lọc nâng cao</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {/* Danh mục */}
        <div className="col-span-1">
          <label className="block mb-1 text-sm">Danh mục</label>
          <div className="flex gap-2 flex-col">
            <select
              name="category"
              className="w-full border rounded px-2 py-1"
              value={filters.category}
              onChange={handleChange}
            >
              <option value="">Tất cả</option>
              {categories?.data.map((cat) => (
                <option key={cat._id} value={cat.Cate_slug}>
                  {cat.Cate_name}
                </option>
              ))}
            </select>
            <label className="block text-sm">Trạng thái</label>
            <select
              name="status"
              className="w-full border rounded px-2 py-1"
              value={filters.status}
              onChange={handleChange}
            >
              <option value="">Tất cả</option>
              <option value="available">Available</option>
              <option value="hidden">Hidden</option>
              <option value="soldout">Sold Out</option>
            </select>
          </div>
        </div>

        {/* Giá */}
        <div className="col-span-1">
          <label className="block mb-1 text-sm">Giá (đ)</label>
          <div className="flex gap-8 flex-col">
            <input
              name="priceMin"
              type="number"
              placeholder="Từ"
              className="w-full border rounded px-2 py-1"
              value={filters.priceMin}
              onChange={handleChange}
            />
            <input
              name="priceMax"
              type="number"
              placeholder="Đến"
              className="w-full border rounded px-2 py-1"
              value={filters.priceMax}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Giá KM */}
        <div className="col-span-1">
          <label className="block mb-1 text-sm">Giá KM</label>
          <div className="flex gap-8 flex-col">
            <input
              name="discountMin"
              type="number"
              placeholder="Từ"
              className="w-full border rounded px-2 py-1"
              value={filters.discountMin}
              onChange={handleChange}
            />
            <input
              name="discountMax"
              type="number"
              placeholder="Đến"
              className="w-full border rounded px-2 py-1"
              value={filters.discountMax}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Kho */}
        <div className="col-span-1">
          <label className="block mb-1 text-sm">Kho</label>
          <div className="flex gap-8 flex-col">
            <input
              name="stockMin"
              type="number"
              placeholder="Từ"
              className="w-full border rounded px-2 py-1"
              value={filters.stockMin}
              onChange={handleChange}
            />
            <input
              name="stockMax"
              type="number"
              placeholder="Đến"
              className="w-full border rounded px-2 py-1"
              value={filters.stockMax}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Lượt xem */}
        <div className="col-span-1">
          <label className="block mb-1 text-sm">Lượt xem</label>
          <div className="flex gap-8 flex-col">
            <input
              name="viewsMin"
              type="number"
              placeholder="Từ"
              className="w-full border rounded px-2 py-1"
              value={filters.viewsMin}
              onChange={handleChange}
            />
            <input
              name="viewsMax"
              type="number"
              placeholder="Đến"
              className="w-full border rounded px-2 py-1"
              value={filters.viewsMax}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Số đặt */}
        <div className="col-span-1">
          <label className="block mb-1 text-sm">Số đặt</label>
          <div className="flex gap-8 flex-col">
            <input
              name="orderedMin"
              type="number"
              placeholder="Từ"
              className="w-full border rounded px-2 py-1"
              value={filters.orderedMin}
              onChange={handleChange}
            />
            <input
              name="orderedMax"
              type="number"
              placeholder="Đến"
              className="w-full border rounded px-2 py-1"
              value={filters.orderedMax}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Rating */}
        <div className="col-span-1">
          <label className="block mb-1 text-sm">Rating</label>
          <div className="flex gap-8 flex-col">
            <input
              name="ratingMin"
              type="number"
              step="0.1"
              placeholder="Từ"
              className="w-full border rounded px-2 py-1"
              value={filters.ratingMin}
              onChange={handleChange}
            />
            <input
              name="ratingMax"
              type="number"
              step="0.1"
              placeholder="Đến"
              className="w-full border rounded px-2 py-1"
              value={filters.ratingMax}
              onChange={handleChange}
            />
          </div>
        </div>
        <button
          onClick={() => onApply(filters)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Áp dụng bộ lọc
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilterPanel;
