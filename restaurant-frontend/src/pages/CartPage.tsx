import ButtonComponents from '@components/common/ButtonComponents';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import React, { useState } from 'react';

const CartPage = () => {
  const cartItems = [
    {
      id: 1,
      name: 'Olivas Rellenas',
      price: 120000,
      quantity: 2,
      imageUrl: '/assets/images/products/SP1.jpg',
      hoverImage: '/assets/images/products/SP1.1.jpg',
      isNew: true,
      discount: '10% OFF',
      cate: 'Appetizer',
      discountedPrice: 108000, // 10% OFF
    },
    {
      id: 3,
      name: 'Greek Salad',
      price: 305000,
      originalPrice: 350000,
      quantity: 1,
      imageUrl: '/assets/images/products/SP3.jpg',
      hoverImage: '/assets/images/products/SP3.1.jpg',
      isNew: true,
      cate: 'Salad',
      discountedPrice: 305000, // đã có sẵn
    },
    {
      id: 9,
      name: 'Grilled Fish',
      price: 250000,
      quantity: 1,
      imageUrl: '/assets/images/products/SP9.jpg',
      hoverImage: '/assets/images/products/SP9.1.jpg',
      isNew: false,
      cate: 'Main Course',
      discountedPrice: 250000,
    },
    {
      id: 1,
      name: 'Olivas Rellenas',
      price: 120000,
      quantity: 2,
      imageUrl: '/assets/images/products/SP1.jpg',
      hoverImage: '/assets/images/products/SP1.1.jpg',
      isNew: true,
      discount: '10% OFF',
      cate: 'Appetizer',
      discountedPrice: 108000,
    },
    {
      id: 3,
      name: 'Greek Salad',
      price: 305000,
      originalPrice: 350000,
      quantity: 1,
      imageUrl: '/assets/images/products/SP3.jpg',
      hoverImage: '/assets/images/products/SP3.1.jpg',
      isNew: true,
      cate: 'Salad',
      discountedPrice: 305000,
    },
    {
      id: 9,
      name: 'Grilled Fish',
      price: 250000,
      quantity: 1,
      imageUrl: '/assets/images/products/SP9.jpg',
      hoverImage: '/assets/images/products/SP9.1.jpg',
      isNew: false,
      cate: 'Main Course',
      discountedPrice: 250000,
    },
    {
      id: 1,
      name: 'Olivas Rellenas',
      price: 120000,
      quantity: 2,
      imageUrl: '/assets/images/products/SP1.jpg',
      hoverImage: '/assets/images/products/SP1.1.jpg',
      isNew: true,
      discount: '10% OFF',
      cate: 'Appetizer',
      discountedPrice: 108000,
    },
    {
      id: 3,
      name: 'Greek Salad',
      price: 305000,
      originalPrice: 350000,
      quantity: 1,
      imageUrl: '/assets/images/products/SP3.jpg',
      hoverImage: '/assets/images/products/SP3.1.jpg',
      isNew: true,
      cate: 'Salad',
      discountedPrice: 305000,
    },
    {
      id: 9,
      name: 'Grilled Fish',
      price: 250000,
      quantity: 1,
      imageUrl: '/assets/images/products/SP9.jpg',
      hoverImage: '/assets/images/products/SP9.1.jpg',
      isNew: false,
      cate: 'Main Course',
      discountedPrice: 250000,
    },
  ];
  const [selectedItems, setSelectedItems] = useState<number[]>(
    cartItems.map((item) => item.id),
  );
  const handleToggleItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  const isAllSelected = selectedItems.length === cartItems.length;
  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(item.id),
  );

  const originalTotal = selectedCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const discountedTotal = selectedCartItems.reduce(
    (total, item) =>
      total + (item.discountedPrice || item.price) * item.quantity,
    0,
  );

  // const subtotal = discountedTotal;

  return (
    <section className="bg-bodyBackground w-full text-white">
      <div className="w-full mx-auto">
        <BreadCrumbComponents />
      </div>
      <div className="w-11/12 md:w-container95 lg:w-container95 xl:w-container95 2xl:w-mainContainer mx-auto pb-10 py-10">
        <h1 className="text-3xl mb-8 text-center lg:text-left">Giỏ hàng</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 overflow-x-auto">
            <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-custom">
              <table className="w-full text-sm border-separate border-spacing-y-1">
                <thead className="sticky top-0 z-20 bg-bodyBackground">
                  <tr className="text-white">
                    <th className="px-4 text-center w-[40px]">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={isAllSelected}
                      />
                    </th>
                    <th className="py-3 text-left text-lg font-light">
                      Sản phẩm
                    </th>
                    <th className="py-3 text-left text-lg font-light">Giá</th>
                    <th className="py-3 text-left text-lg font-light">
                      Số lượng
                    </th>
                    <th className="py-3 text-left text-lg font-light">
                      Tạm tính
                    </th>
                    <th className="py-3 text-center text-lg font-light w-[40px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr
                      key={item.id}
                      className="bg-[#0D3343]/50 hover:bg-[#0D3343] transition duration-150 border border-[#26455E] shadow-sm rounded"
                    >
                      <td className="text-center align-middle px-2">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleToggleItem(item.id)}
                        />
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
                        {item.discountedPrice &&
                        item.discountedPrice !== item.price ? (
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-400 line-through">
                              {item.price.toLocaleString()} VND
                            </span>
                            <span className="text-base text-secondaryColor font-semibold">
                              {item.discountedPrice.toLocaleString()} VND
                            </span>
                          </div>
                        ) : (
                          <span className="text-base text-white font-medium">
                            {item.price.toLocaleString()} VND
                          </span>
                        )}
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
                        {(
                          (item.discountedPrice || item.price) * item.quantity
                        ).toLocaleString()}{' '}
                        VND
                      </td>
                      <td className="text-center align-middle text-gray-400 hover:text-red-500 cursor-pointer px-2">
                        <button>×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border border-[#26455E] p-6 rounded-lg w-full max-w-sm self-start shadow-md">
            <h2 className="text-xl mb-6">Tổng giỏ hàng</h2>

            <div className="flex justify-between items-center text-sm py-2 border-t border-[#26455E]">
              <span className="text-white/70">Giá gốc</span>
              <span className="text-white/70">
                {originalTotal.toLocaleString()} VND
              </span>
            </div>

            <div className="flex justify-between items-center text-sm py-2 border-t border-[#26455E]">
              <span className="text-white/90">Giá sau giảm</span>
              <span className="text-white/90">
                {discountedTotal.toLocaleString()} VND
              </span>
            </div>

            <div className="flex justify-between items-center text-sm py-2 border-t border-[#26455E]">
              <span className="text-white/60">Bạn tiết kiệm</span>
              <span className="text-green-400 font-medium">
                {(originalTotal - discountedTotal).toLocaleString()} VND
              </span>
            </div>

            <div className="flex justify-between items-center text-sm py-2 border-t border-[#26455E]">
              <span className="text-white/70">VAT (8%)</span>
              <span className="text-white/70">
                {(discountedTotal * 0.08).toLocaleString()} VND
              </span>
            </div>

            <div className="flex justify-between items-center text-base font-semibold py-6 border-t border-[#26455E]">
              <span className="text-white font-light">Tổng cộng</span>
              <span className="text-secondaryColor font-light text-lg">
                {(discountedTotal * 1.08).toLocaleString()} VND
              </span>
            </div>

            <ButtonComponents
              variant="filled"
              size="small"
              className="w-full mt-4 py-3"
            >
              TIẾN HÀNH THANH TOÁN
            </ButtonComponents>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
