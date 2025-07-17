import React, { useState, useEffect } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

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
  initialFilters?: Partial<FiltersType>;
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}

const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({
  onApply,
  initialFilters = {},
}) => {
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FiltersType>({
    category: initialFilters.category || '',
    priceMin: initialFilters.priceMin || '',
    priceMax: initialFilters.priceMax || '',
    discountMin: initialFilters.discountMin || '',
    discountMax: initialFilters.discountMax || '',
    stockMin: initialFilters.stockMin || '',
    stockMax: initialFilters.stockMax || '',
    viewsMin: initialFilters.viewsMin || '',
    viewsMax: initialFilters.viewsMax || '',
    orderedMin: initialFilters.orderedMin || '',
    orderedMax: initialFilters.orderedMax || '',
    ratingMin: initialFilters.ratingMin || '',
    ratingMax: initialFilters.ratingMax || '',
    status: initialFilters.status || '',
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: initialFilters?.category || '',
      priceMin: initialFilters?.priceMin || '',
      priceMax: initialFilters?.priceMax || '',
      discountMin: initialFilters?.discountMin || '',
      discountMax: initialFilters?.discountMax || '',
      stockMin: initialFilters?.stockMin || '',
      stockMax: initialFilters?.stockMax || '',
      viewsMin: initialFilters?.viewsMin || '',
      viewsMax: initialFilters?.viewsMax || '',
      orderedMin: initialFilters?.orderedMin || '',
      orderedMax: initialFilters?.orderedMax || '',
      ratingMin: initialFilters?.ratingMin || '',
      ratingMax: initialFilters?.ratingMax || '',
      status: initialFilters?.status || '',
    }));
  }, [initialFilters]); 

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'ratingMin' || name === 'ratingMax') {
      const num = parseFloat(value);

      if (value === '') {
        setFilters((prev) => ({ ...prev, [name]: '' }));
        return;
      }

      if (isNaN(num) || num < 0 || num > 5) {
        toast.error('Giá trị rating phải từ 0 đến 5');
        return;
      }
      const thousandFields = [
        'priceMin',
        'priceMax',
        'discountMin',
        'discountMax',
      ];

      setFilters((prev) => ({ ...prev, [name]: num }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
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
              <option value="available">Có sẵn</option>
              <option value="hidden">Đã ẩn</option>
              <option value="soldout">Hết hàng</option>
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
          <label className="block mb-1 text-sm">Rating (0 - 5)</label>
          <div className="flex gap-8 flex-col">
            <input
              name="ratingMin"
              type="number"
              step="0.1"
              placeholder="Từ 0"
              min={0}
              max={5}
              className="w-full border rounded px-2 py-1"
              value={filters.ratingMin}
              onChange={handleChange}
            />
            <input
              name="ratingMax"
              type="number"
              step="0.1"
              placeholder="Đến 5"
              min={0}
              max={5}
              className="w-full border rounded px-2 py-1"
              value={filters.ratingMax}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className='mt-5'>
        <button
          onClick={() => onApply(filters)}
          className=" px-3 py-2 bg-blue-600 text-sm text-white rounded hover:bg-blue-700 mr-3"
        >
          Áp dụng bộ lọc
        </button>

        <button
          onClick={() => {
            const emptyFilters: FiltersType = {
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
            };

            setFilters(emptyFilters);

            const newParams = new URLSearchParams(searchParams.toString());

            Object.keys(emptyFilters).forEach((key) => {
              newParams.delete(key);
            });

            newParams.delete('keyword');
            newParams.set('page', '1');
            setSearchParams(newParams);
            onApply(emptyFilters);
          }}
          className="px-4 py-2 bg-gray-300 text-black text-sm rounded hover:bg-gray-400"
        >
          Xoá bộ lọc
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilterPanel;
