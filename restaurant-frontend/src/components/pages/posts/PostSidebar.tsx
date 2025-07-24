import React, { useState } from 'react';

interface PostSidebarProps {
  className?: string;
  onSearch?: (value: string) => void;
}

const PostSidebar: React.FC<PostSidebarProps> = ({ className, onSearch }) => {
  const [showPosts, setShowPosts] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    if (onSearch) onSearch(searchValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <aside className={`w-full space-y-6 text-white lg:space-y-10 ${className}`}>
      {/* Tìm kiếm */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Tìm kiếm blog</h3>
        <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
          <input
            type="text"
            placeholder="Tìm Kiếm..."
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="w-full sm:w-[140px] md:w-[180px] px-2 py-1 text-sm bg-transparent border border-hr text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            className="px-3 py-1 text-sm bg-secondaryColor text-white rounded hover:bg-secondaryColor/80"
            onClick={handleSearch}
          >
            Tìm kiếm
          </button>
        </div>
      </div>
      <hr className="border border-hr" />

      {/* Bài viết */}
      <div>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowPosts(!showPosts)}
        >
          <h3 className="text-xl font-semibold mb-2">Bài viết</h3>
          <span className="text-2xl lg:hidden">{showPosts ? '-' : '+'}</span>
        </div>
        <ul className={`space-y-2 text-sm ${showPosts ? 'block' : 'hidden'} lg:block`}>
          <li className="hover:text-secondaryColor transition cursor-pointer">Bài viết hay nhất</li>
          <li className="hover:text-secondaryColor transition cursor-pointer">Bài viết mới nhất</li>
          <li className="hover:text-secondaryColor transition cursor-pointer">Bài viết yêu thích</li>
        </ul>
      </div>
      <hr className="border border-hr" />

      {/* Thể loại blog */}
      <div>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowCategories(!showCategories)}
        >
          <h3 className="text-xl font-semibold mb-2">Thể loại blog</h3>
          <span className="text-2xl lg:hidden">{showCategories ? '-' : '+'}</span>
        </div>
        <ul className={`${showCategories ? 'block' : 'hidden'} lg:block space-y-2`}>
          <li className="hover:text-secondaryColor transition cursor-pointer">Món ăn ngon</li>
          <li className="hover:text-secondaryColor transition cursor-pointer">Món ăn dinh dưỡng</li>
          <li className="hover:text-secondaryColor transition cursor-pointer">Món ăn gia đình</li>
        </ul>
      </div>
    </aside>
  );
};

export default PostSidebar;
