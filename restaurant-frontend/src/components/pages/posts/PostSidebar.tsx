import React, { useState, useEffect, useRef } from 'react';
import { useCategoriesNew } from '@/hooks/useCategories';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getAllTags } from '@/api/PostsApi';

interface PostSidebarProps {
  className?: string;
  onSearch?: (value: string) => void;
}

const PostSidebar: React.FC<PostSidebarProps> = ({ className, onSearch }) => {
  const [showTags, setShowTags] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const { categories } = useCategoriesNew();

  useEffect(() => {
    getAllTags()
      .then((data) => setTags(data))
      .catch((err) => console.error('Lỗi lấy tags:', err));
  }, []);
  const navigate = useNavigate();
  const { search: locationSearch } = useLocation();
  const currentCategoryId = new URLSearchParams(locationSearch).get('categoryId') || '';
  const { tag: paramTag } = useParams<{ tag?: string }>();
  const activeTag = paramTag ? decodeURIComponent(paramTag) : '';

  // Hàm chuyển hướng khi click vào thẻ(tag)
  const handleTagClick = (tag: string) => {
    navigate(`/posts/tag/${encodeURIComponent(tag)}`);
  };

  // Hàm chuyển hướng khi click vào danh mục
  const handleCategoryClick = (categoryId?: string) => {
    const url = new URL(window.location.href);
    if (categoryId) {
      url.searchParams.set('categoryId', categoryId);
    } else {
      url.searchParams.delete('categoryId');
    }
    url.searchParams.delete('page');
    navigate(`/posts?${url.searchParams.toString()}`);
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


      {/* Danh mục (categories) */}
      <div className="bg-headerBackground p-4 rounded-lg shadow-sm space-y-3 transition-shadow hover:shadow-md">
        <div
          className="flex justify-between items-center cursor-pointer select-none"
          onClick={() => setShowCategories(!showCategories)}
        >
          <h3 className="text-lg font-semibold mb-1 tracking-tight">Danh mục</h3>
          <span className="text-xl lg:hidden transition-transform">
            {showCategories ? (
              <svg width="20" height="20" fill="none" className="inline-block" viewBox="0 0 20 20">
                <path d="M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" fill="none" className="inline-block" viewBox="0 0 20 20">
                <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </span>
        </div>
        <ul className={`${showCategories ? 'block' : 'hidden'} lg:block space-y-2`}>
          <li
            key="all"
            className={`transition cursor-pointer ${!activeTag && !currentCategoryId ? 'text-secondaryColor' : 'hover:text-secondaryColor'}`}
            onClick={() => handleCategoryClick(undefined)}
          >
            Tất cả
          </li>
          {categories?.data?.map((cat) => (
            <li
              key={cat._id}
              className={`transition cursor-pointer ${!activeTag && currentCategoryId === cat._id ? 'text-secondaryColor' : 'hover:text-secondaryColor'}`}
              onClick={() => handleCategoryClick(cat._id)}
            >
              {cat.Cate_name}
            </li>
          ))}
        </ul>
      </div>

      {/* Thẻ bài viết (tags) */}
      <div className="bg-headerBackground p-4 rounded-lg shadow-sm space-y-3 transition-shadow hover:shadow-md">
        <div
          className="flex justify-between items-center cursor-pointer select-none"
          onClick={() => setShowTags(!showTags)}
        >
          <h3 className="text-lg font-semibold mb-1 tracking-tight">
            Thẻ bài viết
          </h3>
          <span className="text-xl lg:hidden transition-transform">
            {showTags ? (
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
        <ul className={`${showTags ? 'block' : 'hidden'} lg:block space-y-2`}>
          {tags.filter((t) => t.toLowerCase() !== 'voucher').map((tag) => (
            <li
              key={tag}
              className={`transition cursor-pointer ${activeTag && activeTag.toLowerCase() === tag.toLowerCase() ? 'text-secondaryColor' : 'hover:text-secondaryColor'}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>


    </aside>
  );
};

export default PostSidebar;
