import React from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiEye, FiHeart } from "react-icons/fi";

interface ProductCardProps {
  imageUrl?: string;
  hoverImage?: string;
  name: string;
  cate?: string;
  price?: number;
  originalPrice?: number;
  discount?: string;
  isNew?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ ...rest }) => {
  const navigate = useNavigate(); 

  const handleNavigateToDetail = () => {
    navigate(`/product-detail/${rest.name}`);
  };

  return (
    <div className="bg-headerBackground overflow-hidden shadow-md w-full h-full group">
      <div className="relative w-full h-fit group perspective">
        <div
          className="relative w-full h-full transform transition-transform duration-500 group-hover:rotate-y-180 cursor-pointer"
          onClick={handleNavigateToDetail}
        >
          <img
            src={rest.imageUrl || "/assets/images/products/SP1.jpg"}
            alt={rest.name}
            className="w-full h-full object-fit transition-all duration-500 transform group-hover:rotate-y-180"
          />
          <img
            src={rest.hoverImage || "/assets/images/products/SP1.1.jpg"}
            alt={rest.name}
            className="w-full h-full object-contain absolute top-0 left-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          />
        </div>

        <div className="absolute top-2 left-0 flex flex-col gap-1">
          {rest.discount && (
            <span className="bg-secondaryColor text-[#002B40] text-xs font-semibold px-4 py-1 mt-1 w-fit">
              {rest.discount}
            </span>
          )}
          {rest.isNew && (
            <span className="bg-secondaryColor text-[#002B40] text-xs font-semibold px-5 py-2 mt-1 w-fit">
              NEW
            </span>
          )}
        </div>

        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 flex gap-4 transition-all duration-500 ease-in-out">
          <div className="p-2 bg-white text-[#002B40] rounded-full shadow-md hover:bg-secondaryColor transition-all duration-500 delay-100">
            <FiShoppingCart size={20} />
          </div>
          <div className="p-2 bg-white text-[#002B40] rounded-full shadow-md hover:bg-secondaryColor transition-all duration-500 delay-200">
            <FiEye size={20} />
          </div>
          <div className="p-2 bg-white text-[#002B40] rounded-full shadow-md hover:bg-secondaryColor transition-all duration-500 delay-300">
            <FiHeart size={20} />
          </div>
        </div>
      </div>

      <div className="p-4 text-white text-center">
        <p
          className="text-sm font-sans text-gray-300 cursor-pointer"
          onClick={handleNavigateToDetail}
        >
          {rest.cate || "Danh mục sản phẩm"}
        </p>
        <h3
          className="text-lg font-restora font-bold mt-1 cursor-pointer hover:text-secondaryColor"
          onClick={handleNavigateToDetail}
        >
          {rest.name || "Tên sản phẩm"}
        </h3>

        <div className="flex items-center justify-center text-secondaryColor text-sm mt-1">
          <span>★★★★☆</span>
        </div>

        <div className="min-h-[50px] flex flex-col items-center justify-end">
          {rest.originalPrice && (
            <p className="text-gray-400 font-restora line-through text-sm">
              {rest.originalPrice.toLocaleString()} VND
            </p>
          )}
          <p className="text-xl font-restora text-secondaryColor">
            {rest.price?.toLocaleString() || "0"} VND
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
