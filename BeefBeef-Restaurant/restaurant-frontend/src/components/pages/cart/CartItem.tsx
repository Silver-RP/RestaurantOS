import React from 'react';
import { useDeleteCartItem, useUpdateCartItem } from '@hooks/useCart';

interface CartItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    discountedPrice: number;
    quantity: number;
    imageUrl: string;
  };
  selected: boolean;
  onSelect: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, selected, onSelect }) => {
  const { mutate: deleteCartItem } = useDeleteCartItem();
  const { mutate: updateCartItem } = useUpdateCartItem();
  return (
    <tr className="bg-[#0D3343]/50 hover:bg-[#0D3343] transition duration-150 border border-[#26455E] shadow-sm rounded">
      {/* Checkbox */}
      <td className="text-center align-middle px-2">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(item.id)}
          className="form-checkbox h-4 w-4 text-secondaryColor"
        />
      </td>

      {/* Ảnh + Tên */}
      <td className="flex items-center gap-2 sm:gap-4 py-2 sm:py-4 align-middle whitespace-normal max-w-[200px] sm:max-w-[300px]">
  <img
    src={item.imageUrl}
    alt={item.name}
    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded shrink-0"
  />
  <span className="font-medium text-sm sm:text-base break-words">
    {item.name}
  </span>
</td>

      {/* Giá */}
      <td className="align-middle whitespace-nowrap">
        {item.discountedPrice && item.discountedPrice !== item.price ? (
          <div className="flex flex-col">
            <span className="text-sm text-gray-400 line-through">
              {item.price.toLocaleString()} VND
            </span>
            <span className="text-white font-medium">
              {item.discountedPrice.toLocaleString()} VND
            </span>
          </div>
        ) : (
          <span className="text-white">{item.price.toLocaleString()} VND</span>
        )}
      </td>

      {/* Số lượng */}
      <td className="align-middle">
        <div className="flex items-center border border-gray-600 w-fit rounded overflow-hidden">
          <button className="px-2 py-1 hover:bg-secondaryColor hover:text-black transition" onClick={() => updateCartItem({ dishId: item.id.toString(), quantity: item.quantity - 1 })}>
            −
          </button>
          <span className="px-3">{item.quantity}</span>
          <button className="px-2 py-1 hover:bg-secondaryColor hover:text-black transition" onClick={() => updateCartItem({ dishId: item.id.toString(), quantity: item.quantity + 1 })}>
            +
          </button>
        </div>
      </td>

      {/* Tạm tính */}  
      <td className="align-middle whitespace-nowrap">
        {(
          (item.discountedPrice || item.price) * item.quantity
        ).toLocaleString()}{' '}
        VND
      </td>

      {/* Xoá */}
      <td className="text-lg text-gray-400 hover:text-red-500 cursor-pointer text-center align-middle px-2">
        <button onClick={() => deleteCartItem(item.id.toString())}>×</button>
      </td>
    </tr>
  );
};

export default CartItem;