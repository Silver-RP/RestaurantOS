import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt } from "react-icons/fa";
import ButtonComponents from "../../common/ButtonComponents";

interface ProductInfoProps {
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  description: string;
  brand: string;
  categories: string[];
  sku: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  price,
  originalPrice,
  discount,
  rating,
  reviews,
  description,
  brand,
  categories,
  sku,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
  
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getButtonSize = () => {
    if (screenWidth >= 768) return "medium"; 
    return "small"; 
  };

  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={i} />
        ))}
        {hasHalfStar && <FaStarHalfAlt />}
      </>
    );
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl md:text-3xl font-bold font-restora mb-4 md:mb-6">{name}</h2>

      <div className="flex sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
        <span className="text-gray-400 line-through text-sm sm:text-base">
          {originalPrice.toFixed(2)} VND
        </span>
        <span className="text-xl sm:text-2xl text-secondaryColor font-semibold">
          {price.toFixed(2)} VND
        </span>
        <span className="bg-secondaryColor text-black font-semibold px-2 py-1 text-xs w-22 sm:text-sm mt-2 sm:mt-0 rounded">
          GIẢM {discount}%
        </span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="flex text-secondaryColor text-sm">{renderStars()}</div>
        <span className="text-sm text-gray-400">({reviews} đánh giá)</span>
      </div>

      <p className="text-sm text-gray-400 mb-4">{description}</p>

      <hr className="my-6 bg-hr h-[1px] border-0" />

      <div className="flex sm:flex-row sm:items-center gap-4 mb-6">
        <input
          type="number"
          value={quantity}
          min={1}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="lg:w-24 lg:py-3 md:w-16 md:py-3 w-14 py-0 text-white text-center bg-transparent border border-hr "
        />
        <ButtonComponents
          variant="filled"
          size={getButtonSize()}
          onClick={() => console.log(`Thêm ${quantity} sản phẩm vào giỏ hàng`)}
        >
          THÊM GIỎ HÀNG
        </ButtonComponents>
        <button
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded transition duration-300 text-sm ${
            wishlisted ? "text-red-500" : "text-white"
          }`}
          onClick={() => setWishlisted(!wishlisted)}
        >
          {wishlisted ? <FaHeart /> : <FaRegHeart />}
          {wishlisted ? "Đã yêu thích" : "Yêu thích"}
        </button>
      </div>

      <hr className="my-6 bg-hr h-[1px] border-0" />

      <div className="text-sm mt-4 space-y-2">
        <p><strong>Thương hiệu:</strong> {brand}</p>
        <p><strong>Danh mục:</strong> {categories.join(", ")}</p>
        <p><strong>SKU:</strong> {sku}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-blue-400">
        <span className="cursor-pointer">Chia sẻ</span>
        <span className="cursor-pointer">Tweet</span>
        <span className="cursor-pointer">Ghim</span>
      </div>
    </div>
  );
};

export default ProductInfo;
