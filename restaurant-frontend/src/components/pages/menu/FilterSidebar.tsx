import React, { useState } from 'react';
import { useCategories } from '../../../hooks/useCategories';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useSearchParams } from 'react-router-dom';

interface FilterSidebarProps {
  onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onClose }) => {
  const { categories, loading, error } = useCategories();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000000]);
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePriceChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      setPriceRange([values[0], values[1]]);
    }
  };

  const handleApplyFilter = () => {
    const currentCategory = searchParams.get('category');
    const currentSort = searchParams.get('sort') || 'default';

    const newParams = new URLSearchParams();
    newParams.set('page', '1');
    newParams.set('sort', currentSort);
    if (currentCategory) newParams.set('category', currentCategory);
    newParams.set('priceMin', priceRange[0].toString());
    newParams.set('priceMax', priceRange[1].toString());

    setSearchParams(newParams);
    onClose();
  };

  const handleCategoryFilter = (categorySlug: string) => {
    const currentSort = searchParams.get('sort') || 'default';

    const newParams = new URLSearchParams();
    newParams.set('page', '1');
    newParams.set('sort', currentSort);
    newParams.set('category', categorySlug);

    newParams.set('priceMin', priceRange[0].toString());
    newParams.set('priceMax', priceRange[1].toString());

    setSearchParams(newParams);
    onClose();
  };

  if (categories) {
    console.log('FilterSidebar categories:', categories.data);
  }

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
        ) : (categories?.data?.length ?? 0) > 0 ? (
          <ul className="space-y-3 text-sm">
            <li
              className="flex justify-between hover:text-secondaryColor cursor-pointer capitalize"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams.toString());
                newParams.delete('category');
                newParams.set('page', '1');
                newParams.set('priceMin', priceRange[0].toString());
                newParams.set('priceMax', priceRange[1].toString());
                setSearchParams(newParams);
                onClose();
              }}
            >
              <span>Tất Cả</span>
              <span>
                ({categories?.data?.reduce((t, c) => t + (c.foodCount || 0), 0)}
                )
              </span>
            </li>
            {categories?.data?.map((category) => (
              <li
                key={category._id}
                className="flex justify-between hover:text-secondaryColor cursor-pointer capitalize"
                onClick={() => handleCategoryFilter(category.Cate_slug)}
              >
                <span>{category.Cate_name}</span>
                <span>({category.foodCount ?? 0})</span>
              </li>
            ))}
          </ul>
        ) : (
          <div>Không có danh mục nào.</div>
        )}
      </div>

      <div>
        <h4 className="text-lg font-light mb-4 border-b-2 border-secondaryColor inline-block pb-1">
          Giá
        </h4>

        <div className="relative w-full px-1">
          <Slider
            range
            min={0}
            max={30000000}
            step={100000}
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

          <div className="flex items-center justify-between mt-6 text-white text-sm">
            <span>{priceRange[0].toLocaleString('vi-VN')} VND</span>
            <span>{priceRange[1].toLocaleString('vi-VN')} VND</span>
            <button
              onClick={handleApplyFilter}
              className="text-secondaryColor text-xs tracking-widest uppercase hover:opacity-80 transition"
            >
              FILTER
            </button>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[500px] rounded bg-black bg-opacity-40 overflow-hidden mt-10">
        <img
          src="/assets/images/banner/banner-sidebar.jpg"
          alt="Thực Đơn Hữu Cơ"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col top-10 px-6 text-white">
          <p className="text-xs tracking-widest text-secondaryColor uppercase mb-2">
            Ưu Đãi Đặc Biệt
          </p>
          <h3 className="text-2xl font-semibold leading-tight">
            Thực Đơn <br /> Hữu Cơ
          </h3>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
