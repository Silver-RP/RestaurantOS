import { useFoodsTrashLogic } from '../../../../hooks/useFoodsAdminLogic';
import React from 'react';
import AdminPagination from '../AdminPagination';
import { FaSort, FaArrowUp, FaArrowDown, FaSearch } from 'react-icons/fa';
import { FaUndoAlt } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';
import { BiUndo } from 'react-icons/bi';
import ConfirmModal from '@/components/common/ConfirmModal';


const TrashTable: React.FC = () => {
  const {
    foods,
    loading,
    error,
    searchParams,
    setSearchParams,
    sortField,
    search,
    setSearch,
    navigate,
    foodList,
    handleSort,
    handleEnter,
    handleClick,
    getSortIcon,
    foodIdToRestore,
    foodIdToDelete,
    showConfirm,
    setShowConfirm,
    handleRestoreClick,
    handleConfirmRestore,
    handlePermanentDeleteClick,
    handleConfirmPermanentDelete,
  } = useFoodsTrashLogic();
  
  const renderSortIcon = (field: typeof sortField) => {
    const iconType = getSortIcon(field);
    if (iconType === 'asc') return <FaArrowUp />;
    if (iconType === 'desc') return <FaArrowDown />;
    return <FaSort />;
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
            onClick={() => navigate('/admin/foods')}
            className="flex px-4 py-2 gap-2 border bg-gray-100 border-gray-300 text-gray-700 rounded hover:bg-gray-200"
          >
            <BiUndo size={18} />
            <span>Quay về</span>
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
                  onClick={() => handleSort('category')}
                >
                  <span className="flex items-center gap-1">
                    Danh mục {renderSortIcon('category')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('deletedAt')}
                >
                  <span className="flex items-center gap-1">
                    Ngày xoá {renderSortIcon('deletedAt')}
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
                    {item.categories?.[0]?.Cate_name ?? '—'}
                  </td>
                  <td>
                    {item.deletedAt
                      ? new Date(item.deletedAt).toLocaleDateString()
                      : '—'}
                  </td>

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
                      className="relative group text-green-600 hover:underline mr-2"
                      onClick={() => handleRestoreClick(item._id)} 
                    >
                      <FaUndoAlt size={18} />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 normal-case">
                        Khôi phục
                      </span>
                    </button>
                    {showConfirm && foodIdToRestore === item._id && (
                        <ConfirmModal
                          title="Xác nhận khôi phục"
                          description={`Bạn có chắc chắn muốn khôi phục "${item?.name || 'món ăn'}"?`}
                          onConfirm={() => handleConfirmRestore(item._id)}
                          onCancel={() => {
                            setShowConfirm(false); 
                          }}
                        />
                      )}

                    <button
                      className="relative group text-red-600 hover:underline"
                      onClick={() => handlePermanentDeleteClick(item._id)} 
                    >
                      <FaTrashAlt size={18} />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 normal-case">
                        Xoá vĩnh viễn
                      </span>
                    </button>
                    {showConfirm && foodIdToDelete === item._id && (
                        <ConfirmModal
                          title="Xác nhận xoá vĩnh viễn"
                          description={`Bạn có chắc chắn muốn xoá vĩnh viễn "${item?.name || 'món ăn'}"?`}
                          onConfirm={() =>
                            handleConfirmPermanentDelete(item._id)
                          }
                          onCancel={() => setShowConfirm(false)}
                        />
                      )}
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

      {foodList.length === 0 && !loading && (
        <p className="text-center text-gray-500">Không có món nào bị xoá trong thùng rác.</p>
      )}
    </div>
  );
};

export default TrashTable;
