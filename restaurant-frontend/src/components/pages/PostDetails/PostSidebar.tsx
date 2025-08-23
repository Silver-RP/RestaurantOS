import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PostSidebarProps {
  className?: string;
  onSearch?: (value: string) => void;
}

const PostSidebar: React.FC<PostSidebarProps> = ({ className }) => {
  const [showPosts, setShowPosts] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const navigate = useNavigate();

  // Hàm chuyển hướng khi click vào thể loại
  const handleCategoryClick = (tag: string) => {
    navigate(`/posts/tag/${encodeURIComponent(tag)}`);
  };

  return (
    <aside className={`w-full space-y-6 text-white lg:space-y-10 ${className}`}>
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
          <li
            className="hover:text-secondaryColor transition cursor-pointer"
            onClick={() => handleCategoryClick('Đồ uống có cồn')}
          >
            Đồ uống có cồn
          </li>
          <li
            className="hover:text-secondaryColor transition cursor-pointer"
            onClick={() => handleCategoryClick('Ẩm thực & món ngon')}
          >
            Ẩm thực & món ngon
          </li>
          <li
            className="hover:text-secondaryColor transition cursor-pointer"
            onClick={() => handleCategoryClick('Món ăn gia đình')}
          >
            Món ăn gia đình
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default PostSidebar;
