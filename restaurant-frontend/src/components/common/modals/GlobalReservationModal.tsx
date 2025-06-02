import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import ReservationDetailModal from '@/components/pages/myreservation/ReservationDetailModal';
import { closeReservationModal } from '@/redux/feature/modal/reservationModalSlice';


const GlobalReservationModal = () => {
  const dispatch = useDispatch();
  const { isOpen, reservationId } = useSelector(
    (state: RootState) => state.reservationModal,
  );

  if (!isOpen || !reservationId) return null;

  return (
    <div className="z-[120] fixed inset-0 bg-black bg-opacity-60">
        <ReservationDetailModal
      reservationId={reservationId}
      onClose={() => dispatch(closeReservationModal())}
    />
    </div>

  );
};

export default GlobalReservationModal;