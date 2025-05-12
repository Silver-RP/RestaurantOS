// --- 1. CartPage.tsx ---
import React, { useEffect, useState } from 'react';
import ButtonComponents from '@components/common/ButtonComponents';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import { useGetCart } from '@hooks/useCart';
import CartTable from '@components/pages/cart/CartTable';
import CartSummary from '@components/pages/cart/CartSummary';

interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
}
interface CartItem {
  dishId: {
    _id: number;
    name: string;
    price: number;
    discount_price?: number;
    images: string[];
  };
  quantity: number;
}

const CartPage = () => {
  const { data } = useGetCart();
  const cartItemsRaw = (data as unknown as Cart)?.items || [];

  const cartItems = cartItemsRaw.map((item) => ({
    id: item.dishId._id,
    name: item.dishId.name,
    price: item.dishId.price,
    discountedPrice: item.dishId.discount_price || item.dishId.price,
    quantity: item.quantity,
    imageUrl: item.dishId.images[0],
  }));

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    const allIds = cartItems.map((item) => item.id);
    setSelectedIds(allIds);
  }, [cartItemsRaw.length]);

  const handleSelectionChange = (updated: number[]) => {
    setSelectedIds(updated);
  };

  const filteredItems = cartItems.filter((item) => selectedIds.includes(item.id));

  const isCartEmpty = cartItems.length === 0;
  const originalTotal = filteredItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const discountedTotal = filteredItems.reduce((t, i) => t + i.discountedPrice * i.quantity, 0);

  return (
    <section className="bg-bodyBackground w-full text-white">
      <div className="w-full mx-auto">
        <BreadCrumbComponents />
      </div>
      <div className="w-11/12 mx-auto pb-10 py-10">
        <h1 className="text-3xl mb-8 text-center lg:text-left">Giỏ hàng</h1>

        {isCartEmpty ? (
          <div className="text-center py-20 text-white/70">
            <h2 className="text-xl mb-4">Không có sản phẩm nào trong giỏ hàng</h2>
            <ButtonComponents variant="filled" size="small" className="mt-2">
              Mua sắm ngay
            </ButtonComponents>
          </div>
        ) : (
          <div className="flex flex-col 2xl:flex-row gap-10">
            <div className="flex-1 overflow-x-auto">
              <CartTable items={cartItems} selectedIds={selectedIds} onSelectionChange={handleSelectionChange} />
            </div>
            <CartSummary originalTotal={originalTotal} discountedTotal={discountedTotal} />
          </div>
        )}
      </div>
    </section>
  );
};

export default CartPage;
