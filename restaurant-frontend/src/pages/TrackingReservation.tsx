import TrackingReservationForm from '../components/pages/trackingReservation/Index';
import TrackingReservationResult from '../components/pages/trackingReservation/TrackingReservationResult';
import { useSearchParams } from 'react-router-dom';
import React from 'react';

const TrackingReservationPage = () => {
  const [searchParams] = useSearchParams();
  const hasQuery =
    searchParams.get('reservationCode') && searchParams.get('phone');

  return (
    <div>
      {hasQuery ? (
        <TrackingReservationResult
          reservation={yourReservationData}
          onView={() => {}}
          onCancel={() => {}}
        />
      ) : (
        <TrackingReservationForm />
      )}
    </div>
  );
};

export default TrackingReservationPage;
