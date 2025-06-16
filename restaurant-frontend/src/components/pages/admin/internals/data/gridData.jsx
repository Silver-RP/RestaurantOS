import * as React from 'react';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, CircularProgress, Alert } from '@mui/material';
import { useRecentTransactions } from '@/hooks/useDashboard';

const renderTypeChip = (type) => {
  const map = {
    order: { label: 'Đơn hàng', color: 'primary' },
    booking: { label: 'Đặt bàn', color: 'success' },
  };
  return (
    <Chip
      label={map[type]?.label || 'Khác'}
      color={map[type]?.color || 'default'}
      size="small"
    />
  );
};

const renderStatusChip = (params) => {
  const { status, type } = params.row;

  // Mapping cho order status
  const orderStatusMap = {
    ORDER_PLACED: { label: 'Đã đặt hàng', color: 'default' },
    ORDER_CONFIRMED: { label: 'Đã xác nhận', color: 'info' },
    PENDING_PICKUP: { label: 'Chờ lấy hàng', color: 'warning' },
    PICKED_UP: { label: 'Đã lấy hàng', color: 'info' },
    IN_TRANSIT: { label: 'Đang giao', color: 'primary' },
    DELIVERED: { label: 'Đã giao', color: 'success' },
    DELIVERY_FAILED: { label: 'Giao thất bại', color: 'error' },
    RETURN_REQUESTED: { label: 'Yêu cầu trả', color: 'warning' },
    RETURN_APPROVED: { label: 'Duyệt trả hàng', color: 'info' },
    RETURN_REJECTED: { label: 'Từ chối trả', color: 'error' },
    RETURNED: { label: 'Đã trả hàng', color: 'default' },
    CANCELLED: { label: 'Đã hủy', color: 'error' },
  };

  // Mapping cho booking status
  const bookingStatusMap = {
    PENDING: { label: 'Chờ xác nhận', color: 'warning' },
    CONFIRMED: { label: 'Đã xác nhận', color: 'success' },
    CANCELLED: { label: 'Đã hủy', color: 'error' },
    DONE: { label: 'Hoàn thành', color: 'success' },
  };

  const statusMap = type === 'order' ? orderStatusMap : bookingStatusMap;
  const statusInfo = statusMap[status] || { label: status, color: 'default' };

  return (
    <Chip
      label={statusInfo.label}
      color={statusInfo.color}
      size="small"
      variant="outlined"
    />
  );
};

const renderViewButton = (params) => {
  const { row } = params;
  const url =
    row.type === 'order'
      ? `/admin/orders`
      : `/admin/reservations`;

  return (
    <IconButton
      onClick={() => (window.location.href = url)}
      size="small"
      color="primary"
    >
      <SearchIcon fontSize="small" />
    </IconButton>
  );
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Sử dụng định dạng 24h
  });
};


export const columns = [
  {
    field: 'customerName',
    headerName: 'Tên người đặt',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'type',
    headerName: 'Loại đơn',
    flex: 1,
    minWidth: 100,
    renderCell: (params) => renderTypeChip(params.value),
  },
  {
    field: 'status',
    headerName: 'Trạng thái',
    flex: 1,
    minWidth: 80,
    renderCell: renderStatusChip,
  },
  {
    field: 'createdAt',
    headerName: 'Ngày đặt',
    flex: 1,
    minWidth: 120,
    renderCell: (params) => formatDate(params.value),
  },
  {
    field: 'actions',
    headerName: '',
    flex: 0.3,
    sortable: false,
    renderCell: renderViewButton,
  },
];

// Hook để lấy và format data
export const useTransactionRows = () => {
  const { data, isLoading, error } = useRecentTransactions();

  const rows = React.useMemo(() => {
    if (!data?.success || !data?.data) return [];

    return data.data.map((transaction) => ({
      id: transaction.id,
      customerName: transaction.customerName,
      phone: transaction.phone,
      type: transaction.type,
      createdAt: transaction.createdAt,
      total: transaction.total,
      status: transaction.status,
    }));
  }, [data]);

  return { rows, isLoading, error };
};
