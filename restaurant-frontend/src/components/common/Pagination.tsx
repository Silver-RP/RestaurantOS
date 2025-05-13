import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (newLimit: number) => void;
  showLimit?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
  showLimit = true,
}) => {
  const getPageNumbers = () => {
    const maxVisible = 8;
    const start = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
    const end = Math.min(start + maxVisible - 1, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex justify-between items-center flex-wrap gap-4 md:gap-6">
      {showLimit !== false && (
        <div className="flex items-center mb-4 md:mb-0 relative">
          <span className="text-white mr-2">Hiển thị</span>
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

      <nav className="flex items-center justify-center flex-wrap gap-4">
        {currentPage > 1 && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
            className="text-white hover:text-secondaryColor transition px-3 py-2 rounded-md"
          >
            <FaChevronLeft />
          </button>
        )}

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center text-sm font-semibold transition ${
              page === currentPage
                ? 'border-2 border-[#FFDEA0] rounded-full text-white'
                : 'text-white hover:text-secondaryColor'
            }`}
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
            className="text-white hover:text-secondaryColor transition px-3 py-2 rounded-md"
          >
            <FaChevronRight />
          </button>
        )}
      </nav>

      <div className="text-white text-sm md:text-base">
        <span>
          Trang&nbsp;
          <span className="text-secondaryColor font-semibold">
            {currentPage}
          </span>
          &nbsp;/&nbsp;
          <span className="text-secondaryColor font-semibold">
            {totalPages}
          </span>
        </span>
      </div>
    </div>
  );
};

export default Pagination;
