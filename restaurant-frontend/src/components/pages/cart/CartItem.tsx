import React from 'react';

interface CartItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  return (
    <tr
      className="bg-[#0D3343]/50 hover:bg-[#0D3343] transition duration-150 border border-[#26455E] shadow-sm rounded"
    >
      <td className="text-lg text-gray-400 hover:text-red-500 cursor-pointer text-center align-middle px-2">
        ×
      </td>
      <td className="flex items-center gap-4 py-4 align-middle whitespace-nowrap">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-20 h-20 object-cover rounded"
        />
        <span className="font-medium">{item.name}</span>
      </td>
      <td className="align-middle whitespace-nowrap">
        {item.price.toLocaleString()} VND
      </td>
      <td className="align-middle">
        <div className="flex items-center border border-gray-600 w-fit rounded overflow-hidden">
          <button className="px-2 py-1 hover:bg-secondaryColor hover:text-black transition">
            −
          </button>
          <span className="px-3">{item.quantity}</span>
          <button className="px-2 py-1 hover:bg-secondaryColor hover:text-black transition">
            +
          </button>
        </div>
      </td>
      <td className="align-middle whitespace-nowrap">
        {(item.price * item.quantity).toLocaleString()} VND
      </td>
    </tr>
  );
};

export default CartItem;






