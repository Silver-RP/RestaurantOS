import React from 'react';
import { FavoriteItem } from '@/types/Dish.types';
import ButtonComponents from '@/components/common/ButtonComponents';
import { useAddToCart } from '@/hooks/useCart';

interface Props {
  item: FavoriteItem;
  onRemove: () => void;
}

const FavoriteItemCard: React.FC<Props> = ({ item, onRemove }) => {
  const dish = item.dishId;
  const { mutate: addToCart } = useAddToCart();

  if (!dish) return null;

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 rounded-lg p-4 shadow-2xl hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] transition duration-300">
      <img
        src={dish.images?.[0] || '/fallback-image.jpg'}
        alt={dish.name}
        className="w-32 h-32 object-cover rounded"
      />

      <div className="flex-1 text-white">
        <h2 className="text-lg font-semibold">{dish.name}</h2>

        <p className="text-sm text-gray-400 mb-1">
          Danh mục:{' '}
          {Array.isArray(dish.categories) && dish.categories.length > 0
            ? dish.categories
                .map((cat) =>
                  typeof cat === 'object' ? cat.Cate_name : ''
                )
                .join(', ')
            : 'Không rõ'}
        </p>

        <div className="flex gap-2 items-center text-base font-medium mb-2">
        {typeof dish.discount_price === 'number' && (
  <span className="line-through text-sm text-gray-400">
    {dish.price.toLocaleString()} VNĐ
  </span>
)}
<span className="text-secondaryColor text-base">
  {typeof dish.discount_price === 'number'
    ? dish.discount_price.toLocaleString()
    : dish.price.toLocaleString()}{' '}
  VNĐ
</span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <ButtonComponents
            size="small"
            variant="filled"
            onClick={() => addToCart({ dishId: dish._id, quantity: 1 })}
            className="text-sm px-3 py-1"
          >
            Thêm vào giỏ hàng
          </ButtonComponents>
          <ButtonComponents
            onClick={onRemove}
            size="small"
            variant="outline"
            className="text-sm px-3 py-1"
          >
            Xoá
          </ButtonComponents>
        </div>
      </div>
    </div>
  );
};

export default FavoriteItemCard;