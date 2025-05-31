import React, { useEffect, useState } from 'react';
import { getReservationByIdApi } from '@/api/ReservationApi';
import { IReservationDetail } from '@/types/reservation.type';
import Modal from "../../common/ModalComponents";

interface Props {
  reservationId: string;
  onClose: () => void;
}

const ReservationDetailModal: React.FC<Props> = ({ reservationId, onClose }) => {
  const [details, setDetails] = useState<IReservationDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getReservationByIdApi(reservationId);
        setDetails(data.details || []);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [reservationId]);

  return (
    <Modal isOpen={true} title="Chi tiết món đã chọn" onClose={onClose}>
      {loading ? (
        <p>Đang tải...</p>
      ) : details.length === 0 ? (
        <p>Không có món nào được chọn.</p>
      ) : (
        <ul className="space-y-3">
          {details.map((item, idx) => (
            <li key={idx} className="border-b border-gray-600 pb-2">
              <p><strong>{item.dish_name}</strong> ({item.category})</p>
              <p>Số lượng: {item.quantity}</p>
              <p>Giá mỗi món: {item.unit_price.toLocaleString()} đ</p>
              <p>Ghi chú: {item.note || '—'}</p>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default ReservationDetailModal;