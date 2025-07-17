import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Section from './Section';
import ButtonComponents from '../../common/ButtonComponents';
// import { useReservations } from '@/hooks/useReservations';
import { ReservationFormData } from '@/types/reservation.type';
import { toast } from 'react-toastify';

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
  // const { createReservation } = useReservations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmReservation = async () => {
    setIsSubmitting(true);
    try {
      // const reservationPayload = {
      //   full_name: formData.full_name,
      //   phone: formData.phone,
      //   email: formData.email,
      //   date: formData.date,
      //   time: formData.time,
      //   table_type: formData.table_type,
      //   number_of_people: formData.number_of_people,
      //   note: formData.note,
      //   is_choose_later: formData.selectedItems.length === 0,
      //   selectedItems: formData.selectedItems.map((item) => ({
      //     id: item.id,
      //     name: item.name,
      //     category: item.category,
      //     price: item.price,
      //     quantity: item.quantity,
      //     note: item.note,
      //   })),
      // };

      // await createReservation(reservationPayload);
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
            <Sidebar formData={formData} />
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
