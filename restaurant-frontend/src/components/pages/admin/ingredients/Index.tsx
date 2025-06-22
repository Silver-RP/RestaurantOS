import { useIngredientsAdminLogic } from '../../../../hooks/useIngredientsAdminLogic';
import React, { useState } from 'react';
import { ingredientUnits } from '../../../../types/ingredientUnitsType';
import AdminPagination from '../AdminPagination';
import {
  FaSort,
  FaArrowUp,
  FaArrowDown,
  FaSearch,
  FaEdit,
} from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';
import AdvancedFilterPanel from './AdvancedFilterPanel';
import IngredientStockStatus from './IngredientStockStatus';
import { WarehouseModal } from './WarehouseModal';
import { WarehouseAuditModal } from './WarehouseAuditModal';

const MenuTable: React.FC = () => {
  const {
    ingredients,
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
    ingredientList,
    handleSort,
    handleEnter,
    handleClick,
    getSortIcon,
    formatQuantity,
  } = useIngredientsAdminLogic();

  const renderSortIcon = (field: typeof sortField) => {
    const iconType = getSortIcon(field);
    if (iconType === 'asc') return <FaArrowUp />;
    if (iconType === 'desc') return <FaArrowDown />;
    return <FaSort />;
  };

  const [openModal, setOpenModal] = useState<
    '' | 'import' | 'export' | 'audit' | 'transaction'
  >('');
  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
        <div className="flex gap-4 ">
          <div className="w-96  relative">
            <input
              type="text"
              placeholder="Tìm nguyên liệu..."
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
            onClick={() => navigate('/admin/ingredients/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Thêm nguyên liệu
          </button>
          <button
            onClick={() => navigate('/admin/ingredients/trash')}
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
      <div className="flex items-center justify-end p-4 mb-6 bg-white rounded-2xl shadow-md">
        <div className="flex gap-3">
          <button
            onClick={() => setOpenModal('import')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
          >
            <span className="text-lg">➕</span>
            Nhập kho
          </button>
          <button
            onClick={() => setOpenModal('export')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600 transition-colors"
          >
            <span className="text-lg">➖</span>
            Xuất kho
          </button>
          <button
            onClick={() => setOpenModal('audit')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors"
          >
            <span className="text-lg">📋</span>
            Kiểm kê kho
          </button>
          <button
            onClick={() => navigate('/admin/warehouse/transaction-view')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700 transition-colors"
          >
            <span className="text-lg">🕒</span>
            Xem lịch sử
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-700 mb-2">
        Hiển thị <strong>{ingredientList.length}</strong> trên tổng{' '}
        <strong>{ingredients?.totalDocs || 0}</strong> món
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
                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('name')}
                >
                  <span className="flex items-center gap-1">
                    Tên nguyên liệu {renderSortIcon('name')}
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('group')}
                >
                  <span className="flex items-center gap-1">
                    Nhóm nguyên liệu {renderSortIcon('group')}
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort('currentStock')}
                >
                  <span className="flex items-center gap-1">
                    Tồn kho hiện tại {renderSortIcon('currentStock')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('unit')}
                >
                  <span className="flex items-center gap-1">
                    Đơn vị {renderSortIcon('unit')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('price')}
                >
                  <span className="flex items-center gap-1">
                    Giá trên đơn vị (đ) {renderSortIcon('price')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('stockStatus')}
                >
                  <span className="flex items-center gap-1">
                    trạng thái {renderSortIcon('stockStatus')}
                  </span>
                </th>

                <th className="px-4 py-2 ">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {ingredientList.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-medium">{item.name}</td>
                  <td className="px-4 py-2 font-medium">
                    {item.group || 'Chưa phân loại'}
                    {item.group && (
                      <span className="text-xs text-gray-500 block">
                        {item.subGroup.toLowerCase()}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 font-medium">
                    {formatQuantity(item.currentStock, item.unit)}
                  </td>
                  <td className="px-4 py-2">
                    {ingredientUnits.find((cat) => cat.value === item.unit)
                      ?.label || item.unit}
                  </td>

                  <td className="px-4 py-2  text-center">
                    {item.price_per_unit.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <IngredientStockStatus item={item} />
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="relative group text-blue-500 hover:underline"
                      onClick={() =>
                        navigate(`/admin/ingredients/edit/${item.slug}`)
                      }
                    >
                      <FaEdit size={18} />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 normal-case">
                        Chỉnh sửa
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {ingredients && (
            <AdminPagination
              currentPage={ingredients.page}
              totalPages={ingredients.totalPages}
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

      {(openModal === 'import' || openModal === 'export') && (
        <WarehouseModal
          open={true}
          type={openModal}
          onClose={() => setOpenModal('')}
        />
      )}

      {openModal === 'audit' && (
        <WarehouseAuditModal
          open={true}
          type="audit"
          onClose={() => setOpenModal('')}
        />
      )}
    </div>
  );
};

export default MenuTable;
