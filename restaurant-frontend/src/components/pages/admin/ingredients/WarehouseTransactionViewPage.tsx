import React from 'react';
import { useWarehouseTransactionView } from '../../../../hooks/useWarehouse';
import {
  FaArrowDown,
  FaArrowUp,
  FaSearch,
  FaSort,
  FaFileDownload,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaFilter,
} from 'react-icons/fa';
import AdvancedTransactionFilterPanel from './AdvancedTransactionFilterPanel';
import AdminPagination from '../AdminPagination';

const WarehouseTransactionViewPage: React.FC = () => {
  const {
    transactions,
    loading,
    error,
    searchParams,
    setSearchParams,
    showExportMenu,
    setShowExportMenu,
    exportMenuRef,
    sortField,
    showFilterPanel,
    setShowFilterPanel,
    search,
    setSearch,
    transactionList,
    handleSort,
    handleEnter,
    handleClick,
    getSortIcon,
    transactionTypeLabels,
    handleDownloadInventoryExcel,
    handleDownloadInventoryCsv,
    handleDownloadInventoryPdf,
  } = useWarehouseTransactionView();
  
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
              placeholder="Tìm giao dịch..."
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
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
          >
            <FaFilter className="mr-2" />
            {showFilterPanel ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </button>

          <div className="relative" ref={exportMenuRef}>
            <button
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <FaFileDownload className="mr-2" />
              Xuất file
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
                <button
                  onClick={handleDownloadInventoryExcel}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                >
                  <FaFileExcel className="mr-2" />
                  Excel
                </button>
                <button
                  onClick={handleDownloadInventoryCsv}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                >
                  <FaFileCsv className="mr-2" />
                  CSV
                </button>
                <button
                  onClick={handleDownloadInventoryPdf}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                >
                  <FaFilePdf className="mr-2" />
                  PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showFilterPanel && (
        <AdvancedTransactionFilterPanel
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
        Hiển thị <strong>{transactionList.length}</strong> trên tổng{' '}
        <strong>{transactions?.totalDocs || 0}</strong> giao dịch
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
                  onClick={() => handleSort('transaction_type')}
                >
                  <span className="flex items-center gap-1">
                    Loại giao dịch {renderSortIcon('transaction_type')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('transaction_date')}
                >
                  <span className="flex items-center gap-1">
                    Ngày giao dịch {renderSortIcon('transaction_date')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('ingredient_name')}
                >
                  <span className="flex items-center gap-1">
                    Tên nguyên liệu {renderSortIcon('ingredient_name')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('units')}
                >
                  <span className="flex items-center gap-1">
                    Đơn vị {renderSortIcon('units')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('quantity')}
                >
                  <span className="flex items-center gap-1">
                    Số lượng {renderSortIcon('quantity')}
                  </span>
                </th>

                <th
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort('user_name')}
                >
                  <span className="flex items-center gap-1">
                    Người thực hiện {renderSortIcon('user_name')}
                  </span>
                </th>

                <th className="px-4 py-2 cursor-pointer whitespace-nowrap">
                  <span className="flex items-center gap-1"> Ghi chú </span>
                </th>

                <th className="px-4 py-2 cursor-pointer whitespace-nowrap">
                  <span className="flex items-center gap-1">
                    {' '}
                    Lý do (điều chỉnh){' '}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {transactionList.map((transaction, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>

                  <td className="px-4 py-2 font-medium">
                    {transactionTypeLabels[transaction.transaction_type] ||
                      'Không xác định'}
                  </td>

                  <td className="px-4 py-2">
                    {new Date(transaction.transaction_date).toLocaleDateString(
                      'vi-VN',
                      {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      },
                    )}
                  </td>
                  <td className="px-4 py-2">{transaction.ingredient.name}</td>
                  <td className="px-4 py-2">{transaction.ingredient.unit}</td>
                  <td className="px-4 py-2">{transaction.quantity}</td>
                  <td className="px-4 py-2">{transaction.user.name}</td>
                  <td className="px-4 py-2">{transaction.notes}</td>
                  <td className="px-4 py-2">{transaction.adjustment_batch?.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions && (
            <AdminPagination
              currentPage={transactions.page}
              totalPages={transactions.totalPages}
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

export default WarehouseTransactionViewPage;
