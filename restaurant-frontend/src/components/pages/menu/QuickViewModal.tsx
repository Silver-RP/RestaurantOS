import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeQuickView } from '../../../redux/feature/quickView/quickViewSlice';
import { RootState } from 'redux/store';
import { FilledStar, HalfStar, EmptyStar } from '../../common/StarIcons';
import ButtonComponents from '../../common/ButtonComponents';
import { useAddToCart } from '@hooks/useCart';
import { FaHeart } from 'react-icons/fa';
import { useFavorites } from '@/hooks/useFavorites';
import { FiHeart, FiStar } from 'react-icons/fi';

const QuickViewModal = () => {
  const dispatch = useDispatch();
  const product = useSelector(
    (state: RootState) => state.quickView.selectedProduct,
  );
  const [quantity, setQuantity] = useState(1);
  const { mutate: addToCart } = useAddToCart();
  const rating = Math.round((product?.average_rating ?? 0) * 2) / 2;
  const { toggleFavorite } = useFavorites();
  const favoriteItems = useSelector((state: RootState) => state.favorite.items);
  const isFavorited = favoriteItems.some(
    (fav) => fav.dishId && fav.dishId._id === product?._id,
  );

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4">
      <div className="bg-headerBackground rounded-lg overflow-hidden max-w-4xl md:max-w-5xl w-full relative flex flex-col md:flex-row shadow-lg">
        <button
          onClick={() => dispatch(closeQuickView())}
          className="absolute top-4 right-4 text-white hover:text-secondaryColor text-2xl z-10"
        >
          &times;
        </button>

        <div className="w-full md:w-1/2 bg-black">
          <img
            src={product.images?.[0] || '/assets/images/products/SP1.jpg'}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isRecommend && (
            <span className="min-w-[24px] justify-center bg-secondaryColor text-black text-[12px] font-semibold px-2 py-1 rounded-sm flex items-center gap-1">
              <FiStar className="w-3 h-3" />
              <span className="ml-1">Đề xuất</span>
            </span>
          )}
           {product.isDishNew && (
            <span className="max-w-[36px] bg-secondaryColor text-black text-[10px] font-semibold px-1 py-1 rounded-sm">
              NEW
            </span>
          )}
        </div>


        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center space-y-4 text-white font-light">
          <h2 className="text-2xl sm:text-3xl text-white mb-2">
            {product.name}
          </h2>

          <div className="flex items-center gap-1 text-secondaryColor text-sm">
            {[...Array(5)].map((_, index) => {
              if (rating >= index + 1) return <FilledStar key={index} />;
              else if (rating >= index + 0.5) return <HalfStar key={index} />;
              else return <EmptyStar key={index} />;
            })}
            <span className="text-[12px] text-gray-400 ml-1">
              ({product.rating_count || 0} đánh giá)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {product.discount_price && (
              <span className="text-gray-400 line-through text-sm">
                {product.price.toLocaleString()} VND
              </span>
            )}
            <span className="text-xl sm:text-2xl text-secondaryColor">
              {(product.discount_price || product.price).toLocaleString()} VND
            </span>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-2">
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

            <ButtonComponents
              variant="filled"
              size="small"
              onClick={() =>
                addToCart(
                  { dishId: product._id, quantity },                 
                )
              }
            >
              THÊM GIỎ HÀNG
            </ButtonComponents>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="relative group/tooltip">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(product?._id);
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

          <div className="text-xs text-gray-400 mt-6 space-y-1">
            <div>
              <strong>Danh mục:</strong>{' '}
              {product.categories?.map((cat) => cat.Cate_name).join(', ') ||
                'Không xác định'}
            </div>
            <div>
              <strong>Lượt xem:</strong> {product.views ?? 0}
            </div>
            <div>
              <strong>Lượt mua:</strong> {product.ordered_count ?? 0}
            </div>
            <div>
              <strong>Lượt yêu thích:</strong> {product.favorites_count ?? 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
