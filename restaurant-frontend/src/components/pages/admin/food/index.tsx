import { useFoodsAdminLogic } from '../../../../hooks/useFoodsAdminLogic';
import React from 'react';
import AdminPagination from '../AdminPagination';
import {
  FaSort,
  FaArrowUp,
  FaArrowDown,
  FaSearch,
  FaEdit,
} from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import AdvancedFilterPanel from './AdvancedFilterPanel';
import FoodIngredientsModal from './FoodIngredientsModal';

const MenuTable: React.FC = () => {
  const {
    foods,
    loading,
    error,
    searchParams,
    setSearchParams,
    sortField,
    showFilterPanel,
    setShowFilterPanel,
    search,
    setSearch,
    navigate,
    foodList,
    handleSort,
    handleEnter,
    handleClick,
    getSortIcon,
  } = useFoodsAdminLogic();

  const renderSortIcon = (field: typeof sortField) => {
    const iconType = getSortIcon(field);
    if (iconType === 'asc') return <FaArrowUp />;
    if (iconType === 'desc') return <FaArrowDown />;
    return <FaSort />;
  };

  const [selectedDishId, setSelectedDishId] = React.useState<string | null>(null);

  const handleCloseFoodIngredientsModal = () => {
    setSelectedDishId(null);
  };
  
  const handleViewDishIngredient = (dishId: string) => {
    if (selectedDishId !== dishId) {
      setSelectedDishId(dishId);
    }
  };


  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
        <div className="flex gap-4 ">
          <div className="w-96  relative">
            <input
              type="text"
              placeholder="Tìm món..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleEnter}
              className="px-4 py-2 border rounded-md w-full"
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
          <button
            onClick={() => navigate('/admin/foods/trash')}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <FiTrash2 />
            <span>Đã xoá</span>
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
                <th className="px-4 py-2">No.</th>
                <th className="px-4 py-2">Hình</th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('name')}
                >
                  <span className="flex items-center gap-1">
                    Tên món {renderSortIcon('name')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('price')}
                >
                  <span className="flex items-center gap-1">
                    Giá (đ) {renderSortIcon('price')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('discount_price')}
                >
                  <span className="flex items-center gap-1">
                    Giá KM {renderSortIcon('discount_price')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('countInStock')}
                >
                  <span className="flex items-center gap-1">
                    Kho {renderSortIcon('countInStock')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('category')}
                >
                  <span className="flex items-center gap-1">
                    Danh mục {renderSortIcon('category')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('views')}
                >
                  <span className="flex items-center gap-1">
                    Lượt xem {renderSortIcon('views')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('ordered_count')}
                >
                  <span className="flex items-center gap-1">
                    Số đặt {renderSortIcon('ordered_count')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('average_rating')}
                >
                  <span className="flex items-center gap-1">
                    Rating {renderSortIcon('average_rating')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('status')}
                >
                  <span className="flex items-center gap-1">
                    Trạng thái {renderSortIcon('status')}
                  </span>
                </th>

                <th className="px-4 py-2 ">Hành động</th>
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
                      {item.status === 'available'
                        ? 'còn hàng'
                        : item.status === 'soldout'
                          ? 'hết hàng'
                          : 'đã ẩn'}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="relative group text-blue-500 hover:underline"
                      onClick={() => navigate(`/admin/foods/edit/${item.slug}`)}
                    >
                      <FaEdit size={18} />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 normal-case">
                        Chỉnh sửa
                      </span>
                    </button>
                    <button
                      className="relative group text-blue-500 hover:underline"
                      onClick={()=> handleViewDishIngredient(item._id)}
                    >
                      <GiWheat size={18} />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 normal-case">
                        Nguyên liệu
                      </span>
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

      {selectedDishId && (
        <FoodIngredientsModal
          dishId={selectedDishId}
          open={true}
          onClose={handleCloseFoodIngredientsModal}
        />
      )}
    </div>
  );
};

export default MenuTable;
