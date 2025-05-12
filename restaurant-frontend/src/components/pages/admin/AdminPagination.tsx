import React from 'react';

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
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