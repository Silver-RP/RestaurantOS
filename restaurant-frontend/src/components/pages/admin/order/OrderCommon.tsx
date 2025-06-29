export const getStatusColor = (status: string) => {
    switch (status) {
      case 'ORDER_PLACED':
        return 'bg-yellow-100 text-yellow-800';
      case 'ORDER_CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING_PICKUP':
        return 'bg-orange-100 text-orange-800';
      case 'PICKED_UP':
        return 'bg-indigo-100 text-indigo-800';
      case 'IN_TRANSIT':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'DELIVERY_FAILED':
        return 'bg-red-100 text-red-800';
      case 'RETURN_REQUESTED':
        return 'bg-gray-100 text-gray-800';
      case 'RETURN_APPROVED':
        return 'bg-teal-100 text-teal-800';
      case 'RETURN_REJECTED':
        return 'bg-red-200 text-red-900';
      case 'RETURNED':
        return 'bg-gray-200 text-gray-900';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  export const getStatusText = (status: string, deliveryType?: 'DELIVERY' | 'PICKUP' | undefined) => {
    if (deliveryType === 'PICKUP') {
      switch (status) {
        case 'ORDER_PLACED':
          return 'Đơn hàng mới';
        case 'ORDER_CONFIRMED':
          return 'Đã xác nhận đơn hàng';
        case 'PENDING_PICKUP':
          return 'Đơn hàng đang chuẩn bị';
        case 'IN_TRANSIT':
          return 'Đã chuẩn bị xong đơn hàng';
        case 'DELIVERED':
          return 'Người nhận đã lấy hàng';
        case 'DELIVERY_FAILED':
          return 'Người nhận không lấy hàng';
        case 'RETURN_REQUESTED':
          return 'Yêu cầu trả hàng';
        case 'RETURN_APPROVED':
          return 'Đã xác nhận trả hàng';
        case 'RETURN_REJECTED':
          return 'Trả hàng bị từ chối';
        case 'RETURNED':
          return 'Đã trả hàng';
        case 'CANCELLED':
          return 'Đã hủy';
        default:
          return status;
      }
    }
  
    switch (status) {
      case 'ORDER_PLACED':
        return 'Đơn hàng mới';
      case 'ORDER_CONFIRMED':
        return 'Đã xác nhận đơn hàng';
      case 'PENDING_PICKUP':
        return 'Chờ nhận hàng';
      case 'PICKED_UP':
        return 'Đã nhận hàng';
      case 'IN_TRANSIT':
        return 'Đang giao hàng';
      case 'DELIVERED':
        return 'Giao hàng thành công';
      case 'DELIVERY_FAILED':
        return 'Giao hàng thất bại';
      case 'RETURN_REQUESTED':
        return 'Yêu cầu trả hàng';
      case 'RETURN_APPROVED':
        return 'Đã xác nhận trả hàng';
      case 'RETURN_REJECTED':
        return 'Trả hàng bị từ chối';
      case 'RETURNED':
        return 'Đã trả hàng';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };