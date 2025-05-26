import React, { useState, useEffect } from 'react';
import { useRoles } from '@/hooks/useRoles';

// Define the UserFiltersType interface
export interface UserFiltersType {
  role: string;
  gender: string;
  status: string;
  isVerified: string;
  birthdayFrom: string;
  birthdayTo: string;
}

interface Props {
  initialFilters?: Partial<UserFiltersType>;
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
  onApply: (filters: UserFiltersType) => void;
}

const UserFilterPanel: React.FC<Props> = ({
  initialFilters = {},
  searchParams,
  setSearchParams,
  onApply,
}) => {
  const { roles } = useRoles();

  const [filters, setFilters] = useState<UserFiltersType>({
    role: initialFilters.role || '',
    gender: initialFilters.gender || '',
    status: initialFilters.status || '',
    isVerified: initialFilters.isVerified || '',
    birthdayFrom: initialFilters.birthdayFrom || '',
    birthdayTo: initialFilters.birthdayTo || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="border rounded p-4 bg-white shadow-md w-full mx-auto mb-6">
      <h2 className="text-lg font-semibold mb-4">Bộ lọc nâng cao người dùng</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Vai trò */}
        <div>
          <label className="block text-sm mb-1">Vai trò</label>
          <select name="role" value={filters.role} onChange={handleChange} className="w-full border px-2 py-1 rounded">
            <option value="">Tất cả</option>
            {roles.map((r) => (
              <option key={r._id} value={r.name}>{r.name}</option>
            ))}
          </select>
        </div>

        {/* Giới tính */}
        <div>
          <label className="block text-sm mb-1">Giới tính</label>
          <select name="gender" value={filters.gender} onChange={handleChange} className="w-full border px-2 py-1 rounded">
            <option value="">Tất cả</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>

        {/* Trạng thái tài khoản */}
        <div>
          <label className="block text-sm mb-1">Trạng thái</label>
          <select name="status" value={filters.status} onChange={handleChange} className="w-full border px-2 py-1 rounded">
            <option value="">Tất cả</option>
            <option value="active">Kích hoạt</option>
            <option value="block">Đã khóa</option>
          </select>
        </div>

        {/* Trạng thái xác minh */}
        <div>
          <label className="block text-sm mb-1">Xác minh</label>
          <select name="isVerified" value={filters.isVerified} onChange={handleChange} className="w-full border px-2 py-1 rounded">
            <option value="">Tất cả</option>
            <option value="true">Đã xác minh</option>
            <option value="false">Chưa xác minh</option>
          </select>
        </div>

        {/* Ngày sinh */}
        <div>
          <label className="block text-sm mb-1">Ngày sinh từ</label>
          <input type="date" name="birthdayFrom" value={filters.birthdayFrom} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block text-sm mb-1">Đến ngày</label>
          <input type="date" name="birthdayTo" value={filters.birthdayTo} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
        </div>
      </div>

      {/* Nút hành động */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => onApply(filters)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Áp dụng bộ lọc
        </button>
        <button
          onClick={() => {
            const reset = {
              role: '', gender: '', status: '',
              isVerified: '', birthdayFrom: '', birthdayTo: ''
            };
            setFilters(reset);
            const params = new URLSearchParams(searchParams.toString());
            Object.keys(reset).forEach((key) => params.delete(key));
            params.set('page', '1');
            setSearchParams(params);
            onApply(reset);
          }}
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          Xoá bộ lọc
        </button>
      </div>
    </div>
  );
};

export default UserFilterPanel;
