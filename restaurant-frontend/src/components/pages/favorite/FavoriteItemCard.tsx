import React from 'react';
import { FavoriteItem } from '@/types/Dish.types';
import ButtonComponents from '@/components/common/ButtonComponents';
import { useAddToCart } from '@/hooks/useCart';
import { FiShoppingCart, FiTrash } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface Props {
  item: FavoriteItem;
  onRemove: () => void;
}

const FavoriteItemCard: React.FC<Props> = ({ item, onRemove }) => {
  const dish = item.dishId;
  const { mutate: addToCart } = useAddToCart();
  const navigate = useNavigate();

  if (!dish) return null;

  return (
    <div className="flex flex-row items-center gap-4 rounded-lg px-0 py-4 sm:p-4 shadow-2xl hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] transition duration-300 h-[200px]">
      <div className="h-full w-28 sm:w-32 flex-shrink-0 rounded overflow-hidden">
        <img
          src={dish.images?.[0] || '/fallback-image.jpg'}
          alt={dish.name}
          onClick={()=> navigate(`/foods/${dish.slug}`)}
          className="h-full w-full object-cover cursor-pointer"
        />
      </div>

      <div className="flex-1 text-white flex flex-col justify-between h-full overflow-hidden">
        <div>
          <h2 className="text-lg leading-tight line-clamp-2 h-[48px] cursor-pointer"  onClick={()=> navigate(`/foods/${dish.slug}`)}>
            {dish.name}
          </h2>

          <p className="text-sm text-gray-400 mb-2">
            {' '}
            {Array.isArray(dish.categories) && dish.categories.length > 0
              ? dish.categories
                  .map((cat) => (typeof cat === 'object' ? cat.Cate_name : ''))
                  .join(', ')
              : 'Không rõ'}
          </p>

          <div className="flex flex-col justify-between text-base font-medium min-h-[44px] leading-snug">
            {typeof dish.discount_price === 'number' ? (
              <>
                <span className="line-through text-sm text-gray-400">
                  {dish.price.toLocaleString()} VNĐ
                </span>
                <span className="text-secondaryColor text-base">
                  {dish.discount_price.toLocaleString()} VNĐ
                </span>
              </>
            ) : (
              <>
                <span className="invisible text-sm">Giá gốc placeholder</span>
                <span className="text-secondaryColor text-base">
                  {dish.price.toLocaleString()} VNĐ
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <ButtonComponents
            size="small"
            variant="filled"
            onClick={() => addToCart({ dishId: dish._id, quantity: 1 })}
            className="min-w-[64px] sm:min-w-[72px] lg:min-w-[90px] h-[28px] sm:h-[32px] lg:h-[36px] flex items-center justify-center gap-1 text-[11px] sm:text-xs lg:text-sm"
          >
            <FiShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">+</span>
          </ButtonComponents>

          <ButtonComponents
            onClick={onRemove}
            size="small"
            variant="outline"
            className="min-w-[64px] sm:min-w-[72px] lg:min-w-[90px] h-[28px] sm:h-[32px] lg:h-[36px] flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500 transition text-[11px] sm:text-xs lg:text-sm"
          >
            <FiTrash className="w-4 h-4" />
          </ButtonComponents>
        </div>
      </div>
    </div>
  );
};

export default FavoriteItemCard;
