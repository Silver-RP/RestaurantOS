import React, { useState } from 'react';
import { ReservationFormData } from '../../../types/reservation.type';
import ButtonComponents from '@components/common/ButtonComponents';
import { toast } from 'react-toastify';
import ReservationSidebar from './Sidebar';
import Section from './Section';

interface Step4ReviewProps {
  formData: ReservationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReservationFormData>>;
  onBack: () => void;
  onNext: () => void;
}

const Step4Review: React.FC<Step4ReviewProps> = ({
  formData,
  onNext,
  onBack,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmReservation = async () => {
    setIsSubmitting(true);
    try {
      localStorage.removeItem('reservation-data');
      onNext();
    } catch (error) {
      console.error('❌ Đặt bàn thất bại:', error);
      toast.error('Có lỗi xảy ra khi đặt bàn. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bodyBackground text-white py-4 px-4 flex items-center justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-2xl mb-10 text-center text-secondaryColor uppercase tracking-wide">
          Thông tin đặt bàn
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-1/3">
            <ReservationSidebar formData={formData} />
          </div>

          <div className="w-full lg:w-2/3">
            <Section menuItems={formData.selectedItems} />
          </div>
        </div>

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
            onClick={handleConfirmReservation}
            disabled={isSubmitting}
            className="px-8 py-3 text-sm sm:text-base shadow-lg bg-secondaryColor hover:opacity-90"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt bàn'}
          </ButtonComponents>
        </div>
      </div>
    </div>
  );
};

export default Step4Review;
