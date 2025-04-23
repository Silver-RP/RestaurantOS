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

  return (
    <nav className="flex items-center space-x-2">
      <button
        className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        aria-label="Previous page"
      >
        PREV
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          className={`px-4 py-2 rounded-md ${
            page === currentPage
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        aria-label="Next page"
      >
        NEXT
      </button>
    </nav>
  );
};

export default Pagination;
