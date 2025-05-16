import React from 'react';
import 'rc-slider/assets/index.css';
import { useCategories } from '@/hooks/useCategories';

interface FavoriteSidebarFilterProps {
  onSelectCategory: (category: string | null) => void;
}

const FavoriteSidebarFilter: React.FC<FavoriteSidebarFilterProps> = ({ onSelectCategory }) => {
  const { categories, loading, error } = useCategories();

  return (
    <div className="space-y-10 bg-bodyBackground px-4 py-10 h-screen text-white">
      {/* --- Danh mục --- */}
      <div>
        <h3 className="text-xl font-light mb-6 border-b border-gray-600 pb-2">
          Lọc theo danh mục
        </h3>
        {loading ? (
          <p>Đang tải danh mục...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : categories?.data?.length ? (
          <ul className="space-y-3 text-sm">
            <li
              className="hover:text-secondaryColor cursor-pointer capitalize"
              onClick={() => onSelectCategory(null)}
            >
              <span>Tất cả</span>
            </li>
            {categories.data.map((cat) => (
              <li
                key={cat._id}
                className="hover:text-secondaryColor cursor-pointer capitalize"
                onClick={() => onSelectCategory(cat.Cate_name)}
              >
                <span>{cat.Cate_name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Không có danh mục.</p>
        )}
      </div>

      {/* --- Banner phụ --- */}
      <div className="relative w-full h-[500px] rounded bg-black bg-opacity-40 overflow-hidden mt-10">
        <img
          src="/assets/images/banner/banner-sidebar.jpg"
          alt="Ưu đãi"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col top-10 px-6 text-white">
          <p className="text-xs tracking-widest text-secondaryColor uppercase mb-2">
            Ưu đãi
          </p>
          <h3 className="text-2xl font-semibold leading-tight">
            Món ăn <br /> Hấp dẫn
          </h3>
        </div>
      </div>
    </div>
  );
};

export default FavoriteSidebarFilter;