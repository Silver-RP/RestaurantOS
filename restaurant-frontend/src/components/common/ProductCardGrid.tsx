import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiShoppingCart,
  FiEye,
  FiCheckSquare,
  FiHeart,
  FiStar,
} from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { ProductCardProps } from '../../types/ProductCard.types';
import { useAppDispatch } from '../../redux/hook';
import { openQuickView } from '../../redux/feature/quickView/quickViewSlice';
import { FilledStar, HalfStar, EmptyStar } from '../common/StarIcons';
import { useAddToCart } from '@hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FoodDetail } from '@/types/Dish.types';

const ProductCardGrid: React.FC<ProductCardProps> = ({ ...rest }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleNavigateToDetail = () => {
    navigate(`/foods/${rest.slug}`);
  };
  const formatNumberShort = (num: number): string => {
    if (num >= 1_000_000)
      return (num / 1_000_000).toFixed(num >= 10_000_000 ? 0 : 1) + 'm';
    if (num >= 1_000) return (num / 1_000).toFixed(num >= 10_000 ? 0 : 1) + 'k';
    return num.toString();
  };
  const { mutate: addToCart } = useAddToCart();
  const { toggleFavorite } = useFavorites();
  const favoriteItems = useSelector((state: RootState) => state.favorite.items);
  const isFavorited = favoriteItems.some(
    (fav) => fav.dishId && fav.dishId._id === rest.id,
  );

  const productDetail: FoodDetail = {
    _id: rest.id,
    name: rest.name,
    slug: rest.slug,
    categories: rest.categories || [],
    status: rest.status || 'available',
    price: rest.price,
    discount_price: rest.originalPrice ?? rest.price,
    description: rest.description,
    shortDescription: rest.description,
    ingredients: '',
    views: rest.views ?? 0,
    ordered_count: rest.ordered_count ?? 0,
    favorites_count: 0,
    average_rating: rest.rating ?? 0,
    rating_count: rest.rating_count ?? 0,
    rating: rest.rating ?? 0,
    countInStock: 10,
    images: [rest.imageUrl],
    imagesPreview: [rest.imageUrl],
    createdAt: rest.createdAt ?? new Date().toISOString(),
    isDeleted: false,
    deletedAt: '',
    isRecommend: rest.isRecommend ?? false,
    isDishNew: rest.isDishNew ?? false,
  };

  return (
    <div className="bg-primaryBackground rounded-lg overflow-hidden shadow-md w-full h-full group">
      <div className="relative w-full pb-[100%] overflow-hidden group">
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out transform group-hover:scale-105 cursor-pointer"
          onClick={handleNavigateToDetail}
        >
          <img
            src={rest.imageUrl || '/assets/images/products/SP1.jpg'}
            alt={rest.name}
            className="w-full h-full object-cover"
          />
          <img
            src={rest.hoverImage || '/assets/images/products/SP1.1.jpg'}
            alt={rest.name}
            className="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        </div>
        
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        {rest.status === 'soldout' && (
            <span className="bg-white text-red-700 text-[10px] font-bold px-2 py-1 rounded-sm">
              Sold Out
            </span>
          )}
          {rest.discount && (
            <span className="bg-secondaryColor text-black text-[10px] font-semibold px-2 py-1 rounded-sm">
              {rest.discount}
            </span>
          )}
          {rest.isDishNew && (
            <span className="bg-secondaryColor text-black text-[10px] font-semibold px-2 py-1 rounded-sm">
              NEW
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-10">
          <div className="relative group/tooltip inline-flex">
            <span className="min-w-[56px] justify-center bg-secondaryColor text-black text-[10px] font-semibold px-2 py-1 rounded-sm flex items-center gap-1">
              <FiEye className="w-3 h-3" />
              {formatNumberShort(rest.views ?? 0)}
            </span>
            <div
              className="absolute left-0 -translate-x-full top-1/2 -translate-y-1/2 
                          bg-black text-white text-[10px] px-2 py-1 rounded 
                          whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 
                          transition-all duration-300 z-20 pointer-events-none"
            >
              Lượt xem
              <div className="absolute left-full top-1/2 -translate-y-1/2 w-2 h-2 bg-black rotate-45"></div>
            </div>
          </div>

          <div className="relative group/tooltip inline-flex">
            <span className="min-w-[56px] justify-center bg-secondaryColor text-black text-[10px] font-semibold px-2 py-1 rounded-sm flex items-center gap-1">
              <FiCheckSquare className="w-3 h-3" />
              {formatNumberShort(rest.ordered_count ?? 0)}
            </span>
            <div
              className="absolute left-0 -translate-x-full top-1/2 -translate-y-1/2 
                          bg-black text-white text-[10px] px-2 py-1 rounded 
                          whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 
                          transition-all duration-300 z-20 pointer-events-none"
            >
              Đã đặt hàng
              <div className="absolute left-full top-1/2 -translate-y-1/2 w-2 h-2 bg-black rotate-45"></div>
            </div>
          </div>

          {(rest.favorites_count ?? 0) > 0 && (
            <div className="relative group/tooltip inline-flex">
              <span className="min-w-[56px] justify-center bg-secondaryColor text-black text-[10px] font-semibold px-2 py-1 rounded-sm flex items-center gap-1">
                <FiHeart className="w-3 h-3" />
                {formatNumberShort(rest.favorites_count ?? 0)}
              </span>
              <div
                className="absolute left-0 -translate-x-full top-1/2 -translate-y-1/2 
                            bg-black text-white text-[10px] px-2 py-1 rounded 
                            whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 
                            transition-all duration-300 z-20 pointer-events-none"
              >
                Lượt yêu thích
                <div className="absolute left-full top-1/2 -translate-y-1/2 w-2 h-2 bg-black rotate-45"></div>
              </div>
            </div>
          )}

          {rest.isRecommend && (
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

        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 flex gap-2 transition-all duration-500 ease-in-out">
          <div className="relative group/tooltip">
            <button
              onClick={() => {
                addToCart({
                  dishId: rest.id,
                  quantity: 1,
                });
              }}
              className="p-1.5 sm:p-2 bg-white text-[#002B40] rounded-full shadow-md 
                       hover:bg-secondaryColor hover:text-white hover:-translate-y-1 transition-all duration-300"
            >
              <FiShoppingCart size={18} />
            </button>
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2 
                    bg-black text-white text-[10px] px-2 py-1 rounded 
                    whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 
                    transition-all duration-300 z-20 pointer-events-none"
            >
              Thêm vào giỏ
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
            </div>
          </div>

          <div className="relative group/tooltip">
            <button
              onClick={() => dispatch(openQuickView(productDetail))}
              className="p-1.5 sm:p-2 bg-white text-[#002B40] rounded-full shadow-md 
                 hover:bg-secondaryColor hover:text-white hover:-translate-y-1 transition-all duration-300"
            >
              <FiEye size={18} />
            </button>
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2 
                    bg-black text-white text-[10px] px-2 py-1 rounded 
                    whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 
                    transition-all duration-300 z-20 pointer-events-none"
            >
              Xem nhanh
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
            </div>
          </div>

          <div className="relative group/tooltip">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(rest.id);
              }}
              className={`p-1.5 sm:p-2 bg-white rounded-full shadow-md 
                          hover:bg-secondaryColor hover:text-white hover:-translate-y-1 transition-all duration-300`}
            >
              {isFavorited ? (
                <FaHeart size={18} className="text-red-500" />
              ) : (
                <FiHeart size={18} className="text-black" />
              )}
            </button>
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2 
                          bg-black text-white text-[10px] px-2 py-1 rounded 
                          whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 
                          transition-all duration-300 z-20 pointer-events-none"
            >
              {isFavorited ? 'Đã yêu thích' : 'Yêu thích'}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 bg-headerBackground flex flex-col items-center text-center">
        <p
          className="text-[10px] sm:text-xs text-gray-400 mb-1 cursor-pointer hover:text-secondaryColor transition-colors"
          onClick={handleNavigateToDetail}
        >
          {rest.cate || 'Danh mục sản phẩm'}
        </p>

        <h3
          className="text-base sm:text-lg font-light mb-1 cursor-pointer hover:text-secondaryColor transition-colors line-clamp-2 break-words overflow-hidden text-ellipsis min-h-[3.5rem]"
          onClick={handleNavigateToDetail}
        >
          {rest.name || 'Tên sản phẩm'}
        </h3>

        <div className="text-xs sm:text-sm text-secondaryColor mb-1 flex items-center gap-1">
  {rest.rating !== undefined && rest.rating !== null ? (
    <>
      <span className="flex gap-[2px] text-secondaryColor">
        {[...Array(5)].map((_, index) => {
          const value = Number(rest.rating ?? 0);
          const rounded = Math.round(value * 2) / 2;
          if (rounded >= index + 1) return <FilledStar key={index} />;
          else if (rounded >= index + 0.5)
            return <HalfStar key={index} />;
          else return <EmptyStar key={index} />;
        })}
      </span>
      <span className="text-[10px] text-white">
        ({rest.rating_count ?? 0})
      </span>
    </>
  ) : (
    <>
      <span>☆☆☆☆☆</span>
      <span className="text-[10px] text-white">(0)</span>
    </>
  )}
</div>

        <div className="h-[60px] flex flex-col items-center justify-end space-y-1">
          {rest.originalPrice && rest.originalPrice > rest.price ? (
            <div className="text-xs sm:text-sm font-light text-gray-400 line-through">
              {rest.originalPrice.toLocaleString()} VND
            </div>
          ) : (
            <div className="text-xs sm:text-sm font-light invisible">
              9&nbsp;999&nbsp;999&nbsp;VND
            </div>
          )}
          <div className="text-base sm:text-lg font-light text-secondaryColor">
            {rest.price?.toLocaleString()} VND
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardGrid;
