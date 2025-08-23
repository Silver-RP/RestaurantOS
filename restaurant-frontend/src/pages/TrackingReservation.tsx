import TrackingReservationForm from '../components/pages/trackingReservation/Index';
import TrackingReservationResult from '../components/pages/trackingReservation/TrackingReservationResult';
import { useSearchParams } from 'react-router-dom';
import React from 'react';
import { getReservationReservationcodeAndPhoneNumber } from '@/api/ReservationApi';
import { IReservation } from '@/types/Reservation.type';


const TrackingReservationPage = () => {
  const [searchParams] = useSearchParams();
  const [reservation, setReservation] = React.useState<IReservation | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const code = searchParams.get('reservationCode')?.toLocaleLowerCase() || '';
  const phone = searchParams.get('phone');

  React.useEffect(() => {
    if (code && phone) {
      setLoading(true);
      getReservationReservationcodeAndPhoneNumber(code, phone)
        .then(res => setReservation(res.data))
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, [code, phone]);

  const handleCancel = (reservationId: string) => {
    // logic hủy đặt bàn ở đây
  };

  if (!code || !phone) return <TrackingReservationForm />;

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi khi tải dữ liệu đặt bàn</p>;

  if (!reservation) return null; 

  return (
    <TrackingReservationResult
      reservation={reservation}
      onView={() => {}}
      onCancel={handleCancel}
    />
  );
};


export default TrackingReservationPage;
