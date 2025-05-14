import React, { useState } from 'react';

interface PostSidebarProps {
  className?: string;  
}

const PostSidebar: React.FC<PostSidebarProps> = ({ className }) => {
  const [showPosts, setShowPosts] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  return (
    <aside className={`w-full space-y-6 text-white lg:space-y-10 ${className} 
      lg:relative fixed top-0 left-0 bg-[#012B40] lg:bg-transparent z-50 lg:w-[220px] xl:w-[250px]`}>
      {/* Tìm kiếm */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Tìm kiếm blog</h3>
        <input
          type="text"
          placeholder="Tìm Kiếm..."
          className="lg:w-full md:w-1/2 lg:px-4 w-full py-2 bg-transparent border border-hr text-white placeholder-slate-500 focus:outline-none"
        />
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
