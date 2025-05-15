import React from 'react';
import { FavoriteItem } from '@/types/Dish.types';
import ButtonComponents from '@/components/common/ButtonComponents';

interface Props {
  item: FavoriteItem;
  onRemove: () => void;
  onAddToCart: () => void;
}

const FavoriteItemCard: React.FC<Props> = ({
  item,
  onRemove,
  onAddToCart,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 rounded-lg p-4 shadow-2xl hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] transition duration-300">
      <img
  src={item.images?.[0] || '/fallback-image.jpg'} 
  alt={item.name}
  className="w-32 h-32 object-cover rounded"
/>

      <div className="flex-1 text-white">
        <h2 className="text-lg font-semibold">{item.name}</h2>

        <p className="text-sm text-gray-400 mb-1">Danh mục: {item.category}</p>

        <div className="flex gap-2 items-center text-base font-medium mb-2">
          <span className="text-secondaryColor">
            {item.price.toLocaleString()} VNĐ
          </span>
          {item.discountPrice && (
            <span className="line-through text-sm text-gray-400">
              {item.discountPrice.toLocaleString()} VNĐ
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-3">
          <ButtonComponents
            size="small"
            variant="filled"
            onClick={onAddToCart}
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