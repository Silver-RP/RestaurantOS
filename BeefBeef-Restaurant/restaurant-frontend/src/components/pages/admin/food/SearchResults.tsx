/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useFoodsSearch } from '../../../../hooks/useSearch';
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import AdminPagination from '../AdminPagination';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdvancedFilterPanel from './AdvancedFilterPanel';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = Number(searchParams.get('limit') || 12);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const { foods, loading, error } = useFoodsSearch(query, page, limit);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setSearch(query); 
  }, [query]);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('handleEnter', search);
    if (e.key === 'Enter' && search.trim()) {
      setSearchParams({ query: search.trim(), page: '1' });
    }
  };

  const handleClick = () => {
    if (search.trim()) {
      setSearchParams({
        query: search.trim(),
        page: '1',
        limit: String(limit),
      });
    }
  };

  const foodList = foods?.docs || [];

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
        <div className="w-96  relative">
          <input
            type="text"
            placeholder="Tìm món theo tên, mô tả, nguyên liệu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleEnter}
            className="px-4 py-2 border rounded-md w-full pr-10"
          />
          <button
            onClick={handleClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
            aria-label="Search"
            type="button"
          >
            <FaSearch size={18} />
          </button>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
          >
            {showFilterPanel ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </button>
          <button
            onClick={() => navigate('/admin/foods/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Thêm món
          </button>
        </div>
      </div>
      {showFilterPanel && (
        <AdvancedFilterPanel
        key={searchParams.toString()}
        initialFilters={Object.fromEntries((searchParams as any).entries())}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        onApply={(filters) => {
          const newParams = new URLSearchParams(searchParams.toString());
      
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== '') {
              newParams.set(key, String(value));
            } else {
              newParams.delete(key);
            }
          });
      
          newParams.set('page', '1');
          setSearchParams(newParams); 
          setShowFilterPanel(false);  
        }}
      />
      
      )}

      <div className="text-sm text-gray-700">
        Hiển thị{' '}
        <strong>{Array.isArray(foodList) ? foodList.length : 0}</strong> trên
        tổng <strong>{foods?.totalDocs}</strong> món
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
                <th className="px-4 py-2">No.</th>
                <th className="px-4 py-2">Hình</th>

                <th className="px-4 py-2 cursor-pointer whitespace-nowrap">
                  <span className="flex items-center gap-1">Tên món</span>
                </th>

                <th className="px-4 py-2 cursor-pointer whitespace-nowrap">
                  <span className="flex items-center gap-1">Giá (đ)</span>
                </th>

                <th className="px-4 py-2 cursor-pointer whitespace-nowrap">
                  <span className="flex items-center gap-1">Giá KM</span>
                </th>

                <th className="px-4 py-2 cursor-pointer whitespace-nowrap">
                  <span className="flex items-center gap-1">Kho</span>
                </th>

                <th className="px-4 py-2 cursor-pointer whitespace-nowrap">
                  <span className="flex items-center gap-1">Danh mục</span>
                </th>

                <th className="px-4 py-2 cursor-pointer whitespace-nowrap">
                  <span className="flex items-center gap-1">Lượt xem</span>
                </th>

                <th className="px-4 py-2 cursor-pointer whitespace-nowrap">
                  <span className="flex items-center gap-1">Số đặt</span>
                </th>

                <th className="px-4 py-2 cursor-pointer whitespace-nowrap">
                  <span className="flex items-center gap-1">Rating</span>
                </th>

                <th className="px-4 py-2 cursor-pointer whitespace-nowrap">
                  <span className="flex items-center gap-1">Status</span>
                </th>

                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(foodList) && foodList.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-4">
                    Không có món ăn nào phù hợp.
                  </td>
                </tr>
              ) : (
                foodList.map((item, index) => (
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
                        onClick={() =>
                          navigate(`/admin/foods/edit/${item.slug}`)
                        }
                      >
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
              limit={Number(searchParams.get('limit') || 12)}
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

export default SearchPage;
