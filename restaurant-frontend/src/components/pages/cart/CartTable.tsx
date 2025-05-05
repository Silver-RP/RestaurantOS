import React from 'react';
import CartItem from './CartItem';

interface CartTableProps {
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }[];
}

const CartTable: React.FC<CartTableProps> = ({ items }) => {
  return (
    <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-custom">
      <table className="w-full text-sm border-separate border-spacing-y-1">
        <thead className="sticky top-0 z-20 bg-bodyBackground">
          <tr className="text-white">
            <th className="px-4 text-center w-[40px]"></th>
            <th className="py-3 text-left text-lg font-light">Sản phẩm</th>
            <th className="py-3 text-left text-lg font-light">Giá</th>
            <th className="py-3 text-left text-lg font-light">Số lượng</th>
            <th className="py-3 text-left text-lg font-light">Tạm tính</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable;