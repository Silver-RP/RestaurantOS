/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import NavigationOrder, {
  deliveryStatusMapping,
} from '../components/pages/order/NavigationOrder';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import {
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaUserCircle,
} from 'react-icons/fa';
import { useOrders } from '@/hooks/useOrder';
import { toast } from 'react-toastify';
import OrderItemComponent from '../components/pages/order/OrderItem';
import { DeliveryStatus } from '@/types/Order.type';

const OrderPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Tất cả đơn hàng');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const delivery_status_raw = deliveryStatusMapping[activeTab]?.delivery_status;

  const delivery_status = delivery_status_raw as
    | DeliveryStatus
    | DeliveryStatus[]
    | undefined;

  const { data, isLoading, isError } = useOrders({
    filters: {},
    delivery_status,
    page,
    limit,
  });

  const orders = data?.orders || [];

  useEffect(() => {
    if (isError) toast.error('Lỗi khi tải danh sách đơn hàng');
  }, [isError]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const totalItems = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return (
    <>
      <BreadCrumbComponents />

      <div className="flex py-10 bg-bodyBackground min-h-auto text-white flex-col">
        <div className="w-11/12 md:w-container95 min-h-[calc(100vh-668px)] lg:w-container95 xl:w-container95 2xl:w-mainContainer mx-auto space-y-6">
          <NavigationOrder activeTab={activeTab} onTabChange={setActiveTab} />

          {isLoading && <p>Đang tải đơn hàng...</p>}

          {!isLoading && orders.length === 0 && (
            <p className="text-white/70">Bạn chưa có đơn hàng nào.</p>
          )}

          {!isLoading &&
            orders.map((order) => (
              <OrderItemComponent
                key={order._id}
                reviewDate={order.delivered_at ?? order.createdAt}
                order={order}
              />
            ))}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 py-6 w-full">
              <div className="flex items-center gap-2 text-base">
                <span>Hiển thị</span>
                <span className="font-bold">5 / {totalItems}</span>
                <span>đơn hàng</span>
              </div>

              <div className="flex items-center gap-3">
                {page > 1 && (
                  <button onClick={() => setPage(page - 1)}>
                    <FaChevronLeft className="text-xl" />
                  </button>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        p === page
                          ? 'border border-secondaryColor text-secondaryColor font-bold'
                          : 'text-white hover:text-secondaryColor'
                      }`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ),
                )}

                {page < totalPages && (
                  <button onClick={() => setPage(page + 1)}>
                    <FaChevronRight className="text-xl" />
                  </button>
                )}
              </div>

              <div className="text-base text-white/90">
                Trang{' '}
                <span className="text-secondaryColor font-bold">
                  {page} / {totalPages}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="w-11/12 md:w-container95 lg:w-container95 xl:w-container95 2xl:w-mainContainer mx-auto space-y-6">
        {/* Moved this outside container to bottom */}
        <div className="flex items-center gap-6 py-6 text-sm justify-start">
          <a
            href="/profile"
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
