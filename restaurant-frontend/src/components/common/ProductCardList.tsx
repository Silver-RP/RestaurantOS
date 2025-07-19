import React from 'react';
import {
  FiShoppingCart,
  FiEye,
  FiHeart,
  FiCheckSquare,
  FiStar,
} from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ProductCardProps } from '../../types/ProductCard.types';
import { useAppDispatch } from '../../redux/hook';
import { openQuickView } from '../../redux/feature/quickView/quickViewSlice';
import { useFavorites } from '@/hooks/useFavorites';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FoodDetail } from '@/types/Dish.types';
import { useAddToCart } from '@hooks/useCart';

const formatNumberShort = (num: number): string => {
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(num >= 10_000_000 ? 0 : 1) + 'm';
  if (num >= 1_000) return (num / 1_000).toFixed(num >= 10_000 ? 0 : 1) + 'k';
  return num.toString();
};

const ProductCardList: React.FC<ProductCardProps> = ({
  id,
  name,
  imageUrl,
  hoverImage,
  price,
  originalPrice,
  cate,
  categories,
  discount,
  favorites_count,
  isDishNew,
  isRecommend,
  slug,
  status,
  description,
  views,
  ordered_count,
  rating,
  rating_count,
  createdAt,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toggleFavorite } = useFavorites();
  const favoriteItems = useSelector((state: RootState) => state.favorite.items);
  const isFavorited = favoriteItems.some(
    (fav) => fav.dishId && fav.dishId._id === id,
  );

  const handleNavigateToDetail = () => {
    navigate(`/foods/${slug}`);
  };

  const { mutate: addToCart } = useAddToCart();

  const productDetail: FoodDetail = {
    _id: id,
    name: name,
    slug: slug,
    categories: categories || [],
    status: (status as 'available' | 'hidden' | 'soldout') || 'available',
    price: price,
    discount_price: originalPrice ?? price,
    description: description,
    shortDescription: description,
    ingredients: '',
    isRecommend: isRecommend ?? false,
    isDishNew: isDishNew ?? false,
    views: views ?? 0,
    ordered_count: ordered_count ?? 0,
    favorites_count: favorites_count ?? 0,
    average_rating: rating ?? 0,
    rating_count: rating_count ?? 0,
    rating: rating ?? 0,
    countInStock: 10,
    images: [imageUrl],
    imagesPreview: [imageUrl],
    createdAt: createdAt ?? new Date().toISOString(),
    isDeleted: false,
    deletedAt: '',
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(openQuickView(productDetail));
  };

  const handleAddToFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <div className="flex bg-primaryBackground rounded-lg overflow-hidden shadow-md relative group">
      <div className="w-2/6 aspect-square relative cursor-pointer flex-shrink-0">
        <img
          src={imageUrl}
          alt={name}
          onClick={handleNavigateToDetail}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        {hoverImage && (
          <img
            src={hoverImage}
            alt={`${name} Hover`}
            onClick={handleNavigateToDetail}
            className="w-full h-full object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          />
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {status === 'soldout' && (
            <span className="bg-white text-red-700 text-[8px] font-bold px-1 py-1 rounded-sm">
              Sold Out
            </span>
          )}
          {discount && (
            <span className="bg-secondaryColor text-black text-[8px] font-semibold px-1 py-1 rounded-sm">
              {discount}
            </span>
          )}
          {isDishNew && (
            <span className="bg-secondaryColor text-black text-[8px] font-semibold px-1 py-1 rounded-sm">
              NEW
            </span>
          )}
        </div>

        <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-10">
          <span className="min-w-[40px] justify-center bg-secondaryColor text-black text-[8px] font-semibold px-1 py-1 rounded-sm flex items-center gap-1">
            <FiEye className="w-3 h-3" /> {formatNumberShort(views ?? 0)}
          </span>

          <span className="min-w-[40px] justify-center bg-secondaryColor text-black text-[8px] font-semibold px-1 py-1 rounded-sm flex items-center gap-1">
            <FiCheckSquare className="w-3 h-3" />{' '}
            {formatNumberShort(ordered_count ?? 0)}
          </span>
          {(favorites_count ?? 0) > 0 && (
            <span className="min-w-[40px] justify-center bg-secondaryColor text-black text-[8px] font-semibold px-1 py-1 rounded-sm flex items-center gap-1">
              <FiHeart className="w-3 h-3" />{' '}
              {formatNumberShort(favorites_count ?? 0)}
            </span>
          )}

          {isRecommend && (
            <span className=" min-w-[24px] justify-center bg-secondaryColor text-black text-[10px] font-semibold px-2 py-1 rounded-sm flex items-center gap-1">
            <span className="group/icon flex items-center">
              <FiStar className="w-3 h-3" />
              <span className=" overflow-hidden max-w-0 opacity-0 group-hover/icon:max-w-[60px] group-hover/icon:opacity-100 transition-all duration-500 whitespace-nowrap ml-1">
                Đề xuất
              </span>
            </span>
          </span>
          )}
        </div>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 flex gap-3 transition-all duration-500 ease-in-out">
          <div className="relative group/tooltip">
            <button
              onClick={() => {
                addToCart({
                  dishId: id,
                  quantity: 1,
                });
              }}
              className="p-1.5 sm:p-2 bg-white text-[#002B40] rounded-full shadow-md hover:bg-secondaryColor hover:text-white hover:-translate-y-1 transition-all duration-300"
            >
              <FiShoppingCart size={18} />
            </button>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 z-20 pointer-events-none">
              Thêm vào giỏ
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
            </div>
          </div>

          <div className="relative group/tooltip">
            <button
              onClick={handleQuickView}
              className="p-1.5 sm:p-2 bg-white text-[#002B40] rounded-full shadow-md hover:bg-secondaryColor hover:text-white hover:-translate-y-1 transition-all duration-300"
            >
              <FiEye size={18} />
            </button>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 z-20 pointer-events-none">
              Xem nhanh
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
            </div>
          </div>

          <div className="relative group/tooltip">
            <button
              onClick={handleAddToFavorite}
              className="p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:bg-secondaryColor hover:text-white hover:-translate-y-1 transition-all duration-300"
            >
              {isFavorited ? (
                <FaHeart size={18} className="text-red-500" />
              ) : (
                <FiHeart size={18} className="text-black" />
              )}
            </button>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 z-20 pointer-events-none">
              {isFavorited ? 'Đã yêu thích' : 'Yêu thích'}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-headerBackground flex flex-col justify-between p-3 sm:p-4">
        <div className="flex flex-col gap-2 mb-2">
          <h3
            className="text-base sm:text-lg font-light cursor-pointer hover:text-secondaryColor transition-colors"
            onClick={handleNavigateToDetail}
          >
            {name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 leading-snug">
            {description}
          </p>
          <p
            className="text-[10px] sm:text-xs text-gray-400 mb-1 cursor-pointer hover:text-secondaryColor transition-colors"
            onClick={handleNavigateToDetail}
          >
            {cate || 'Danh mục sản phẩm'}
          </p>
        </div>

        <div className="text-left flex flex-row items-start gap-2">
          {(originalPrice == price) ? (
            <div className="text-base sm:text-lg font-light text-secondaryColor">
            {price.toLocaleString()} VND
          </div>
          ): (
            <>
              <div className="text-xs sm:text-sm font-light line-through text-gray-400">
                {originalPrice?.toLocaleString()} VND
              </div>
              <div className="text-base sm:text-lg font-light text-secondaryColor">
                {price.toLocaleString()} VND
              </div>
            </>
          )}
         
        </div>
      </div>
    </div>
  );
};

export default ProductCardList;
