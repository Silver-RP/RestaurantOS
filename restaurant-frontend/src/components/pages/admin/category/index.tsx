import React, { useEffect, useMemo, useState } from 'react';
import { useCategories } from '@hooks/useCategories';
import { FaChevronDown } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminPagination from '../AdminPagination';

const CategoriesPage: React.FC = () => {
  const { categories, loading, error } = useCategories();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('keyword') || '');
  const [sortType, setSortType] = useState<'asc' | 'desc' | ''>('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('keyword', search);
    if (sortType) params.set('sort', sortType);
    params.set('page', '1');
    setSearchParams(params);
  }, [search, sortType]);

  const filteredData = useMemo(() => {
    if (!categories?.data) return [];

    let data = categories.data.filter((c) =>
      c.Cate_name.toLowerCase().includes(search.toLowerCase()),
    );

    if (sortType === 'asc')
      data = [...data].sort((a, b) => a.Cate_name.localeCompare(b.Cate_name));
    if (sortType === 'desc')
      data = [...data].sort((a, b) => b.Cate_name.localeCompare(a.Cate_name));

    return data;
  }, [categories, search, sortType]);

  const perPage = 10;
  const totalPages = Math.ceil(filteredData.length / perPage);
  const currentPageData = filteredData.slice(
    (page - 1) * perPage,
    page * perPage,
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-admintext mb-4">
          Danh sách danh mục
        </h1>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Tìm danh mục..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-md w-full sm:w-96"
          />

          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center px-4 py-2 border rounded-md shadow-sm bg-white gap-2"
            >
              {sortType === 'asc'
                ? 'Tên A-Z'
                : sortType === 'desc'
                  ? 'Tên Z-A'
                  : 'Sắp xếp theo tên'}
              <FaChevronDown className="text-sm" />
            </button>
            {showSortDropdown && (
              <div className="absolute mt-2 bg-white border rounded-md shadow-md z-10 w-40">
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSortType('asc');
                    setShowSortDropdown(false);
                  }}
                >
                  Tên A-Z
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSortType('desc');
                    setShowSortDropdown(false);
                  }}
                >
                  Tên Z-A
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => navigate('/admin/categories/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Thêm danh mục
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-700">
        Hiển thị <strong>{currentPageData.length}</strong> trên tổng{' '}
        <strong>{filteredData.length}</strong> danh mục
      </div>

      {loading ? (
        <p>Đang tải danh mục...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-sm text-gray-700">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border-b">Ảnh</th>
                <th className="p-3 border-b">Tên danh mục</th>
                <th className="p-3 border-b">Slug</th>
                <th className="p-3 border-b">Loại</th>
                <th className="p-3 border-b">Số món</th>
                <th className="p-3 border-b">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((cate) => (
                <tr key={cate._id} className="hover:bg-gray-50 border-b">
                  <td className="p-3">
                    {cate.Cate_img ? (
                      <img
                        src={cate.Cate_img}
                        alt={cate.Cate_name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                        Không có ảnh
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium">{cate.Cate_name}</td>
                  <td className="p-3">{cate.Cate_slug}</td>
                  <td className="p-3">
                    {cate.Cate_type === 'dish' ? 'Món ăn' : 'Đồ uống'}
                  </td>
                  <td className="p-3">{cate.foodCount || 0}</td>
                  <td className="p-3 space-x-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() =>
                        navigate(`/admin/categories/edit/${cate._id}`)
                      }
                    >
                      Sửa
                    </button>
                    <button className="text-red-500 hover:underline">
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <AdminPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set('page', String(newPage));
              setSearchParams(params);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
