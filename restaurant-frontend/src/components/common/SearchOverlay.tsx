import React from "react";

const SearchOverlay = ({ isOpen, toggleSearch }: { isOpen: boolean; toggleSearch: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 md:w-1/3">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondaryColor"
        />
        <button
          className="mt-4 w-full bg-secondaryColor text-black py-2 rounded-lg hover:bg-headerBackground hover:text-secondaryColor"
          onClick={toggleSearch}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default SearchOverlay;