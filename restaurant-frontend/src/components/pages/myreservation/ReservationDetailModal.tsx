import React, { useEffect, useState } from 'react';
import { getReservationByIdApi } from '@/api/ReservationApi';
import { IReservationDetail } from '@/types/Reservation.type';
import Modal from '../../common/ModalComponents';

interface Props {
  reservationId: string;
  onClose: () => void;
}

const ReservationDetailModal: React.FC<Props> = ({
  reservationId,
  onClose,
}) => {
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

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + ' đ';

  return (
    <Modal isOpen={true} title="Chi tiết món đã chọn" onClose={onClose}>
      <div className="text-white">
        {loading ? (
          <p className="text-center py-4">Đang tải...</p>
        ) : (
          <>
            <section className="mb-2">
              {details.length === 0 ? (
                <p className="text-center py-4 text-white/70">
                  Không có món nào được chọn.
                </p>
              ) : (
                <div className="space-y-5">
                  {details.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-[#1a3952] border border-white/10 shadow"
                    >
                      {/* Ảnh món ăn nếu có */}
                      {item.image && (
                        <div className="w-full md:w-[110px] h-[110px] shrink-0">
                          <img
                            src={item.image}
                            alt={item.dish_name}
                            className="object-cover w-full h-full rounded-md border border-white/10"
                          />
                        </div>
                      )}

                      <div className="flex-grow flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <div>
                            <p className="font-bold text-lg text-secondaryColor">
                              {item.dish_name}
                            </p>
                            {item.category && (
                              <p className="text-sm text-white/80 italic">
                                {item.category}
                              </p>
                            )}
                          </div>
                          <p className="text-sm text-white/70 min-w-[140px] text-right">
                            <span className="font-semibold">Ghi chú:</span>{' '}
                            {item.note || '—'}
                          </p>
                        </div>

                        <div className="flex flex-col md:flex-row md:gap-6 text-white/90 text-sm">
                          <div className="space-y-1 min-w-[100px]">
                            <p>
                              <span className="font-semibold">Số lượng:</span>{' '}
                              {item.quantity}
                            </p>
                            <p>
                              <span className="font-semibold">
                                Giá mỗi món:
                              </span>{' '}
                              {formatPrice(item.unit_price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ReservationDetailModal;
