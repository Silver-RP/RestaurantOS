import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { ingredientUnits, IngredientGroup } from '../../../../types/ingredientUnitsType';

type FiltersType = {
  unit?: string;
  group?: string;
  stockStatus?: string;
  minPrice?: string;
  maxPrice?: string;
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FiltersType>({
    unit: initialFilters.unit || '',
    group: initialFilters.group || '',
    stockStatus: initialFilters.stockStatus || '',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      ...initialFilters,
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

      setFilters((prev) => ({ ...prev, [name]: num }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="border rounded p-4 bg-white shadow-md w-full mx-auto mb-6">
      <h2 className="text-lg font-semibold mb-4">Bộ lọc nâng cao</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <div className="col-span-1">
          <label className="block mb-1 text-sm">Đơn vị</label>
          <div className="flex gap-2 flex-col">
            <select
              name="unit"
              className="w-full border rounded px-2 py-1"
              value={filters.unit}
              onChange={handleChange}
            >
              <option value="">Tất cả</option>
              {ingredientUnits.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-span-1">
          <label className="block mb-1 text-sm">Nhóm</label>
          <div className="flex gap-2 flex-col">
            <select
              name="group"
              className="w-full border rounded px-2 py-1"
              value={filters.group}
              onChange={handleChange}
            >
              <option value="">Tất cả</option>
              {IngredientGroup.map(( item ) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-span-1">
          <label className="block mb-1 text-sm">Trạng thái kho</label>
          <div className="flex gap-2 flex-col">
            <select
              name="stockStatus"
              className="w-full border rounded px-2 py-1"
              value={filters.stockStatus}
              onChange={handleChange}
            >
              <option value="">Tất cả</option>
              <option value="in_stock">Còn hàng</option>
              <option value="low_stock">Sắp hết</option>
              <option value="out_of_stock">Hết hàng</option>
            </select>
          </div>
        </div>

        {/* Giá */}
        <div className="col-span-1">
          <label className="block mb-1 text-sm">Giá (đ)</label>
          <div className="flex gap-8 flex-col">
            <input
              name="minPrice"
              type="number"
              placeholder="Từ 0"
              min={0}
              className="w-full border rounded px-2 py-1"
              value={filters.minPrice}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-span-1">
          <label className="block mb-1 text-sm">Giá (đ)</label>
          <div className="flex gap-8 flex-col">
            <input
              name="maxPrice"
              type="number"
              placeholder="Đến"
              min={0}
              className="w-full border rounded px-2 py-1"
              value={filters.maxPrice}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="mt-5">
        <button
          onClick={() => onApply(filters)}
          className=" px-3 py-2 bg-blue-600 text-sm text-white rounded hover:bg-blue-700 mr-3"
        >
          Áp dụng bộ lọc
        </button>

        <button
          onClick={() => {
            const emptyFilters: FiltersType = {
              unit: '',
              group: '',
              stockStatus: '',
              minPrice: '',
              maxPrice: '',
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
