import React from 'react';
import { FiChevronDown } from 'react-icons/fi';


interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (newLimit: number) => void;
  showLimit?: boolean;
}

const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
  showLimit = true,
}) => {
  const renderPageNumbers = () => {
    const delta = 2;
    const pages: number[] = [];

    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      pages.push(i);
    }

    return pages.map((page) => (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`px-3 py-1 border rounded ${page === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
      >
        {page}
      </button>
    ));
  };

  return (
    <div className="flex justify-between items-center mt-6 flex-wrap gap-2">
      {showLimit !== false && (
        <div className="flex items-center mb-4 md:mb-0 relative">
          <span className="text-bodyBackground mr-2">Hiển thị</span>
          <div className="relative">
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="appearance-none bg-bodyBackground text-white rounded px-2 py-1 text-sm md:text-base border border-gray-600 pr-8"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={36}>36</option>
              <option value={48}>48</option>
              <option value={100}>100</option>
            </select>
            <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
          </div>
          <span className="text-white ml-2">món ăn mỗi trang</span>
        </div>
      )}
      <div className="text-sm text-gray-600">
        Trang <strong>{currentPage}</strong> / {totalPages}
      </div>
      <div className="flex space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ← Trước
        </button>

        {renderPageNumbers()}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Sau →
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;