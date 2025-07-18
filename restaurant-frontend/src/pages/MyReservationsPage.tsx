import React, { useEffect, useState } from 'react';
import { IReservation } from '@/types/Reservation.type';
import Container from '@/components/common/Container';
import { useReservations } from '@/hooks/useReservations';
import BreadcrumbComponent from '@/components/common/BreadCrumbComponents';
import ReservationCard from '@/components/pages/myreservation/ReservationCard';
import ReservationDetailModal from '@/components/pages/myreservation/ReservationDetailModal';
import NavigationReservation, { reservationStatusMapping } from '@/components/pages/myreservation/NavigationReservation';
import { FaHome, FaUserCircle } from 'react-icons/fa';
import 'react-confirm-alert/src/react-confirm-alert.css';

const MyReservationsPage: React.FC = () => {
  const { getMyReservations, updateReservationStatus } = useReservations();
  const [reservations, setReservations] = useState<IReservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [page, setPage] = useState(1);
  const limit = 5;

  const fetchReservations = async () => {
    setLoading(true);
    const statuses = reservationStatusMapping[activeTab];
    const data = await getMyReservations({ status: statuses, page, limit });
    if (data) {
        setReservations(data.reservations || []);
      }
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, [activeTab, page]);
  const handleCancel = async (reservationId: string) => {
    setLoading(true);
    await updateReservationStatus(reservationId, 'CANCELLED');
    await fetchReservations(); // reload lại danh sách sau khi hủy
    setLoading(false);
  };

  return (
    <>
  <BreadcrumbComponent />
  <Container>
    <div className="w-full mx-auto min-h-[600px)] py-10 text-white space-y-6">
      <NavigationReservation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setPage(1);
        }}
      />

      {loading ? (
        <p className="text-center text-gray-300">Đang tải...</p>
      ) : reservations.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-full py-24">
          <span className="text-5xl mb-4">📭</span>
          <p className="text-gray-400 text-lg">
            Bạn chưa có đơn đặt bàn nào.
          </p>
        </div>
      ) : (
        <div className="space-y-8 w-full mx-auto">
          {reservations.map((res) => (
            <ReservationCard
            key={res._id}
            reservation={res}
            onView={() => setSelectedId(res._id!)}
            onCancel={() => handleCancel(res._id!)}
          />
          ))}
        </div>
      )}

      {/* Thêm phần này ở dưới */}
      <div className="flex items-center gap-6 pt-10 text-sm">
        <a
          href="/profile"
          className="flex items-center gap-2 hover:underline text-white/70"
        >
          <FaUserCircle />
          <span>Quay lại Tài khoản</span>
        </a>
        <a
          href="/"
          className="flex items-center gap-2 hover:underline text-white/70"
        >
          <FaHome />
          <span>Trang chủ</span>
        </a>
      </div>
    </div>
  </Container>

  {selectedId && (
    <ReservationDetailModal
      reservationId={selectedId}
      onClose={() => setSelectedId(null)}
    />
  )}
</>
  );
};

export default MyReservationsPage;