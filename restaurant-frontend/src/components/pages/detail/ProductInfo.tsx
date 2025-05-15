import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import ButtonComponents from '../../common/ButtonComponents';
import { useAddToCart } from '@hooks/useCart';

interface ProductInfoProps {
  id: string;
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
  id,
  name,
  price,
  originalPrice,
  discount,
  rating,
  reviews,
  description,
  // brand,
  categories,
  // sku,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  const { mutate: addToCart } = useAddToCart();

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getButtonSize = () => {
    if (screenWidth >= 768) return 'medium';
    return 'small';
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
      <h2 className="text-2xl md:text-3xl font-restora mb-4 md:mb-6">{name}</h2>

      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
        <span className="text-gray-400 line-through text-xs sm:text-sm">
          {originalPrice.toLocaleString('vi-VN')} VND
        </span>
        <span className="text-2xl text-secondaryColor">
          {price.toLocaleString('vi-VN')} VND
        </span>
        {discount > 0 && (
          <span className="bg-secondaryColor text-black text-xs px-3 py-1">
            GIẢM {discount}%
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="flex text-secondaryColor text-sm">{renderStars()}</div>
        <span className="text-sm text-secondaryColor">{rating}</span>
        <span className="text-sm text-gray-400">|</span>
        <span className="text-sm text-gray-400">({reviews} đánh giá)</span>
      </div>

      <div className="text-sm my-4 space-y-2 ">
        {/* <p>
          <span className="text-gray-400">Thương hiệu:</span>{' '}
          <span className="text-white">{brand}</span>
        </p> */}
        <p>
          <span className="text-gray-400"> Danh mục:</span>{' '}
          <span className="text-white">{categories.join(', ')}</span>
        </p>
        {/* <p>
          <span className="text-gray-400">SKU:</span>{' '}
          <span className="text-white">{sku}</span>
        </p> */}
      </div>

      <p className="text-sm text-gray-400 mb-4">{description}</p>

      <hr className="my-6 bg-hr h-[1px] border-0" />

      <div className="flex sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center border border-hr rounded overflow-hidden">
          <button
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="px-3 py-2 text-white hover:bg-secondaryColor transition"
          >
            –
          </button>
          <span className="px-5 py-2 text-white">{quantity}</span>
          <button
            onClick={() => setQuantity((prev) => prev + 1)}
            className="px-3 py-2 text-white hover:bg-secondaryColor transition"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex">
        <ButtonComponents
          variant="filled"
          size={getButtonSize()}
          onClick={() =>
            addToCart(
              {
                dishId: id,
                quantity,
              },
            )
          }
        >
          THÊM GIỎ HÀNG
        </ButtonComponents>
        <button
          className={`flex items-center justify-center gap-2 px-4 py-2 hover:text-secondaryColor rounded transition duration-300 text-sm ${
            wishlisted ? 'text-secondaryColor' : 'text-white'
          }`}
          onClick={() => setWishlisted(!wishlisted)}
        >
          {wishlisted ? <FaHeart /> : <FaRegHeart />}
          {wishlisted ? 'Đã yêu thích' : 'Yêu thích'}
        </button>
      </div>
      <hr className="my-6 bg-hr h-[1px] border-0" />
    </div>
  );
};

export default ProductInfo;
