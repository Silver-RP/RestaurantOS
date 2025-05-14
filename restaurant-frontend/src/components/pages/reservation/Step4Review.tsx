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
    <div className="bg-bodyBackground text-white py-4 px-4 flex items-center justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-2xl mb-10 text-center text-secondaryColor uppercase tracking-wide">
          Thông tin đặt bàn
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Sidebar (Thông tin) */}
          <div className="w-full lg:w-1/3">
            <Sidebar formData={formData} />
          </div>

          {/* Section (Món ăn) */}
          <div className="w-full lg:w-2/3">
            <Section menuItems={formData.selectedItems} />
          </div>
        </div>

        {/* Nút xác nhận nằm cuối */}
        <div className="flex justify-center mt-10 gap-6">
          <ButtonComponents
            variant="outline"
            size="medium"
            onClick={onBack}
            className="px-8 py-3 text-sm sm:text-base border-2 border-secondaryColor hover:bg-secondaryColor hover:text-black transition"
          >
            Quay lại
          </ButtonComponents>
          <ButtonComponents
            variant="filled"
            size="medium"
            onClick={onNext}
            className="px-8 py-3 text-sm sm:text-base shadow-lg bg-secondaryColor hover:opacity-90"
          >
            Xác nhận đặt bàn
          </ButtonComponents>
        </div>
      </div>
    </div>
  );
};

export default Step4Review;
