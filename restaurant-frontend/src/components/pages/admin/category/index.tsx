import React, { useEffect, useMemo, useState } from 'react';
import { useCategories, useDeleteCategory } from '@hooks/useCategories';
import { FaChevronDown } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminPagination from '../AdminPagination';
import { ToastConfigAdmin } from '@/components/common/ToastConfig';
import { confirmAlert } from 'react-confirm-alert';

import { toast } from 'react-toastify';
import { FaArrowUp, FaArrowDown, FaSort } from 'react-icons/fa';
const CategoriesPage: React.FC = () => {
  const [sortField, setSortField] = useState<string>(''); // tên trường được sort
  const [order, setOrder] = useState<'asc' | 'desc'>('asc'); // thứ tự
  const { handleDeleteCategory } = useDeleteCategory();

  const { categories, loading, error, refetch, setCategories } =
    useCategories();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('keyword') || '');
  const [sortType, setSortType] = useState<'asc' | 'desc' | ''>('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('keyword', search);
    if (sortField) params.set('sort', sortField);
    if (order) params.set('order', order);
    params.set('page', '1');
    setSearchParams(params);
  }, [search, sortField, order]);

  const filteredData = useMemo(() => {
    if (!categories?.data) return [];

    let data = categories.data.filter((c) =>
      c.Cate_name.toLowerCase().includes(search.toLowerCase()),
    );

    if (sortField) {
      data = [...data].sort((a, b) => {
        const aField = a[sortField]?.toString().toLowerCase() ?? '';
        const bField = b[sortField]?.toString().toLowerCase() ?? '';
        return order === 'asc'
          ? aField.localeCompare(bField)
          : bField.localeCompare(aField);
      });
    }

    return data;
  }, [categories, search, sortField, order]);
  const handleSort = (field: string) => {
    if (sortField === field) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setOrder('asc');
    }
  };
  const getSortIcon = (field: string) => {
    if (sortField !== field) return <FaSort />;
    return order === 'asc' ? <FaArrowUp /> : <FaArrowDown />;
  };
  const perPage = 10;
  const totalPages = Math.ceil(filteredData.length / perPage);
  const currentPageData = filteredData.slice(
    (page - 1) * perPage,
    page * perPage,
  );
  const confirmDelete = (id: string, name: string, foodCount: number) => {
    if (foodCount > 0) {
      toast.error('Không thể xoá danh mục đang chứa món ăn.');
      return;
    }
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start pt-24">
          <div className="bg-[#1f1f1f] text-white rounded-lg p-6 max-w-md w-full shadow-lg animate-[slideDown_0.3s_ease-out]">
            <h2 className="text-red-400 font-semibold text-lg mb-3 flex items-center gap-2">
              ⚠️ Xác nhận xoá
            </h2>
            <p className="text-sm mb-6">
              Bạn có chắc chắn muốn xoá danh mục "
              <span className="font-medium text-white">{name}</span>" không?
            </p>
            <div className="flex justify-end gap-3 text-sm">
              <button
                onClick={onClose}
                className="px-3 py-1 border border-gray-400 text-gray-300 rounded hover:bg-gray-700"
              >
                Huỷ
              </button>
              <button
                onClick={() => {
                  handleDeleteCategory(id, {
                    onSuccess: () => {
                      toast.success('Xoá danh mục thành công!');
                      setCategories((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          data: prev.data.filter((cate) => cate._id !== id),
                        };
                      });
                    },
                  });
                  onClose();
                }}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      ),
    });
  };

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
                <th
                  className="p-3 border-b cursor-pointer"
                  onClick={() => handleSort('Cate_name')}
                >
                  <div className="flex items-center gap-1">
                    Tên danh mục {getSortIcon('Cate_name')}
                  </div>
                </th>
                <th
                  className="p-3 border-b cursor-pointer"
                  onClick={() => handleSort('Cate_slug')}
                >
                  <div className="flex items-center gap-1">
                    Slug {getSortIcon('Cate_slug')}
                  </div>
                </th>
                <th
                  className="p-3 border-b cursor-pointer"
                  onClick={() => handleSort('Cate_type')}
                >
                  <div className="flex items-center gap-1">
                    Loại {getSortIcon('Cate_type')}
                  </div>
                </th>

                <th
                  className="p-3 border-b cursor-pointer"
                  onClick={() => handleSort('foodCount')}
                >
                  <div className="flex items-center gap-1">
                    Số món ăn {getSortIcon('foodCount')}
                  </div>
                </th>
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
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() =>
                        confirmDelete(cate._id, cate.Cate_name, cate.foodCount)
                      }
                    >
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
            limit={0}
            onLimitChange={function (newLimit: number): void {
              throw new Error('Function not implemented.');
            }}
          />
          <ToastConfigAdmin />
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
