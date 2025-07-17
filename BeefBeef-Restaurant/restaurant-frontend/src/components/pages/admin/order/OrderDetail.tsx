/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
} from '@mui/material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useOrderDetail, useUpdateOrderStatus } from '@/hooks/useOrder';
import { toast } from 'react-toastify';
import PaymentInfo from './PaymentInfo';
import { Order } from '@/types/Order.type';
import {
  getStatusText,
  getStatusColor,
} from '@/components/pages/admin/order/OrderCommon';

const STATUS_TRANSITIONS: { [key: string]: string[] } = {
  ORDER_PLACED: ['ORDER_CONFIRMED'],
  ORDER_CONFIRMED: ['PENDING_PICKUP'],
  PENDING_PICKUP: ['IN_TRANSIT'],
  PICKED_UP: ['IN_TRANSIT'],
  IN_TRANSIT: ['DELIVERED', 'DELIVERY_FAILED'],
  DELIVERED: [],
  DELIVERY_FAILED: ['PENDING_PICKUP', 'CANCELLED'],
  RETURN_REQUESTED: ['RETURN_APPROVED', 'RETURN_REJECTED'],
  RETURN_APPROVED: ['RETURNED'],
  RETURN_REJECTED: [],
  RETURNED: [],
  CANCELLED: [],
};

const DELIVERY_STATUS_LABELS: { [key: string]: string } = {
  ORDER_CONFIRMED: 'Xác nhận đơn hàng',
  PENDING_PICKUP: 'Chờ nhận hàng',
  PICKED_UP: 'Đã nhận hàng',
  IN_TRANSIT: 'Đang giao',
  DELIVERED: 'Giao hàng thành công',
  DELIVERY_FAILED: 'Giao hàng thất bại',
  RETURN_REQUESTED: 'Yêu cầu trả hàng',
  RETURN_APPROVED: 'Xác nhận trả hàng',
  RETURN_REJECTED: 'Từ chối trả hàng',
  RETURNED: 'Trả hàng thành công',
  CANCELLED: 'Đã hủy',
};

const PICKUP_STATUS_LABELS: { [key: string]: string } = {
  ORDER_CONFIRMED: 'Xác nhận đơn hàng',
  PENDING_PICKUP: 'Chuẩn bị đơn hàng',
  IN_TRANSIT: 'Đã chuẩn bị xong đơn hàng',
  DELIVERED: 'Người nhận đã lấy hàng',
  DELIVERY_FAILED: 'Người nhận không lấy hàng',
  RETURN_REQUESTED: 'Yêu cầu trả hàng',
  RETURN_APPROVED: 'Xác nhận trả hàng',
  RETURN_REJECTED: 'Từ chối trả hàng',
  RETURNED: 'Trả hàng thành công',
  CANCELLED: 'Đã hủy',
};

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
  const [, setOrderPayment] = useState<Order | null>(null);

  function handlePaymentConfirmed(updatedOrder: Order) {
    setOrderPayment(updatedOrder);
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm - dd/MM/yyyy', {
        locale: vi,
      });
    } catch {
      return 'N/A';
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error('Vui lòng chọn trạng thái mới');
      return;
    }

    try {
      await updateStatusMutation.mutateAsync(
        { orderId, status: newStatus },
        {
          onSuccess: () => {
            setNewStatus(''); // Reset newStatus
            onClose(); // Close dialog after success
          },
        },
      );
    } catch {
      // Error toast is handled in useUpdateOrderStatus
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
      <DialogTitle className="bg-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">
            Chi tiết đơn hàng #{order._id.slice(-6).toUpperCase()}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
          >
            {getStatusText(
              order.status,
              order.delivery_type as 'DELIVERY' | 'PICKUP',
            )}
          </span>
        </div>
        <div className="text-sm font-normal">{formatDate(order.createdAt)}</div>
      </DialogTitle>
      <DialogContent>
        <div className="py-4 space-y-6">
          {/* Thông tin khách hàng */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Thông tin khách hàng
            </h3>
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
              <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Thông tin giao hàng
              </h3>
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
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Chi tiết đơn hàng
            </h3>
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
            {order ? (
              <PaymentInfo
                order={order}
                onPaymentConfirmed={handlePaymentConfirmed}
              />
            ) : (
              <p>Đang tải đơn hàng...</p>
            )}

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Phương thức giao hàng
              </h3>
              <p className="text-gray-600">Phương thức giao hàng</p>
              <p className="font-medium">
                {order.delivery_type === 'DELIVERY'
                  ? 'Giao hàng'
                  : 'Nhận tại cửa hàng'}
              </p>
              {order.delivery_type === 'DELIVERY' &&
                order.delivery_time_type && (
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
              {order.delivery_type === 'PICKUP' && order.delivery_time_type && (
                <div className="mt-2">
                  {/* <p className="text-gray-600">Thời gian nhận hàng</p> */}

                  {order.delivery_time_type === 'SCHEDULED' &&
                    order.scheduled_time && (
                      <p className="text-sm text-blue-600">
                        Thời gian nhận: {formatDate(order.scheduled_time)}
                      </p>
                    )}
                </div>
              )}

              {(order.status === 'RETURNED' ||
                order.status === 'RETURN_APPROVED' ||
                order.status === 'RETURN_REJECTED') && (
                <div className="mt-2">
                  <p className="text-gray-600">Lí do trả hàng:</p>
                  <p className="text-base font-medium text-red-600">
                    {order.cancelled_reason || 'Không có lí do'}
                  </p>
                </div>
              )}
              {order.status === 'CANCELLED' && (
                <div className="mt-2">
                  <p className="text-gray-600">Lí do hủy đơn:</p>
                  <p className="text-base font-medium text-red-600">
                    {order.cancelled_reason || 'Không có lí do'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ghi chú đơn hàng */}
          {order.note && (
            <div className="pt-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Ghi chú đơn hàng
              </h3>
              <p className="p-3 bg-gray-50 rounded-md">{order.note}</p>
            </div>
          )}

          {/* Cập nhật trạng thái */}
          <div className="pt-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Cập nhật trạng thái
            </h3>
            <FormControl fullWidth>
              <InputLabel>Trạng thái đơn hàng</InputLabel>
              <Select
                value={newStatus || order.status}
                onChange={(e) => setNewStatus(e.target.value)}
                label="Trạng thái đơn hàng"
                disabled={!STATUS_TRANSITIONS[order.status]?.length}
              >
                {STATUS_TRANSITIONS[order.status]?.length ? (
                  STATUS_TRANSITIONS[order.status].map((statusValue: any) => (
                    <MenuItem key={statusValue} value={statusValue}>
                      {order.delivery_type === 'DELIVERY'
                        ? DELIVERY_STATUS_LABELS[statusValue]
                        : PICKUP_STATUS_LABELS[statusValue]}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value={order.status}>
                    Không có trạng thái nào để thay đổi
                  </MenuItem>
                )}
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
          disabled={!newStatus || newStatus === order.delivery_status}
        >
          Cập nhật trạng thái
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetail;
