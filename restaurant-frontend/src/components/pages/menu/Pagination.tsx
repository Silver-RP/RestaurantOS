import React from 'react';

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded hover:bg-secondaryColor hover:text-black disabled:opacity-50"
      >
        Trước
      </button>

      <span className="text-sm">{currentPage}</span>

      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        className="px-3 py-1 border rounded hover:bg-secondaryColor hover:text-black"
      >
        Tiếp
      </button>
    </div>
  );
};

export default Pagination;