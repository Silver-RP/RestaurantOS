import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useTableManagement } from '@/hooks/useTables';
import { ITable } from '@/types/Table.type';
import {
  FaSearch,
  FaCheck,
  FaTimes,
  FaSort,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';

const TableManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('code');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const { tables, loading, error, fetchTables, toggleAvailability } =
    useTableManagement();
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    code: string | null;
    allowBooking: boolean | null;
  }>({ open: false, code: null, allowBooking: null });

  useEffect(() => {
    fetchTables({ search, sortBy, sortOrder, page });
  }, [search, sortBy, sortOrder, page, fetchTables]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return <FaSort />;
    return sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />;
  };

  const handleRequestToggleAvailability = (
    code: string,
    allowBooking: boolean,
  ) => {
    setConfirmModal({ open: true, code, allowBooking });
  };

  const handleConfirmToggle = () => {
    if (confirmModal.code) {
      toggleAvailability(confirmModal.code);
    }
    setConfirmModal({ open: false, code: null, allowBooking: null });
  };

  const handleCancelToggle = () => {
    setConfirmModal({ open: false, code: null, allowBooking: null });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-admintext mb-4">Quản lý bàn</h1>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <div className="w-96 relative">
            <input
              type="text"
              placeholder="Tìm bàn..."
              value={search}
              onChange={handleSearchChange}
              className="px-4 py-2 border rounded-md w-full"
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              aria-label="Search"
              type="button"
            >
              <FaSearch size={18} />
            </button>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          {/* <button
            onClick={handleToggleFilter}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
          >
            {showFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Thêm bàn
          </button>
          <button
            onClick={handleViewTrash}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <FiTrash2 />
            <span>Đã xoá</span>
          </button> */}
        </div>
      </div>

      <div className="text-sm text-gray-700">
        Hiển thị <strong>{tables.length}</strong> bàn
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500">Lỗi tải dữ liệu: {error}</p>}
      {!loading && !error && (
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1000px] w-full bg-white text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">No.</th>
                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('code')}
                >
                  <span className="flex items-center gap-1">
                    Mã bàn {getSortIcon('code')}
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('type')}
                >
                  <span className="flex items-center gap-1">
                    Loại bàn {getSortIcon('type')}
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('capacity')}
                >
                  <span className="flex items-center gap-1">
                    Sức chứa {getSortIcon('capacity')}
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('floor')}
                >
                  <span className="flex items-center gap-1">
                    Tầng {getSortIcon('floor')}
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('zone')}
                >
                  <span className="flex items-center gap-1">
                    Khu vực {getSortIcon('zone')}
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('allowBooking')}
                >
                  <span className="flex items-center gap-1">
                    Cho phép đặt {getSortIcon('allowBooking')}
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('isBooked')}
                >
                  <span className="flex items-center gap-1">
                    Đang có khách đặt {getSortIcon('isBooked')}
                  </span>
                </th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((table: ITable, index: number) => (
                <tr
                  key={table._id || table.code}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-medium">{table.code}</td>
                  <td className="px-4 py-2">{table.type}</td>
                  <td className="px-4 py-2">{table.capacity}</td>
                  <td className="px-4 py-2">{table.floor}</td>
                  <td className="px-4 py-2">{table.zone}</td>
                  <td className="px-4 py-2">
                    {table.allowBooking ? (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center gap-1">
                        <FaCheck size={12} />
                        Cho phép đặt
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-800 flex items-center gap-1">
                        <FaTimes size={12} />
                        Không cho đặt
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {table.isBooked ? (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 flex items-center gap-1">
                        <FaCheck size={12} />
                        Đang có khách đặt
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 flex items-center gap-1">
                        <FaTimes size={12} />
                        Trống
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {/* <button
                      onClick={() => handleEdit(table.code)}
                      className="relative group text-blue-500 hover:underline"
                    >
                      <FaEdit size={18} />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 normal-case">
                        Chỉnh sửa
                      </span>
                    </button> */}
                    <button
                      onClick={() =>
                        handleRequestToggleAvailability(
                          table.code,
                          table.allowBooking,
                        )
                      }
                      className={`relative group px-3 py-1 rounded text-xs font-semibold focus:outline-none transition-colors
                        ${table.allowBooking ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-400 text-white hover:bg-gray-500'}`}
                    >
                      {table.allowBooking ? (
                        <>
                          <FaTimes className="inline mr-1" /> Không cho đặt
                        </>
                      ) : (
                        <>
                          <FaCheck className="inline mr-1" /> Cho phép đặt
                        </>
                      )}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 normal-case">
                        {table.allowBooking
                          ? 'Chuyển sang không cho đặt'
                          : 'Chuyển sang cho phép đặt'}
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Xác nhận thay đổi trạng thái cho phép đặt bàn
            </h2>
            <p className="mb-6 text-gray-700">
              {confirmModal.allowBooking
                ? 'Bạn có chắc chắn muốn chuyển bàn này sang trạng thái KHÔNG cho phép đặt?'
                : 'Bạn có chắc chắn muốn chuyển bàn này sang trạng thái CHO PHÉP ĐẶT?'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelToggle}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Huỷ
              </button>
              <button
                onClick={handleConfirmToggle}
                className={`px-4 py-2 rounded text-white ${confirmModal.allowBooking ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManagement;
