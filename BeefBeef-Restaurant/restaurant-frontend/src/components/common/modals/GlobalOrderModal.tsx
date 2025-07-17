import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { closeOrderModal } from '@/redux/feature/modal/orderDetailModalSlice';
import OrderDetailModal from '@/components/pages/order/OrderDetailModal';
import React from 'react';
const GlobalOrderModal = () => {
  const dispatch = useDispatch();
  const { isOpen, orderId } = useSelector((state: RootState) => state.orderDetailModal);

  if (!isOpen || !orderId) return null;

  return (
    <div className="z-[120] fixed inset-0 bg-black bg-opacity-60">
    <OrderDetailModal
      isOpen={true}
      orderId={orderId}
      onClose={() => dispatch(closeOrderModal())}
    />
    </div>

  );
};

export default GlobalOrderModal;