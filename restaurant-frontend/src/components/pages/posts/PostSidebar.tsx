import React, { useState, useEffect } from 'react';
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

  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
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
      <div>
        <h3 className="text-xl font-semibold mb-2">Tìm kiếm blog</h3>
        <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
          <input
            type="text"
            placeholder="Tìm Kiếm..."
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="w-full sm:w-[140px] md:w-[155px] px-2 py-1 text-sm bg-transparent border border-hr text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            className="px-2 h-[30px] py-1 text-[13px] bg-secondaryColor text-black rounded-[3px] hover:bg-secondaryColor"
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
