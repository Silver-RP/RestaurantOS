import React from 'react';
import Sidebar from './Sidebar';
import Section from './Section';
import ButtonComponents from '../../common/ButtonComponents';
import { ReservationFormData } from '@/types/ReservationFormData.type';

interface Step4ReviewProps {
  formData: ReservationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReservationFormData>>;
  onBack: () => void;
  onNext: () => void;
}

const Step4Review: React.FC<Step4ReviewProps> = ({ formData, onNext, onBack }) => {
  return (
    <div className="min-h-screen bg-[#012B40] text-white py-8 px-4 flex items-center justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Thông tin đặt bàn</h1>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <Sidebar formData={formData} />
          <Section menuItems={formData.selectedItems} />
        </div>

        {/* Nút xác nhận nằm ngoài phần Section để căn giữa màn hình */}
        <div className="flex justify-center mt-6 gap-4">
          <ButtonComponents
            variant="outline"
            size="large"
            onClick={onBack}
            className="px-6 sm:px-8 py-3 rounded-none text-sm sm:text-base"
          >
            Quay lại
          </ButtonComponents>
          <ButtonComponents
            variant="filled"
            size="large"
            onClick={onNext}
            className="px-6 sm:px-8 py-3 rounded-none text-sm sm:text-base"
          >
            Xác nhận đặt bàn
          </ButtonComponents>
        </div>
      </div>
    </div>
  );
};

export default Step4Review;
