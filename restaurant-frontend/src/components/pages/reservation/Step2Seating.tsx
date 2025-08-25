import React, { useEffect, useState } from 'react';
import ButtonComponents from '@components/common/ButtonComponents';
import { ReservationFormData } from '../../../types/Reservation.type';
import GlobalModal from '@components/common/GlobalModal';

interface Step2SeatingProps {
  formData: ReservationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReservationFormData>>;
  onNext: () => void;
  onBack: () => void;
}

// 4 loại bàn lấy từ TableTypeInfoModal (hình ảnh + mô tả)
const TABLE_TYPE_INFO: Record<
  string,
  { image: string; label: string; desc: string; capacity: string }
> = {
  quiet: {
    image: 'table-quiet.jpg',
    label: 'Bàn yên tĩnh',
    desc: 'Bố trí ở góc riêng tư, ít tiếng ồn, lý tưởng cho buổi gặp gỡ cần không gian riêng, trao đổi công việc hoặc hẹn hò. Ánh sáng dịu, thư giãn.',
    capacity: '2 người',
  },
  standard: {
    image: 'table-standard.jpg',
    label: 'Bàn thường',
    desc: 'Dành cho gia đình nhỏ hoặc nhóm 2–4 người. Vị trí linh hoạt, phù hợp cho bữa ăn thân mật hoặc dùng bữa hàng ngày.',
    capacity: '4 người',
  },
  group: {
    image: 'table-group.jpeg',
    label: 'Bàn nhóm',
    desc: 'Phù hợp họp mặt, sinh nhật, liên hoan. Không gian rộng rãi ở khu trung tâm, thuận tiện gọi phục vụ và di chuyển.',
    capacity: '8–10 người',
  },
  vip: {
    image: 'image.png',
    label: 'Bàn VIP',
    desc: 'Khu vực sang trọng, riêng biệt (có rèm hoặc vách). Phù hợp tiếp khách quan trọng, tiệc nhỏ/kỷ niệm đặc biệt. Dịch vụ ưu tiên.',
    capacity: '4–20 người',
  },
};

const ORDER: Array<keyof typeof TABLE_TYPE_INFO> = [
  'quiet',
  'standard',
  'group',
  'vip',
];

const Step2Seating: React.FC<Step2SeatingProps> = ({
  formData,
  setFormData,
  onNext,
  onBack,
}) => {
  const [selectedType, setSelectedType] = useState<string>(
    formData.tableCategory || '',
  );
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChooseType = (type: string) => {
    setSelectedType(type);
    setFormData((prev) => ({
      ...prev,
      table_type: '',
      seatingName: '',
      tableCategory: type,
    }));
  };

  const handleNextClick = () => {
    if (!selectedType) {
      setShowWarningModal(true);
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-5xl mx-auto text-white font-serif">
      <div className="bg-[#112233] border border-[#F9D783] rounded-xl p-6">
        <h2 className="text-2xl sm:text-3xl font-serif text-center text-[#F9D783] mb-2">
          Chọn khu vực / loại bàn
        </h2>
        <p className="text-center text-sm sm:text-base text-white/80 mb-6">
          Chọn 1 trong 4 loại bàn bên dưới. Bạn có thể xem ảnh minh họa, mô tả
          và sức chứa rồi bấm chọn trực tiếp.
        </p>

        {/* Grid 4 loại bàn có hình ảnh + mô tả */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {ORDER.map((key) => {
            const info = TABLE_TYPE_INFO[key];
            const active = selectedType === key;
            return (
              <div
                key={key}
                className={[
                  'group rounded-2xl overflow-hidden border transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-0.5 flex flex-col',
                  active
                    ? 'border-[#F9D783] ring-1 ring-[#F9D783]/60 bg-[#101a2a]'
                    : 'border-[#364556] bg-[#0e1624] hover:border-[#F9D783]/80',
                ].join(' ')}
              >
                <div className="w-full h-40 sm:h-48 overflow-hidden rounded-t-2xl">
                  <img
                    src={`/assets/images/reservation/${info.image}`}
                    alt={info.label}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="p-3 md:p-4 flex-1 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold tracking-wide text-white">
                        {info.label}
                      </div>
                      <div className="text-xs md:text-sm text-white/70 mt-1 line-clamp-3 md:line-clamp-2">
                        {info.desc}
                      </div>
                    </div>
                    {active && (
                      <span className="min-w-6 min-h-6 w-6 h-6 rounded-full bg-[#F9D783] inline-flex items-center justify-center text-[#1a2233] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-[#F9D783]/80 text-[11px] md:text-xs font-semibold text-[#F9D783] bg-[#1a2436]">
                      Sức chứa:{' '}
                      <span className="ml-1 text-white">{info.capacity}</span>
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleChooseType(key)}
                        className={[
                          'px-4 py-2 rounded-full border text-sm font-semibold tracking-wide',
                          active
                            ? 'bg-[#F9D783] text-[#1a2233] border-[#F9D783] shadow group-hover:shadow-md'
                            : 'border-[#F9D783] text-[#F9D783] hover:bg-[#F9D783] hover:text-[#1a2233] hover:shadow-md',
                        ].join(' ')}
                      >
                        {active ? 'Đã chọn' : 'Chọn loại này'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal cảnh báo khi chưa chọn loại bàn */}
      {showWarningModal && (
        <GlobalModal>
          <div className="relative bg-headerBackground border-2 border-[#F9D783] rounded-2xl shadow-2xl w-full max-w-2xl p-0 overflow-hidden">
            <button
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-[#F9D783] text-[#1a2233] text-2xl font-bold shadow cursor-pointer transition z-10"
              onClick={() => setShowWarningModal(false)}
              aria-label="Đóng"
            >
              ×
            </button>
            <div className="px-8 py-6 text-white font-serif text-center">
              <h2 className="text-3xl text-[#F9D783] mb-4 font-serif tracking-wide">
                Thông báo
              </h2>
              <p className="text-lg mb-6">
                Vui lòng chọn loại bàn trước khi tiếp tục.
              </p>
              <div className="flex justify-center mt-8">
                <ButtonComponents
                  variant="filled"
                  size="large"
                  className="w-40"
                  onClick={() => setShowWarningModal(false)}
                >
                  OK
                </ButtonComponents>
              </div>
            </div>
          </div>
        </GlobalModal>
      )}

      {/* Nút điều hướng */}
      <div className="flex justify-between mt-3 md:mt-10">
        <ButtonComponents variant="outline" size="small" onClick={onBack}>
          QUAY LẠI
        </ButtonComponents>
        <ButtonComponents
          variant="filled"
          size="small"
          onClick={handleNextClick}
        >
          TIẾP TỤC
        </ButtonComponents>
      </div>
    </div>
  );
};

export default Step2Seating;
