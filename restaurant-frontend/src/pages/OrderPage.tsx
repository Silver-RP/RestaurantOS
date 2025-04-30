// pages/OrderPage.tsx
import React, { useState } from 'react';
import NavigationOrder from '../components/pages/order/NavigationOrder';
import OrderItem from '../components/pages/order/OrderItem';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import { FaHome, FaUserCircle } from 'react-icons/fa';

const OrderPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Tất cả đơn hàng');

  // 🔹 Dữ liệu mẫu đơn hàng
  const mockOrders = [
    {
      reviewDate: '12/05/2025',
      items: [
        {
          image: '/assets/images/products/SP5.jpg',
          name: 'Cơm gà xối mỡ',
          category: 'Suất ăn',
          quantity: 1,
          price: 45000,
          originalPrice: 50000,
        },
        {
          image: '/assets/images/products/SP5.jpg',
          name: 'Trà sữa trân châu',
          category: 'Đồ uống',
          quantity: 1,
          price: 25000,
          originalPrice: 30000,
        },
      ],
    },
    {
      reviewDate: '10/05/2025',
      items: [
        {
          image: '/assets/images/products/SP5.jpg',
          name: 'Bánh mì chả lụa',
          category: 'Bữa sáng',
          quantity: 2,
          price: 20000,
          originalPrice: 24000,
        },
      ],
    },
  ];

  return (
    <>
      <BreadCrumbComponents />

      <div className="flex py-10 bg-bodyBackground min-h-auto text-white">
        <div className="w-11/12 md:w-container95 lg:w-container95 xl:w-container95 2xl:w-mainContainer mx-auto space-y-6">
          <NavigationOrder activeTab={activeTab} onTabChange={setActiveTab} />

          {mockOrders.map((order, index) => (
            <OrderItem
              key={index}
              reviewDate={order.reviewDate}
              items={order.items}
            />
          ))}
          <div className="flex items-center gap-6 py-4 text-sm">
            <a
              href="/account"
              className="flex items-center gap-2 hover:underline text-white/70"
            >
              <FaUserCircle />
              <span>Quay lại Tài khoản</span>
            </a>
            <a
              href="/"
              className="flex items-center gap-2 hover:underline text-white/70"
            >
              <FaHome />
              <span>Trang chủ</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
