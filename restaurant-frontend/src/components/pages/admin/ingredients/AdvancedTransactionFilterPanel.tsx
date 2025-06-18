import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWarehouseTransactionFilterPanel } from '@/hooks/useWarehouse';

type FiltersType = {
  ingredientId?: string;
  userId?: string;
  transactionType?: string;
  dateFrom?: string;
  dateTo?: string;
};

interface AdvancedFilterPanelProps {
  onApply: (filters: FiltersType) => void;
  initialFilters?: Partial<FiltersType>;
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}

const AdvancedTransactionFilterPanel: React.FC<AdvancedFilterPanelProps> = ({
  onApply,
  initialFilters = {},
}) => {
  const { staffs, ingredients } = useWarehouseTransactionFilterPanel();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FiltersType>({
    transactionType: initialFilters.transactionType || '',
    ingredientId: initialFilters.ingredientId || '',
    userId: initialFilters.userId || '',
    dateFrom: initialFilters.dateFrom || '',
    dateTo: initialFilters.dateTo || '',
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
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="border rounded p-4 bg-white shadow-md w-full mx-auto mb-6">
      <h2 className="text-lg font-semibold mb-4">Bộ lọc nâng cao</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <div className="col-span-1">
          <label className="block mb-1 text-sm">Loại giao dịch</label>
          <div className="flex gap-2 flex-col">
            <select
              name="transactionType"
              className="w-full border rounded px-2 py-1"
              value={filters.transactionType}
              onChange={handleChange}
            >
              <option value="">Tất cả</option>
              <option value="import">Nhập kho</option>
              <option value="export">Xuất kho</option>
              <option value="adjustment">Kiểm kê</option>
            </select>
          </div>
        </div>

        <div className="col-span-1">
          <label className="block mb-1 text-sm">Nhân viên</label>
          <div className="flex gap-2 flex-col">
            <select
              name="userId"
              className="w-full border rounded px-2 py-1"
              value={filters.userId}
              onChange={handleChange}
            >
              <option value="">Tất cả</option>
              {staffs?.map((staff) => (
                <option key={staff._id} value={staff._id}>
                  {staff.username?.trim() || 'Chưa có tên'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-span-1">
          <label className="block mb-1 text-sm">Nguyên liệu</label>
          <div className="flex gap-2 flex-col">
            <select
              name="ingredientId"
              className="w-full border rounded px-2 py-1"
              value={filters.ingredientId}
              onChange={handleChange}
            >
              <option value="">Tất cả</option>
              {ingredients.map((ingr) => (
                <option key={ingr._id} value={ingr._id}>
                  {ingr.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ngày */}
        <div className="col-span-1">
          <label className="block mb-1 text-sm">Từ ngày</label>
          <div className="flex gap-8 flex-col">
            <input
              name="dateFrom"
              type="date"
              placeholder="Từ 0"
              min={0}
              className="w-full border rounded px-2 py-1"
              value={filters.dateFrom}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-span-1">
          <label className="block mb-1 text-sm">Đến ngày</label>
          <div className="flex gap-8 flex-col">
            <input
              name="dateTo"
              type="date"
              placeholder="Đến"
              min={0}
              className="w-full border rounded px-2 py-1"
              value={filters.dateTo}
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
              ingredientId: '',
              userId: '',
              transactionType: '',
              dateFrom: '',
              dateTo: '',
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

export default AdvancedTransactionFilterPanel;
