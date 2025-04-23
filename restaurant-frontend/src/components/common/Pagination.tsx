import React from "react";

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
    const maxVisible = 5;
    const start = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
    const end = Math.min(start + maxVisible - 1, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const buttonBase =
    "px-4 py-2 rounded-md font-medium transition-all duration-200";
  const defaultStyle =
    "bg-Background border border-secondaryColor text-white hover:bg-secondaryColor hover:text-headerBackground";
  const activeStyle = "bg-secondaryColor text-headerBackground";

  return (
    <nav className="flex items-center justify-center flex-wrap gap-2 mt-10">
      <button
        className={`${buttonBase} ${defaultStyle}`}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        Trước
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          className={`${buttonBase} ${
            page === currentPage ? activeStyle : defaultStyle
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className={`${buttonBase} ${defaultStyle}`}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        Tiếp
      </button>
    </nav>
  );
};

export default Pagination;