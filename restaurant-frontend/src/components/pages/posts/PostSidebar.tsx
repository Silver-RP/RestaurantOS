import React, { useState, useEffect, useRef } from 'react';
import { fetchSidebarData } from '../../../api/sidebarApi';
import { useNavigate } from 'react-router-dom';

interface PostSidebarProps {
  className?: string;
  onSearch?: (value: string) => void;
}

const PostSidebar: React.FC<PostSidebarProps> = ({ className, onSearch }) => {
  const [showPosts, setShowPosts] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [posts, setPosts] = useState<{id:number, name:string}[]>([]);
  const [categories, setCategories] = useState<{id:number, name:string}[]>([]);
  useEffect(() => {
    fetchSidebarData()
      .then(data => {
        setPosts(data.posts || []);
        setCategories(data.categories || []);
      })
      .catch(err => {
        console.error('Lỗi lấy sidebar:', err);
      });
  }, []);
  const navigate = useNavigate();

  // Hàm chuyển hướng khi click vào thể loại
  const handleCategoryClick = (tag: string) => {
    if (tag.toLowerCase() === 'voucher') {
      navigate('/voucher');
    } else {
      navigate(`/posts/tag/${encodeURIComponent(tag)}`);
    }
  };

  const [searchValue, setSearchValue] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (typeof onSearch === 'function') onSearch(e.target.value);
    }, 500);
  };

  const handleSearch = () => {
    if (typeof onSearch === 'function') onSearch(searchValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <aside className={`w-full space-y-6 text-white lg:space-y-10 ${className}`}>
      {/* Tìm kiếm */}
      <div className="bg-headerBackground p-4 rounded-lg shadow-sm space-y-3 transition-shadow hover:shadow-md">
        <h3 className="text-lg font-semibold mb-1 tracking-tight">
          Tìm kiếm blog
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="w-full px-3 pl-10 py-2 text-sm bg-transparent border border-hr text-white placeholder-slate-500 rounded-md focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-secondaryColor hover:text-white"
            aria-label="Tìm kiếm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M16.65 10.5a6.15 6.15 0 11-12.3 0 6.15 6.15 0 0112.3 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Bài viết */}
      <div className="bg-headerBackground p-4 rounded-lg shadow-sm space-y-3 transition-shadow hover:shadow-md">
        <div
          className="flex justify-between items-center cursor-pointer select-none"
          onClick={() => setShowPosts(!showPosts)}
        >
          <h3 className="text-lg font-semibold mb-1 tracking-tight">
            Bài viết
          </h3>
          <span className="text-xl lg:hidden transition-transform">
            {showPosts ? (
              <svg
                width="20"
                height="20"
                fill="none"
                className="inline-block"
                viewBox="0 0 20 20"
              >
                <path
                  d="M5 10h10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                fill="none"
                className="inline-block"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 5v10M5 10h10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </span>
        </div>
        <ul className={`space-y-2 text-sm ${showPosts ? 'block' : 'hidden'} lg:block`}>
          {posts.filter(post => post.name.toLowerCase() !== 'voucher').map(post => (
            <li
              key={post.id}
              className="hover:text-secondaryColor transition cursor-pointer"
              onClick={() => handleCategoryClick(post.name)}
            >
              {post.name}
            </li>
          ))}
        </ul>
      </div>
      {/* Thể loại blog */}
      <div className="bg-headerBackground p-4 rounded-lg shadow-sm space-y-3 transition-shadow hover:shadow-md">
        <div
          className="flex justify-between items-center cursor-pointer select-none"
          onClick={() => setShowCategories(!showCategories)}
        >
          <h3 className="text-lg font-semibold mb-1 tracking-tight">
            Thể loại blog
          </h3>
          <span className="text-xl lg:hidden transition-transform">
            {showCategories ? (
              <svg
                width="20"
                height="20"
                fill="none"
                className="inline-block"
                viewBox="0 0 20 20"
              >
                <path
                  d="M5 10h10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                fill="none"
                className="inline-block"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 5v10M5 10h10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </span>
        </div>
        <ul className={`${showCategories ? 'block' : 'hidden'} lg:block space-y-2`}>
          {categories.map(category => (
            <li
              key={category.id}
              className="hover:text-secondaryColor transition cursor-pointer"
              onClick={() => handleCategoryClick(category.name)}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default PostSidebar;
