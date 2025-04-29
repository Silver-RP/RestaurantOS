import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const maxVisible = 10;
    const start = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
    const end = Math.min(start + maxVisible - 1, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <nav className="flex items-center justify-center flex-wrap gap-4">
      {/* Nút Previous */}
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
          className="text-white hover:text-secondaryColor transition"
        >
          <FaChevronLeft />
        </button>
      )}

      {/* Các trang */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 flex items-center justify-center text-sm font-semibold transition ${
            page === currentPage
              ? "border-2 border-[#FFDEA0] rounded-full text-white"
              : "text-white hover:text-secondaryColor"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Nút Next */}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
          className="text-white hover:text-secondaryColor transition"
        >
          <FaChevronRight />
        </button>
      )}
    </nav>
  );
};

export default Pagination;