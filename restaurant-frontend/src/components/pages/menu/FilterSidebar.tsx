import React from 'react';
import { useCategories } from '../../../hooks/useCategories';

const FilterSidebar: React.FC = () => {
  const { categories, loading, error } = useCategories();

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-xl font-light mb-6 border-b border-gray-600 pb-2">
          Mua sắm theo danh mục
        </h3>
        {loading ? (
          <div>Đang tải danh mục...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : categories && categories.data && categories.data.length > 0 ? (
          <ul className="space-y-3 text-sm">
            {categories.data.map((category) => (
              <li
                key={category._id}
                className="hover:text-secondaryColor cursor-pointer capitalize"
              >
                {category.Cate_name}
              </li>
            ))}
          </ul>
        ) : (
          <div>Không có danh mục nào.</div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-light mb-6 border-b border-gray-600 pb-2">
          Lọc theo
        </h3>

        <div className="mb-8">
          <h4 className="text-lg font-light mb-4 border-b-2 border-secondaryColor inline-block pb-1">
            Thể loại
          </h4>
          <div className="space-y-3 mt-4 text-sm">
            <label className="flex items-center">
              <input type="radio" name="category" className="mr-2" />
              Món khai vị (11)
            </label>
            <label className="flex items-center">
              <input type="radio" name="category" className="mr-2" />
              Đồ uống (7)
            </label>
            <label className="flex items-center">
              <input type="radio" name="category" className="mr-2" />
              Đặc biệt (2)
            </label>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-light mb-4 border-b-2 border-secondaryColor inline-block pb-1">
            Giá
          </h4>
          <div className="mt-6">
            <input
              type="range"
              min={0}
              max={1000}
              className="w-full accent-secondaryColor"
            />
            <div className="flex justify-between text-xs mt-2">
              <span>0 VND</span>
              <span>1.000.000 VND</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
