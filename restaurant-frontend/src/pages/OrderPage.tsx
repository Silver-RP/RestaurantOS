'use client';

import React, { useEffect, useState } from 'react';
import NavigationOrder from '../components/pages/order/NavigationOrder';
import OrderItem from '../components/pages/order/OrderItem';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import { FaHome, FaUserCircle } from 'react-icons/fa';
import { useOrders } from '@/hooks/useOrder';
import { toast } from 'react-toastify';

const OrderPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Tất cả đơn hàng');
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, isError } = useOrders({ page, limit });
  const orders = data?.orders || [];
  console.log("orders:", orders);
  
  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    if (isError) {
      toast.error('Lỗi khi tải danh sách đơn hàng');
    }
  }, [isError]);

  return (
    <>
      <BreadCrumbComponents />

      <div className="flex py-10 bg-bodyBackground min-h-auto text-white">
        <div className="w-11/12 md:w-container95 lg:w-container95 xl:w-container95 2xl:w-mainContainer mx-auto space-y-6">
          
          {/* Navigation Tabs */}
          <NavigationOrder activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Loading State */}
          {isLoading && <p>Đang tải đơn hàng...</p>}

          {/* Empty State */}
          {!isLoading && orders.length === 0 && (
            <p className="text-white/70">Bạn chưa có đơn hàng nào.</p>
          )}

          {/* Order List */}
          {!isLoading &&
            orders.map((order) => (
              <OrderItem
                key={order._id}
                reviewDate={order.delivered_at ?? order.createdAt}
                items={order.items || []}
              />
            ))}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={`px-3 py-1 border rounded ${
                  page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
                }`}
              >
                Trước
              </button>
              <span>
                Trang {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className={`px-3 py-1 border rounded ${
                  page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
                }`}
              >
                Sau
              </button>
            </div>
          )}

          {/* Footer Navigation */}
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
