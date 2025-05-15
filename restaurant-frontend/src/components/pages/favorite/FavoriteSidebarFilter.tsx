import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useCategories } from '@/hooks/useCategories';

const FavoriteSidebarFilter: React.FC = () => {
  const { categories, loading, error } = useCategories();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  const handlePriceChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      setPriceRange([values[0], values[1]]);
    }
  };

  return (
    <div className="space-y-10 text-white">
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
            <li className="flex justify-between hover:text-secondaryColor cursor-pointer">
              <span>Tất cả</span>
              <span>({categories.data.reduce((acc, c) => acc + (c.foodCount || 0), 0)})</span>
            </li>
            {categories.data.map((cat) => (
              <li
                key={cat._id}
                className="flex justify-between hover:text-secondaryColor cursor-pointer capitalize"
              >
                <span>{cat.Cate_name}</span>
                <span>({cat.foodCount || 0})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Không có danh mục.</p>
        )}
      </div>

      {/* --- Khoảng giá --- */}
      <div>
        <h3 className="text-xl font-light mb-6 border-b border-gray-600 pb-2">Lọc theo giá</h3>
        <div className="relative w-full px-1">
          <Slider
            range
            min={0}
            max={2000000}
            step={10000}
            value={priceRange}
            onChange={handlePriceChange}
            trackStyle={[{ backgroundColor: '#FFDEA0', height: 2 }]}
            handleStyle={[
              {
                borderColor: '#FFDEA0',
                backgroundColor: '#FFF',
                width: 14,
                height: 14,
                borderWidth: 2,
                marginTop: -6,
              },
              {
                borderColor: '#FFDEA0',
                backgroundColor: '#FFF',
                width: 14,
                height: 14,
                borderWidth: 2,
                marginTop: -6,
              },
            ]}
            railStyle={{ backgroundColor: '#e2e8f0', height: 2 }}
          />
          <div className="flex items-center justify-between mt-6 text-sm">
            <span>{priceRange[0].toLocaleString('vi-VN')} VND</span>
            <span>{priceRange[1].toLocaleString('vi-VN')} VND</span>
          </div>
        </div>
      </div>

      {/* --- Banner phụ --- */}
      <div className="relative w-full h-[200px] rounded bg-black bg-opacity-40 overflow-hidden mt-10">
        <img
          src="/assets/images/banner/banner-sidebar.jpg"
          alt="Ưu đãi"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col top-10 px-6 text-white">
          <p className="text-xs tracking-widest text-secondaryColor uppercase mb-2">
            Ưu đãi
          </p>
          <h3 className="text-xl font-semibold leading-tight">Món ăn hấp dẫn</h3>
        </div>
      </div>
    </div>
  );
};

export default FavoriteSidebarFilter;