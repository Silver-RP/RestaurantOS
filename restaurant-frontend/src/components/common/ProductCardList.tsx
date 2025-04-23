import React from "react";
import { FiShoppingCart, FiEye, FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ProductCardProps } from "../../types/ProductCard.types";

const ProductCardList: React.FC<ProductCardProps> = ({
  name,
  imageUrl,
  hoverImage,
  price,
  originalPrice,
  discount,
  isNew,
  slug,
  description,
}) => {
  const navigate = useNavigate();

  const handleNavigateToDetail = () => {
    navigate(`/product/${slug}`);
  };

  return (
    <div className="flex bg-primaryBackground rounded-lg overflow-hidden shadow-md relative group">
      <div
        className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 relative cursor-pointer"
        onClick={handleNavigateToDetail}
      >
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        {hoverImage && (
          <img
            src={hoverImage}
            alt={`${name} Hover`}
            className="w-full h-full object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount && (
            <span className="bg-secondaryColor text-black text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-sm">
              {discount}
            </span>
          )}
          {isNew && (
            <span className="bg-secondaryColor text-black text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-sm">
              NEW
            </span>
          )}
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 flex gap-3 transition-all duration-500 ease-in-out">
          <div className="p-1.5 sm:p-2 bg-white text-[#002B40] rounded-full shadow-md hover:bg-secondaryColor hover:text-white hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <FiShoppingCart size={18} />
          </div>
          <div className="p-1.5 sm:p-2 bg-white text-[#002B40] rounded-full shadow-md hover:bg-secondaryColor hover:text-white hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <FiEye size={18} />
          </div>
          <div className="p-1.5 sm:p-2 bg-white text-[#002B40] rounded-full shadow-md hover:bg-secondaryColor hover:text-white hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <FiHeart size={18} />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-headerBackground flex flex-col justify-center p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-2">
          <div className="flex-1">
            <h3
              className="text-base sm:text-lg font-light mb-1 cursor-pointer hover:text-secondaryColor transition-colors"
              onClick={handleNavigateToDetail}
            >
              {name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-snug">
              {description.length > 60 ? `${description.substring(0, 60)}...` : description}
            </p>
          </div>

          <div className="text-right sm:text-right flex flex-col sm:flex-col items-start sm:items-end gap-1 w-full sm:w-auto">
            {originalPrice && (
              <div className="text-xs sm:text-sm font-light line-through text-gray-400">
                {originalPrice.toLocaleString()} VND
              </div>
            )}
            <div className="text-base sm:text-lg font-light text-secondaryColor">
              {price.toLocaleString()} VND
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardList;