// --- 2. CartTable.tsx ---
import React from 'react';
import CartItem from './CartItem';

interface ItemType {
  id: number;
  name: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  imageUrl: string;
}

interface CartTableProps {
  items: ItemType[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

const CartTable: React.FC<CartTableProps> = ({ items, selectedIds, onSelectionChange }) => {
  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(items.map((item) => item.id));
    }
  };

  const toggleItem = (id: number) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((sid) => sid !== id)
      : [...selectedIds, id];
    onSelectionChange(updated);
  };

  return (
    <div className="space-y-4 md:space-y-0">
      {/* Desktop Table */}
      <div className="hidden md:block max-h-[600px] overflow-x-auto pr-2 scrollbar-custom">
        <table className="w-full min-w-[600px] text-xs sm:text-sm border-separate border-spacing-y-1">
          <thead className="sticky top-0 z-20 bg-bodyBackground">
            <tr className="text-white">
              <th className="px-2 sm:px-4 text-center w-[40px]">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-secondaryColor"
                  onChange={toggleSelectAll}
                  checked={selectedIds.length === items.length}
                />
              </th>
              <th className="py-2 sm:py-3 text-left text-base sm:text-lg font-light">Sản phẩm</th>
              <th className="py-2 sm:py-3 text-left text-base sm:text-lg font-light">Giá</th>
              <th className="py-2 sm:py-3 text-left text-base sm:text-lg font-light">Số lượng</th>
              <th className="py-2 sm:py-3 text-left text-base sm:text-lg font-light">Tạm tính</th>
              <th className="py-2 sm:py-3 text-center text-base sm:text-lg font-light">Xoá</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                selected={selectedIds.includes(item.id)}
                onSelect={toggleItem}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile List */}
      <div className="block md:hidden space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-[#0D3343]/50 border border-[#26455E] rounded shadow-sm p-4 flex gap-4">
            <input
              type="checkbox"
              checked={selectedIds.includes(item.id)}
              onChange={() => toggleItem(item.id)}
              className="form-checkbox h-4 w-4 text-secondaryColor"
            />  
            <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded" />
            <div className="flex-1 flex flex-col justify-between text-white">
              <div>
                <h3 className="font-medium text-sm break-words line-clamp-2">{item.name}</h3>
                {item.discountedPrice !== item.price ? (
                  <div className="text-sm mt-1">
                    <span className="line-through text-gray-400 mr-2">{item.price.toLocaleString()} VND</span>
                    <span className="text-secondaryColor font-semibold">{item.discountedPrice.toLocaleString()} VND</span>
                  </div>
                ) : (
                  <div className="text-sm mt-1">{item.price.toLocaleString()} VND</div>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center border border-gray-600 rounded">
                  <button className="px-2 py-1 hover:bg-secondaryColor hover:text-black">−</button>
                  <span className="px-3">{item.quantity}</span>
                  <button className="px-2 py-1 hover:bg-secondaryColor hover:text-black">+</button>
                </div>
                <button className="text-red-400 text-lg hover:text-red-600">×</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartTable;