import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import TrackingReservationForm from '../components/pages/trackingReservation/Index';
import TrackingReservationResult from '../components/pages/trackingReservation/TrackingReservationResult';
import { useSearchParams } from 'react-router-dom';


const TrackingReservationPage = () => {
  const [searchParams] = useSearchParams();
  const hasQuery = searchParams.get('reservationCode') && searchParams.get('phone');

  return (
    <div>
      <BreadCrumbComponents />
      {hasQuery ? <TrackingReservationResult /> : <TrackingReservationForm />}
    </div>
  );
};

export default TrackingReservationPage;
