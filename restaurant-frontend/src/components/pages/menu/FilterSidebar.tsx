import React from "react";

const FilterSidebar: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Mua sắm theo danh mục */}
      <div>
        <h3 className="text-xl font-light mb-6 border-b border-gray-600 pb-2">
          Mua sắm theo danh mục
        </h3>
        <ul className="space-y-3 text-sm">
          <li className="hover:text-secondaryColor cursor-pointer">Khuyến Mãi</li>
          <li className="hover:text-secondaryColor cursor-pointer">Món Khai Vị</li>
          <li className="hover:text-secondaryColor cursor-pointer">Đồ Uống</li>
        </ul>
      </div>

      {/* Bộ lọc */}
      <div>
        <h3 className="text-xl font-light mb-6 border-b border-gray-600 pb-2">
          Lọc theo
        </h3>

        {/* Thể loại */}
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

        {/* Thành phần */}
        <div className="mb-8">
          <h4 className="text-lg font-light mb-4 border-b-2 border-secondaryColor inline-block pb-1">
            Thành phần
          </h4>
          <div className="space-y-3 mt-4 text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Bò (4)
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Gà (3)
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Hải sản (2)
            </label>
          </div>
        </div>

        {/* Giá */}
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