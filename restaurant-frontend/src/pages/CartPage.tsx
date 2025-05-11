import ButtonComponents from '@components/common/ButtonComponents';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import React from 'react';
import { useGetCart } from '@hooks/useCart';
import CartTable from '@components/pages/cart/CartTable';
import CartSummary from '@components/pages/cart/CartSummary';

interface CartItem {
  dishId: {
    _id: number;
    name: string;
    price: number;
    discount_price?: number;
    images: string[];
    isNew?: boolean;
    discount?: string;
    categories?: { Cate_name: string }[];
  };
  quantity: number;
}

const CartPage = () => {
  const { data } = useGetCart();
  const cartItemsRaw = (data as CartItem[]) || [];

  const cartItems = cartItemsRaw.map((item) => ({
    id: item.dishId._id,
    name: item.dishId.name,
    price: item.dishId.price,
    discountedPrice: item.dishId.discount_price || item.dishId.price,
    quantity: item.quantity,
    imageUrl: item.dishId.images[0],
    hoverImage: item.dishId.images[1] || item.dishId.images[0],
    isNew: item.dishId.isNew || false,
    discount: item.dishId.discount_price
      ? `${Math.round(
          ((item.dishId.price - item.dishId.discount_price) /
            item.dishId.price) *
            100
        )}% OFF`
      : undefined,
    cate: item.dishId.categories?.[0]?.Cate_name || 'Main Course',
  }));

  const isCartEmpty = cartItems.length === 0;

  const originalTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const discountedTotal = cartItems.reduce(
    (total, item) =>
      total + (item.discountedPrice || item.price) * item.quantity,
    0
  );

  return (
    <section className="bg-bodyBackground w-full text-white">
      <div className="w-full mx-auto">
        <BreadCrumbComponents />
      </div>
      <div className="w-11/12 md:w-container95 lg:w-container95 xl:w-container95 2xl:w-mainContainer mx-auto pb-10 py-10">
        <h1 className="text-3xl mb-8 text-center lg:text-left">Giỏ hàng</h1>

        {isCartEmpty ? (
          <div className="text-center py-20 text-white/70">
            <img
              src="/assets/images/empty-cart.png"
              alt="Empty Cart"
              className="mx-auto mb-6 w-[200px] h-auto"
            />
            <h2 className="text-xl mb-4">
              Không có sản phẩm nào trong giỏ hàng
            </h2>
            <ButtonComponents
              variant="filled"
              size="small"
              className="mt-2"
            >
              Mua sắm ngay
            </ButtonComponents>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 overflow-x-auto">
              <CartTable items={cartItems} />
            </div>
            <CartSummary
              originalTotal={originalTotal}
              discountedTotal={discountedTotal}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CartPage;