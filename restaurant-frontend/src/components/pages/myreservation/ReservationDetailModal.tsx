import React, { useEffect, useState } from 'react';
import { getReservationByIdApi } from '@/api/ReservationApi';
import { IReservationDetail } from '@/types/Reservation.type';
import GlobalModal from '../../common/GlobalModal';
import { HiOutlineClipboardList } from 'react-icons/hi';

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
    <GlobalModal>
      <div className="relative bg-headerBackground border-2 border-secondaryColor rounded-2xl shadow-2xl w-full max-w-2xl p-0 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-secondaryColor text-headerBackground text-2xl font-bold shadow cursor-pointer transition z-10 hover:bg-secondaryColor/90"
          aria-label="Đóng"
        >
          ×
        </button>

        {/* Header */}
        <div className="px-8 py-6 text-white font-serif text-center border-b border-secondaryColor/30">
          <h2 className="text-3xl text-secondaryColor mb-2 font-serif tracking-wide">
            Chi tiết món đã chọn
          </h2>
          <p className="text-white/80 text-sm">
            Danh sách các món ăn đã đặt cho bàn này
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-6 max-h-[60vh] overflow-y-auto scrollbar-custom">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondaryColor mb-4"></div>
              <p className="text-white/80 text-base font-medium">
                Đang tải thông tin...
              </p>
            </div>
          ) : (
            <>
              {details.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-white/60">
                  <HiOutlineClipboardList className="text-4xl mb-4 text-secondaryColor" />
                  <p className="text-center text-lg font-medium mb-2">
                    Không có món nào được chọn
                  </p>
                  <p className="text-center text-sm text-white/50">
                    Bạn có thể thêm món ăn khi đặt bàn
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {details.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 rounded-xl bg-bodyBackground border border-white/10 shadow-sm hover:border-secondaryColor/50 transition-all duration-300 group"
                    >
                      {/* Food Image */}
                      {item.image && (
                        <div className="w-20 h-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                          <img
                            src={item.image}
                            alt={item.dish_name}
                            className="object-cover w-full h-full rounded-lg group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      {/* Food Details */}
                      <div className="flex-grow flex flex-col justify-between min-w-0">
                        <div className="mb-3">
                          <div className="flex justify-between items-start gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-white leading-tight line-clamp-2 group-hover:text-secondaryColor transition-colors">
                              {item.dish_name}
                            </h3>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
                                SL: {item.quantity}
                              </span>
                            </div>
                          </div>

                          {item.category && (
                            <p className="text-sm text-white/60 italic mb-2">
                              {item.category}
                            </p>
                          )}

                          {item.note && (
                            <div className="mb-2">
                              <span className="text-xs text-secondaryColor font-semibold uppercase tracking-wide">
                                Ghi chú:
                              </span>
                              <p className="text-sm text-white/80 mt-1 italic">
                                {item.note}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4 text-sm">
                            <div>
                              <span className="text-white/60">Số lượng: </span>
                              <span className="font-semibold text-white">
                                {item.quantity}
                              </span>
                            </div>
                            <div>
                              <span className="text-white/60">Đơn giá: </span>
                              <span className="font-semibold text-secondaryColor">
                                {formatPrice(item.unit_price)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-white/60">
                              Thành tiền
                            </div>
                            <div className="text-lg font-bold text-secondaryColor">
                              {formatPrice(item.unit_price * item.quantity)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {details.length > 0 && (
          <div className="px-8 py-4 border-t border-secondaryColor/30 bg-bodyBackground/50">
            <div className="flex justify-between items-center">
              <div className="text-white/80">
                <span className="text-sm">Tổng cộng: </span>
                <span className="text-lg font-bold text-secondaryColor">
                  {details.length} món
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/60">Tổng giá trị</div>
                <div className="text-xl font-bold text-secondaryColor">
                  {formatPrice(
                    details.reduce(
                      (total, item) => total + item.unit_price * item.quantity,
                      0,
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </GlobalModal>
  );
};

export default ReservationDetailModal;
