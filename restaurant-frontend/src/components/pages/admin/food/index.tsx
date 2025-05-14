/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useFoods } from '../../../../hooks/useFoods';
import { useCategories } from '../../../../hooks/useCategories';
import React, { useState, useEffect, useMemo } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import AdminPagination from '../AdminPagination';
import { useNavigate } from 'react-router-dom';
import { FaSort, FaArrowUp, FaArrowDown } from 'react-icons/fa';

type SortField =
  | 'name'
  | 'price'
  | 'discount_price'
  | 'countInStock'
  | 'views'
  | 'category'
  | 'ordered_count'
  | 'average_rating'
  | 'status'
  | null;
type SortDirection = 'asc' | 'desc';

const MenuTable: React.FC = () => {
  const { foods, loading, error, searchParams, setSearchParams } = useFoods();
  const navigate = useNavigate();
  const {
    categories,
    loading: loadingCategories,
    error: categoryError,
  } = useCategories();
  const [search, setSearch] = useState(searchParams.get('keyword') || '');
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get('category') || '',
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('keyword', search);

    if (categoryFilter) newParams.set('category', categoryFilter);
    else newParams.delete('category');

    if (sortOrder) newParams.set('sort', sortOrder);
    else newParams.delete('sort');

    newParams.set('page', '1');
    setSearchParams(newParams);
  }, [search, categoryFilter, sortOrder]);

  const foodList = foods?.docs || [];
  
  const sortMapping: Record<string, { asc: string, desc: string }> = {
    name: { asc: 'nameAZ', desc: 'nameZA' },
    price: { asc: 'priceLow', desc: 'priceHigh' },
    discount_price: { asc: 'discountLow', desc: 'discountHigh' },
    countInStock: { asc: 'stockHigh', desc: 'stockLow' },
    views: { asc: 'leastViews', desc: 'mostViewed' },
    ordered_count: { asc: 'leastOrdered', desc: 'mostOrdered' },
    average_rating: { asc: 'lowestRated', desc: 'highestRated' },
    category: { asc: 'categoryAZ', desc: 'categoryZA' },
    status: { asc: 'statusAZ', desc: 'statusZA' },
  };
  
  const handleSort = (field: string) => {
    const direction = sortField === field 
      ? sortDirection === 'asc' ? 'desc' : 'asc'
      : 'asc';
  
    setSortField(field as SortField);
    setSortDirection(direction);
  
    const sortValue = sortMapping[field]?.[direction] || 'default';
  
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('sort', sortValue);
      newParams.set('page', '1');
      return newParams;
    });
  };
  

  const getSortIcon = (field: SortField) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? <FaArrowUp /> : <FaArrowDown />;
    }
    return <FaSort />;
  };

  const uniqueCategories = useMemo(() => {
    if (!categories?.data) return [{ label: 'Tất cả', value: '' }];
    return [
      { label: 'Tất cả', value: '' },
      ...categories.data.map((c) => ({
        label: c.Cate_name,
        value: c.Cate_slug,
      })),
    ];
  }, [categories]);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
        <div className="flex gap-4 ">
          <div className="w-96">
            <input
              type="text"
              placeholder="Tìm món..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-md w-full"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center px-4 py-2 border rounded-md shadow-sm bg-white gap-2"
            >
              {uniqueCategories.find((c) => c.value === categoryFilter)
                ?.label || 'Tất cả'}
              <FaChevronDown className="text-sm" />
            </button>

            {showCategoryDropdown && (
              <div className="absolute mt-2 bg-white border rounded-md shadow-md z-10 w-56 max-h-[90vh] overflow-y-auto">
                {loadingCategories ? (
                  <p className="p-4 text-sm">Đang tải danh mục...</p>
                ) : categoryError ? (
                  <p className="p-4 text-sm text-red-500">{categoryError}</p>
                ) : (
                  uniqueCategories.map((cat) => (
                    <div
                      key={cat.value}
                      onClick={() => {
                        setCategoryFilter(cat.value);
                        setShowCategoryDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {cat.label}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center px-4 py-2 border rounded-md shadow-sm bg-white gap-2"
            >
              {sortOrder === 'asc'
                ? 'Giá tăng dần'
                : sortOrder === 'desc'
                  ? 'Giá giảm dần'
                  : 'Sắp xếp theo giá'}
              <FaChevronDown className="text-sm" />
            </button>
            {showSortDropdown && (
              <div className="absolute mt-2 bg-white border rounded-md shadow-md z-10 w-48">
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSortOrder('asc');
                    setShowSortDropdown(false);
                  }}
                >
                  Giá tăng dần
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSortOrder('desc');
                    setShowSortDropdown(false);
                  }}
                >
                  Giá giảm dần
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate('/admin/foods/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Thêm món
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-700">
        Hiển thị <strong>{foodList.length}</strong> trên tổng{' '}
        <strong>{foods?.totalDocs || 0}</strong> món
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1000px] w-full bg-white text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className='px-4 py-2'>No.</th>
                <th className="px-4 py-2">Hình</th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('name')}
                >
                  <span className="flex items-center gap-1">
                    Tên món {getSortIcon('name')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('price')}
                >
                  <span className="flex items-center gap-1">
                    Giá (đ) {getSortIcon('price')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('discount_price')}
                >
                  <span className="flex items-center gap-1">
                    Giá KM {getSortIcon('discount_price')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('countInStock')}
                >
                  <span className="flex items-center gap-1">
                    Kho {getSortIcon('countInStock')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('category')}
                >
                  <span className="flex items-center gap-1">
                    Danh mục {getSortIcon('category')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('views')}
                >
                  <span className="flex items-center gap-1">
                    Lượt xem {getSortIcon('views')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('ordered_count')}
                >
                  <span className="flex items-center gap-1">
                    Số đặt {getSortIcon('ordered_count')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('average_rating')}
                >
                  <span className="flex items-center gap-1">
                    Rating {getSortIcon('average_rating')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('status')}
                >
                  <span className="flex items-center gap-1">
                    Status {getSortIcon('status')}
                  </span>
                </th>

                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {foodList.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2 font-medium">{item.name}</td>
                  <td className="px-4 py-2">{item.price.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {item.discount_price != null
                      ? item.discount_price.toLocaleString()
                      : '—'}
                  </td>
                  <td className="px-4 py-2">{item.countInStock}</td>
                  <td className="px-4 py-2">
                    {item.categories?.[0]?.Cate_name ?? '—'}
                  </td>
                  <td className="px-4 py-2">{item.views}</td>
                  <td className="px-4 py-2">{item.ordered_count}</td>
                  <td className="px-4 py-2">{item.average_rating}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'soldout'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => navigate(`/admin/foods/edit/${item.slug}`)}
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {foods && (
           <AdminPagination
           currentPage={foods.page}
           totalPages={foods.totalPages}
           onPageChange={(page) => {
             const newParams = new URLSearchParams(searchParams.toString());
             newParams.set('page', String(page));
             setSearchParams(newParams); 
           }}
           limit={Number(searchParams.get('limit') || 10)}
            onLimitChange={(newLimit) => {
              setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                newParams.set('limit', newLimit.toString());
                newParams.delete('page'); 
                return newParams;
              });
            }}
         />
          )}
        </div>
      )}
    </div>
  );
};

export default MenuTable;
