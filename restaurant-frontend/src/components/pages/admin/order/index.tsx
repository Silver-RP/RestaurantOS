import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FaSort,
  FaArrowUp,
  FaArrowDown,
  FaSearch,
  FaEye,
} from 'react-icons/fa';
import { useAllOrders } from '@/hooks/useOrder';
import AdminPagination from '../AdminPagination';
import OrderFilterPanel from './OrderFilterPanel';
import OrderDetail from './OrderDetail';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { AllOrder } from '@/types/Order.type';
import { toast } from 'react-toastify';
import { ToastConfigAdmin } from '@/components/common/ToastConfig';

const OrderTable: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [search, setSearch] = useState(searchParams.get('keyword') || '');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const {
    data: orders,
    isLoading,
    error,
  } = useAllOrders({
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10,
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    filters: Object.fromEntries(searchParams.entries()),
  });

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (search) {
      newParams.set('keyword', search);
    } else {
      newParams.delete('keyword');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSort = (field: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    const currentSortBy = searchParams.get('sortBy');
    const currentSortOrder = searchParams.get('sortOrder');

    if (currentSortBy === field) {
      newParams.set('sortOrder', currentSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      newParams.set('sortBy', field);
      newParams.set('sortOrder', 'asc');
    }

    setSearchParams(newParams);
  };

  const getSortIcon = (field: string) => {
    if (searchParams.get('sortBy') !== field) return null;
    return searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';
  };

  const renderSortIcon = (field: string) => {
    const iconType = getSortIcon(field);
    if (iconType === 'asc') return <FaArrowUp />;
    if (iconType === 'desc') return <FaArrowDown />;
    return <FaSort />;
  };

  const getStatusColor = (delivery_status: string) => {
    switch (delivery_status) {
      case 'ORDER_PLACED':
        return 'bg-yellow-100 text-yellow-800';
      case 'ORDER_CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING_PICKUP':
        return 'bg-orange-100 text-orange-800';
      case 'PICKED_UP':
        return 'bg-purple-100 text-purple-800';
      case 'IN_TRANSIT':
        return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'DELIVERY_FAILED':
        return 'bg-red-100 text-red-800';
      case 'RETURN_REQUESTED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCEL_RETURN_REQUESTED':
        return 'bg-pink-100 text-pink-800';
      case 'RETURN_APPROVED':
        return 'bg-teal-100 text-teal-800';
      case 'RETURN_REJECTED':
        return 'bg-red-200 text-red-900';
      case 'RETURNED':
        return 'bg-gray-200 text-gray-900';
      case 'CANCEL_REQUESTED':
        return 'bg-orange-200 text-orange-900';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (delivery_status: string) => {
    switch (delivery_status) {
      case 'ORDER_PLACED':
        return 'Đã đặt hàng';
      case 'ORDER_CONFIRMED':
        return 'Đã xác nhận';
      case 'PENDING_PICKUP':
        return 'Chờ nhận hàng';
      case 'PICKED_UP':
        return 'Đã nhận hàng';
      case 'IN_TRANSIT':
        return 'Đang giao';
      case 'DELIVERED':
        return 'Đã giao';
      case 'DELIVERY_FAILED':
        return 'Giao hàng thất bại';
      case 'RETURN_REQUESTED':
        return 'Yêu cầu trả hàng';
      case 'CANCEL_RETURN_REQUESTED':
        return 'Hủy yêu cầu trả hàng';
      case 'RETURN_APPROVED':
        return 'Xác nhận trả hàng';
      case 'RETURN_REJECTED':
        return 'Trả hàng bị từ chối'; 
      case 'RETURNED':
        return 'Đã trả hàng';
      case 'CANCEL_REQUESTED':
        return 'Yêu cầu hủy';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return delivery_status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'CASH':
        return 'Tiền mặt';
      case 'CREDIT_CARD':
        return 'Thẻ tín dụng';
      case 'MOMO':
        return 'Ví MoMo';
      case 'VNPAY':
        return 'VNPay';
      default:
        return method;
    }
  };

  const getDeliveryTypeText = (type: string) => {
    switch (type) {
      case 'DELIVERY':
        return 'Giao hàng';
      case 'PICKUP':
        return 'Nhận tại cửa hàng';
      default:
        return type;
    }
  };

  const getOrderTypeText = (type: string) => {
    switch (type) {
      case 'ONLINE':
        return 'Online';
      case 'OFFLINE':
        return 'Tại cửa hàng';
      default:
        return type;
    }
  };

  const getCustomerName = (order: AllOrder) => {
    if (order.address_id?.full_name) {
      const name = order.address_id?.full_name;
      console.log('Customer name:', name);
      return name;
    }
    if (order.receiver) {
      console.log('Receiver:', order.receiver);
      return order.receiver;
    }
    return 'Chưa có tên khách hàng';
  };

  const getCustomerPhone = (order: AllOrder) => {
    if (order.address_id?.phone) {
      const phone = order.address_id?.phone;
      console.log('Customer phone:', phone);
      return phone;
    }
    if (order.receiver_phone) {
      console.log('Receiver phone:', order.receiver_phone);
      return order.receiver_phone;
    }
    return 'Chưa có số điện thoại';
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm - dd/MM/yyyy', {
        locale: vi,
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseOrderDetail = () => {
    setSelectedOrderId(null);
  };

  return (
    <main className="!p-0 bg-white rounded-lg shadow-md">
      <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
        <div className="flex gap-4">
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Tìm đơn hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleEnter}
              className="px-4 py-2 border rounded-md w-full"
            />
            <button
              onClick={handleSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              aria-label="Search"
            >
              <FaSearch size={18} />
            </button>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
          >
            {showFilterPanel ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </button>
        </div>
      </div>

      {showFilterPanel && (
        <OrderFilterPanel
          key={searchParams.toString()}
          initialFilters={Object.fromEntries(searchParams.entries())}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          onApply={(filters) => {
            const newParams = new URLSearchParams(searchParams.toString());
            Object.entries(filters).forEach(([key, value]) => {
              if (value !== '') {
                newParams.set(key, String(value));
              } else {
                newParams.delete(key);
              }
            });
            newParams.set('page', '1');
            setSearchParams(newParams);
            setShowFilterPanel(false);
          }}
        />
      )}

      <div className="text-sm text-gray-700 mb-4">
        Hiển thị <strong>{orders?.orders?.length || 0}</strong> trên tổng{' '}
        <strong>{orders?.total || 0}</strong> đơn hàng
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Đang tải dữ liệu...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">
          <p>Có lỗi xảy ra khi tải dữ liệu</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      ) : !orders?.orders || orders.orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Không tìm thấy đơn hàng nào</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1200px] w-full bg-white text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Mã Đơn Hàng</th>
                <th className="px-4 py-2">Tên khách hàng</th>
                <th className="px-4 py-2">SĐT</th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <span className="flex items-center gap-1">
                    Ngày đặt {renderSortIcon('createdAt')}
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort('delivery_status')}
                >
                  <span className="flex items-center gap-1">
                    Trạng thái {renderSortIcon('delivery_status')}
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort('total_price')}
                >
                  <span className="flex items-center gap-1">
                    Tổng tiền {renderSortIcon('total_price')}
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort('payment_method')}
                >
                  <span className="flex items-center gap-1">
                    Thanh toán {renderSortIcon('payment_method')}
                  </span>
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort('delivery_type')}
                >
                  <span className="flex items-center gap-1">
                    Loại giao hàng {renderSortIcon('delivery_type')}
                  </span>
                </th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {(orders?.orders as AllOrder[])?.map(
                (order: AllOrder, index: number) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-2">
                      <div className="font-medium">
                        {getCustomerName(order)}
                      </div>
                    </td>
                    <td className="px-4 py-2">{getCustomerPhone(order)}</td>
                    <td className="px-4 py-2">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.delivery_status,
                        )}`}
                      >
                        {getStatusText(order.delivery_status)}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-medium">
                      <div>{order.total_price?.toLocaleString('vi-VN')}₫</div>
                      <div className="text-xs text-gray-500">
                        SL: {order.total_quantity}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span>
                          {getPaymentMethodText(order.payment_method)}
                        </span>
                        <span
                          className={`text-xs ${order.payment_status === 'PAID' ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {order.payment_status === 'PAID'
                            ? 'Đã thanh toán'
                            : 'Chưa thanh toán'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {getDeliveryTypeText(order.delivery_type)}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleViewOrder(order._id)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Xem chi tiết"
                      >
                        <FaEye size={18} />
                      </button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}

      {orders && orders.totalPages > 1 && (
        <AdminPagination
          currentPage={orders.currentPage}
          totalPages={orders.totalPages}
          onPageChange={(page) => {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set('page', String(page));
            setSearchParams(newParams);
          }}
          limit={Number(searchParams.get('limit') || 10)}
          onLimitChange={(newLimit) => {
            setSearchParams((prev) => {
              const newParams = new URLSearchParams(prev);
              newParams.set('limit', newLimit.toString());
              newParams.delete('page');
              return newParams;
            });
          }}

        />
          )}

      {selectedOrderId && (
        <OrderDetail
          orderId={selectedOrderId}
          open={true}
          onClose={handleCloseOrderDetail}
        />
      )}

      <ToastConfigAdmin />
    </main>
  );
};

export default OrderTable;
