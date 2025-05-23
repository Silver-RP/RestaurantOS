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

interface OrderItem {
  _id: string;
  user_id: {
    _id: string;
    username: string;
    email: string;
    phone: string;
  } | null;
  address_id: {
    _id: string;
    full_name: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    street_address: string;
    address_type: string;
  } | null;
  payment_method: string;
  delivery_type: string;
  delivery_status: string;
  status: string;
  shipping_fee: number;
  vat_amount: number;
  items_price: number;
  total_price: number;
  total_quantity: number;
  is_paid: boolean;
  paid_at: string | null;
  note: string | null;
  cancelled_reason: string | null;
  cancelled_at: string | null;
  returned_at: string | null;
  delivered_at: string | null;
  order_type: string;
  delivery_time_type: string;
  scheduled_time: string | null;
  createdAt: string;
  updatedAt: string;
}

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PREPARING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPING':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'RETURNED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xử lý';
      case 'PREPARING':
        return 'Đang chuẩn bị';
      case 'SHIPPING':
        return 'Đang giao';
      case 'CANCEL_REQUESTED':
        return 'Yêu cầu hủy';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'RETURNED':
        return 'Đã trả hàng';
      default:
        return status;
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

  const getCustomerName = (order: OrderItem) => {
    // Nếu có user_id, lấy tên từ user
    if (order.user_id) {
      return `${order.user_id.username}`;
    }
    if (order.address_id) {
      return order.address_id.full_name;
    }
    return 'Khách vãng lai';
  };

  const getCustomerPhone = (order: OrderItem) => {
    if (order.address_id) {
      return order.address_id.phone;
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
    <div>
      <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
        <div className="flex gap-4">
          <div className="w-96 relative">
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
                <th className="px-4 py-2">STT</th>
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
                  onClick={() => handleSort('status')}
                >
                  <span className="flex items-center gap-1">
                    Trạng thái {renderSortIcon('status')}
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
              {(orders?.orders as OrderItem[])?.map(
                (order: OrderItem, index: number) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {(Number(searchParams.get('page') || 1) - 1) *
                        Number(searchParams.get('limit') || 10) +
                        index +
                        1}
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
                          order.status,
                        )}`}
                      >
                        {getStatusText(order.status)}
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
                          className={`text-xs ${order.is_paid ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {order.is_paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
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
    </div>
  );
};

export default OrderTable;
