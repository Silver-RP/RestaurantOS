import React from 'react';
import ButtonComponents from '@components/common/ButtonComponents';
import { ReservationFormData } from '../../../types/reservation.type';
import { FilledStar, EmptyStar } from '../../common/StarIcons'; 
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

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
];

const renderStars = (count: number) => {
  return (
    <div className="flex gap-[1px]">
      {[...Array(5)].map((_, i) =>
        i < count ? <FilledStar key={i} /> : <EmptyStar key={i} />
      )}
    </div>
  );
};



const Step2Seating: React.FC<Step2SeatingProps> = ({ formData, setFormData, onNext, onBack }) => {
  const handleSelect = (id: string, name: string) => {
    setFormData((prev) => ({ ...prev, table_type: id, seatingName: name, }));
  };
  const handleNextClick = () => {
    if (!formData.table_type) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <h1>Thông báo</h1>
              <p>Vui lòng chọn vị trí ngồi trước khi tiếp tục.</p>
              <button onClick={onClose}>OK</button>
            </div>
          );
        },
        overlayClassName: 'custom-overlay',
      });
    } else {
      onNext();
    }
  };

  return (
    <div className="max-w-[1200px] w-full mx-auto text-white py-8 px-4">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {seatingOptions.map((option) => (
      <div
        key={option.id}
        className={`flex bg-white/5 overflow-hidden rounded-lg shadow-xl border 
          ${formData.table_type === option.id ? 'border-secondaryColor' : 'border-transparent'}
          transition-all duration-300 hover:scale-[1.01]`}
      >
        <div className="xl:w-[300px] lg:w-[240px] w-[120px] h-[250px] shrink-0">
          <img
            src={option.image}
            alt={option.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between p-4 flex-1">
          <div className='text-left'>
            
            <h4 className="text-xl mb-3">{option.name}</h4>
            <p className="text-sm text-gray-300 mb-1">Số khách: {option.guests}</p>

            <div className="text-sm text-gray-300 flex items-center gap-2 mb-1">
              View: {renderStars(option.view)}
            </div>
            <div className="text-sm text-gray-300 flex items-center gap-2 mb-1">
              Chụp ảnh: {renderStars(option.photo)}
            </div>
            <div className="text-sm text-gray-300 flex items-center gap-2 mb-1">
              Độ riêng tư: {renderStars(option.privacy)}
            </div>
            <p className="text-green-400 text-sm text-left font-semibold mt-3 mb-1">Còn bàn</p>
          </div>

          <div className="mt-3">
            
            <ButtonComponents
              variant={formData.table_type === option.id ? 'selected' : 'filled'}
              size="small"
              onClick={() => handleSelect(option.id,  option.name)}
              className="w-full"
            >
              {formData.table_type === option.id ? 'Đã chọn' : 'Chọn'}
            </ButtonComponents>
          </div>
        </div>
      </div>
    ))}
  </div>
  <div className="flex justify-between mt-8">
    <ButtonComponents variant="outline" size="small" onClick={onBack}>
      Quay lại
    </ButtonComponents>
    <ButtonComponents
      variant="filled"
      size="small"
      onClick={handleNextClick}
    >
      Tiếp tục
    </ButtonComponents>
  </div>
</div>
  );
};

export default Step2Seating;
