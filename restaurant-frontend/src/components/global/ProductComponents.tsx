import React from 'react';
import { FiShoppingCart, FiEye, FiHeart } from 'react-icons/fi'; // Import các icon từ react-icons

type Props = {
  [key: string]: any; // Định nghĩa các props khác không cố định
};

const ProductCard = ({ ...rest }: Props) => {
  return (
    <div className="bg-headerBackground overflow-hidden shadow-md w-full group">
      {/* Image Container */}
      <div className="relative w-full h-fit group perspective">
        {/* Hình ảnh sản phẩm */}
        <div className="relative w-full h-full transform transition-transform duration-500 group-hover:rotate-y-180">
          <img
            src={rest.imageUrl || "/assets/images/products/SP1.jpg"} // Hoặc {rest.imageUrl} nếu dùng dynamic props
            alt={rest.name}
            className="w-full h-full object-fit transition-all duration-500 transform group-hover:rotate-y-180"
          />
          {/* Hình ảnh thứ hai hiển thị khi hover */}
          <img
            src={rest.hoverImage || "/assets/images/products/SP1.1.jpg"} // Hình ảnh khi hover
            alt={rest.name}
            className="w-full h-full object-contain absolute top-0 left-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-0 flex flex-col gap-1">
          {rest.discount && (
            <span className="bg-secondaryColor text-[#002B40] text-xs font-bold px-4 py-1 mt-1 w-fit">
              {rest.discount}
            </span>
          )}
          {rest.isNew && (
            <span className="bg-secondaryColor text-[#002B40] text-xs font-bold px-4 py-1 mt-1 w-fit">
              NEW
            </span>
          )}
        </div>

        {/* Icons when hover */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 flex gap-4 transition-all duration-500 ease-in-out">
          <div className="p-2 bg-white text-[#002B40] rounded-full shadow-md hover:bg-secondaryColor transform translate-y-[-20px] group-hover:translate-y-0 transition-all duration-500 delay-100">
            <FiShoppingCart size={20} />
          </div>
          <div className="p-2 bg-white text-[#002B40] rounded-full shadow-md hover:bg-secondaryColor transform translate-y-[-20px] group-hover:translate-y-0 transition-all duration-500 delay-200">
            <FiEye size={20} />
          </div>
          <div className="p-2 bg-white text-[#002B40] rounded-full shadow-md hover:bg-secondaryColor transform translate-y-[-20px] group-hover:translate-y-0 transition-all duration-500 delay-300">
            <FiHeart size={20} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 text-white text-center">
        <p className="text-sm text-gray-300">{rest.cate || 'Danh mục sản phẩm'}</p>
        <h3 className="text-lg font-bold mt-1">{rest.name || 'Tên sản phẩm'}</h3>
        {/* Rating */}
        <div className="flex items-center justify-center text-secondaryColor text-sm mt-2">
          <span>★★★★☆</span>
        </div>
        {/* Price */}
        <div className="mt-3">
          {rest.originalPrice && (
            <p className="text-gray-400 line-through text-sm">
              {rest.originalPrice.toLocaleString()} VND
            </p>
          )}
          <p className="text-xl font-bold text-secondaryColor">
            {rest.price?.toLocaleString() || '0'} VND
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
