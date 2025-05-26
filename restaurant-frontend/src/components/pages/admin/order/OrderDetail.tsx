import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useOrderDetail, useUpdateOrderStatus } from '@/hooks/useOrder';
import { toast } from 'react-toastify';

const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'PENDING_PICKUP', label: 'Chờ lấy hàng' },
  { value: 'PICKED_UP', label: 'Đã lấy hàng' },
  { value: 'IN_TRANSIT', label: 'Đang vận chuyển' },
  { value: 'DELIVERED', label: 'Đã giao hàng' },
  { value: 'DELIVERY_FAILED', label: 'Giao hàng thất bại' },
  { value: 'RETURN_REQUESTED', label: 'Yêu cầu trả hàng' },
  { value: 'RETURNED', label: 'Đã trả hàng' },
  { value: 'CANCEL_REQUESTED', label: 'Yêu cầu hủy' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

interface OrderDetailProps {
  orderId: string;
  open: boolean;
  onClose: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({
  orderId,
  open,
  onClose,
}) => {
  const { data: orderDetail, isLoading } = useOrderDetail(orderId);
  const updateStatusMutation = useUpdateOrderStatus();
  const [newStatus, setNewStatus] = useState('');

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm - dd/MM/yyyy', {
        locale: vi,
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'; // Màu vàng cho chờ xác nhận
      case 'PENDING_PICKUP':
        return 'bg-blue-100 text-blue-800'; // Màu xanh dương cho chờ lấy hàng
      case 'PICKED_UP':
        return 'bg-indigo-100 text-indigo-800'; // Màu indigo cho đã lấy hàng
      case 'IN_TRANSIT':
        return 'bg-purple-100 text-purple-800'; // Màu tím cho đang vận chuyển
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'; // Màu xanh lá cho đã giao
      case 'DELIVERY_FAILED':
        return 'bg-red-100 text-red-800'; // Màu đỏ cho giao thất bại
      case 'RETURN_REQUESTED':
        return 'bg-orange-100 text-orange-800'; // Màu cam cho yêu cầu trả
      case 'RETURNED':
        return 'bg-gray-100 text-gray-800'; // Màu xám cho đã trả
      case 'CANCEL_REQUESTED':
        return 'bg-pink-100 text-pink-800'; // Màu hồng cho yêu cầu hủy
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'; // Màu đỏ cho đã hủy
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusObj = ORDER_STATUSES.find((s) => s.value === status);
    return statusObj ? statusObj.label : status;
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error('Vui lòng chọn trạng thái mới');
      return;
    }

    try {
      await updateStatusMutation.mutateAsync({
        orderId,
        status: newStatus,
      });
      toast.success('Cập nhật trạng thái thành công');
      onClose();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Đang tải...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!orderDetail?.order) {
    return null;
  }

  const { order } = orderDetail;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {' '}
      <DialogTitle className="bg-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span>Chi tiết đơn hàng #{order._id}</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
          >
            {getStatusText(order.status)}
          </span>
        </div>
        <div className="text-sm font-normal">{formatDate(order.createdAt)}</div>
      </DialogTitle>
      <DialogContent>
        <div className="py-4 space-y-6">
          {/* Thông tin khách hàng */}
          <div>
            <h3 className="text-lg font-medium mb-2">Thông tin khách hàng</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Tên khách hàng</p>
                <p className="font-medium">
                  {order.receiver ||
                    order.address_id?.full_name ||
                    'Khách vãng lai'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Số điện thoại</p>
                <p className="font-medium">
                  {order.address_id?.phone ||
                    order.receiver_phone ||
                    'Chưa có số điện thoại'}
                </p>
              </div>
            </div>
          </div>

          {/* Thông tin giao hàng */}
          {order.delivery_type === 'DELIVERY' && (
            <div>
              <h3 className="text-lg font-medium mb-2">Thông tin giao hàng</h3>
              <div>
                <p className="text-gray-600">Địa chỉ giao hàng</p>
                <p className="font-medium">
                  {order.address_id?.street_address}, {order.address_id?.ward},{' '}
                  {order.address_id?.district}, {order.address_id?.province}
                </p>
              </div>
            </div>
          )}

          {/* Chi tiết đơn hàng */}
          <div>
            <h3 className="text-lg font-medium mb-2">Chi tiết đơn hàng</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2">Sản phẩm</th>
                  <th className="text-center pb-2">Số lượng</th>
                  <th className="text-right pb-2">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items?.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="py-2">
                      <div>
                        <p className="font-medium">{item.dish_name}</p>
                        {item.note && (
                          <p className="text-sm text-gray-500">
                            Ghi chú: {item.note}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">
                      {formatPrice(item.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-b">
                  <td colSpan={2} className="py-2">
                    Tạm tính
                  </td>
                  <td className="text-right">
                    {formatPrice(order.items_price)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td colSpan={2} className="py-2">
                    VAT (8%)
                  </td>
                  <td className="text-right">
                    {formatPrice(order.vat_amount)}
                  </td>
                </tr>
                {order.delivery_type === 'DELIVERY' && (
                  <tr className="border-b">
                    <td colSpan={2} className="py-2">
                      Phí giao hàng
                    </td>
                    <td className="text-right">
                      {formatPrice(order.shipping_fee)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan={2} className="py-2 font-medium">
                    Tổng cộng
                  </td>
                  <td className="text-right font-medium">
                    {formatPrice(order.total_price)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Thông tin thanh toán và giao hàng */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Phương thức thanh toán</p>
              <p className="font-medium">
                {order.payment_method === 'CASH'
                  ? 'Tiền mặt'
                  : order.payment_method}
              </p>
              <p
                className={`text-sm ${order.is_paid ? 'text-green-600' : 'text-red-600'}`}
              >
                {order.is_paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Phương thức giao hàng</p>
              <p className="font-medium">
                {order.delivery_type === 'DELIVERY'
                  ? 'Giao hàng'
                  : 'Nhận tại cửa hàng'}
              </p>
              {/* kiểm tra thêm điều kiện là order.delivery_type === DELIVERY thì mới show Loại đơn hàng  */}
              {order.delivery_type === 'DELIVERY' && order.delivery_time_type && (
                <div className="mt-2">
                  <p className="text-gray-600">Loại đơn hàng</p>
                  <p className="font-medium">
                    {order.delivery_time_type === 'ASAP'
                      ? 'Giao ngay'
                      : 'Đặt trước'}
                  </p>
                  {order.delivery_time_type === 'SCHEDULED' &&
                    order.scheduled_time && (
                      <p className="text-sm text-blue-600">
                        Thời gian giao: {formatDate(order.scheduled_time)}
                      </p>
                    )}
                </div>
              )}
            </div>
          </div>

          {/* Ghi chú đơn hàng */}
          {order.note && (
            <div className="pt-4">
              <p className="text-gray-600 mb-1">Ghi chú đơn hàng</p>
              <p className="p-3 bg-gray-50 rounded-md">{order.note}</p>
            </div>
          )}

          {/* Cập nhật trạng thái */}
          <div className="pt-4">
            <FormControl fullWidth>
              <InputLabel>Trạng thái đơn hàng</InputLabel>
              <Select
                value={newStatus || order.status}
                onChange={(e) => setNewStatus(e.target.value)}
                label="Trạng thái đơn hàng"
              >
                {ORDER_STATUSES.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </DialogContent>
      <DialogActions className="bg-gray-50">
        <Button onClick={onClose} color="inherit">
          Đóng
        </Button>
        <Button
          onClick={handleUpdateStatus}
          color="primary"
          variant="contained"
          disabled={!newStatus || newStatus === order.status}
        >
          Cập nhật trạng thái
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetail;
