import React from 'react';
import ButtonComponents from '@components/common/ButtonComponents';
import { ReservationFormData } from '../../../types/ReservationFormData.type';

interface Step2SeatingProps {
  formData: ReservationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReservationFormData>>;
  onNext: () => void;
  onBack: () => void;
}

const seatingOptions = [
    {
      id: 'standard-hall',
      name: 'Bàn tiêu chuẩn',
      available: true,
      guests: '2 - 4 khách',
      view: 3,
      privacy: 3,
      photo: 4,
      image: '/assets/images/reservation/thiet-ke-nha-hang-su-buffet0.jpg',
    },
    {
      id: 'random-table',
      name: 'Bàn ngẫu nhiên',
      available: true,
      guests: '2 - 20 khách',
      view: 3,
      privacy: 2,
      photo: 4,
      image: '/assets/images/reservation/n-m-ngay-t-i-t-ng-1-khach.jpg',
    },
    {
      id: 'table-4-10',
      name: 'Bàn dành cho nhóm',
      available: true,
      guests: '4 - 10 khách',
      view: 3,
      privacy: 2,
      photo: 4,
      image: '/assets/images/reservation/1.webp',
    },
    {
      id: 'vip-room',
      name: 'Phòng VIP',
      available: true,
      guests: '2 - 20 khách',
      view: 5,
      privacy: 4,
      photo: 4,
      image: '/assets/images/reservation/thumb.png',
    },
  ];

const Step2Seating: React.FC<Step2SeatingProps> = ({ formData, setFormData, onNext, onBack }) => {
  const handleSelect = (id: string) => {
    setFormData((prev) => ({ ...prev, seating: id }));
  };

  return (
    <div className="max-w-[900px] w-full mx-auto text-white py-8">

      <div className="grid sm:grid-cols-2 gap-6">
        {seatingOptions.map((option) => (
          <div
            key={option.id}
            className={`bg-white/5 p-4 rounded-lg shadow-md ${
              formData.seating === option.id ? 'ring-2 ring-secondaryColor' : ''
            }`}
          >
            <div className="flex flex-col gap-4">
              <img
                src={option.image}
                alt={option.name}
                className="w-full h-[200px] object-cover rounded"
              />
              <div className="flex-1 text-left">
                <p className="text-green-400 text-sm font-semibold">Còn bản</p>
                <h4 className="text-lg font-bold mb-1">{option.name}</h4>
                <p className="text-sm mb-1 text-gray-300">Số khách: {option.guests}</p>
                <p className="text-sm mb-1 text-gray-300">View: {'⭐'.repeat(option.view)}</p>
                <p className="text-sm mb-1 text-gray-300">Độ riêng tư: {'⭐'.repeat(option.privacy)}</p>
                <p className="text-sm mb-1 text-gray-300">Chụp ảnh: {'⭐'.repeat(option.photo)}</p>
                {option.note && (
                  <p className="text-sm italic text-gray-400 mt-2">{option.note}</p>
                )}
                <div className="mt-4 flex gap-2">
                  <ButtonComponents
                    variant="filled"
                    size="small"
                    onClick={() => handleSelect(option.id)}
                  >
                    {formData.seating === option.id ? 'Đã chọn' : 'Chọn'}
                  </ButtonComponents>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <ButtonComponents variant="outlined" size="small" onClick={onBack}>
          Quay lại
        </ButtonComponents>
        <ButtonComponents
          variant="filled"
          size="small"
          onClick={onNext}
          disabled={!formData.seating}
        >
          Tiếp tục
        </ButtonComponents>
      </div>
    </div>
  );
};

export default Step2Seating;
