import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputComponent from '../login/InputComponents';
import ButtonComponent from '../login/ButtonComponents';
import { getReservationReservationcodeAndPhoneNumber } from '@/api/ReservationApi';
import axios from 'axios';
import { toast } from 'react-toastify';

const TrackingReservationForm = () => {
  const navigate = useNavigate();
  const reservationCodeRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    reservationCode: '',
    phoneNumber: '',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.reservationCode.trim() !== '' &&
      formData.phoneNumber.trim() !== ''
    );
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    nextRef: React.RefObject<HTMLInputElement> | null,
  ) => {
    if (e.key === 'Enter' && nextRef?.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!isFormValid()) {
      setFormError('Vui lòng điền đầy đủ mã đặt bàn và số điện thoại.');
      return;
    }
  
    setFormError('');
    setIsSubmitting(true);
  
    try {
      const data = await getReservationReservationcodeAndPhoneNumber(
        formData.reservationCode.toLowerCase(),
        formData.phoneNumber,
      );

      console.log('Reservation data:', data);
  
      if (data.success === true && data.data) {
        navigate(`/reservation/lookup-reservation?reservationCode=${formData.reservationCode}&phone=${formData.phoneNumber}`);
      } else {
        setFormError('Không tìm thấy đơn đặt bàn nào với thông tin đã nhập.');
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          toast.error('Không tìm thấy đơn đặt bàn nào với thông tin đã nhập.');
        } else {
          setFormError('Có lỗi xảy ra khi tra cứu, vui lòng thử lại.');
        }
      } else {
        setFormError('Có lỗi xảy ra khi tra cứu, vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-[#012B40] via-[#014866] to-[#021D2A] w-full h-screen relative">
      <div className="px-10 py-8 text-center rounded-xl shadow-xl w-full sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-6/12 max-w-3xl border border-[#FFDEA0]/30 backdrop-blur-md bg-white/5">
        <h1 className="text-white font-bold text-3xl mb-6">
          Tra cứu đơn đặt bàn
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputComponent
            type="text"
            value={formData.reservationCode}
            placeholder="Mã đặt bàn"
            name="reservationCode"
            onChange={handleChange}
            ref={reservationCodeRef}
            onKeyDown={(e) => handleKeyDown(e, phoneRef)}
          />
          <InputComponent
            type="tel"
            value={formData.phoneNumber}
            placeholder="Số điện thoại"
            name="phoneNumber"
            onChange={handleChange}
            ref={phoneRef}
            onKeyDown={(e) => handleKeyDown(e, null)}
          />

          {formError && (
            <div className="text-red-500 text-sm text-left mt-2">
              {formError}
            </div>
          )}

          <ButtonComponent
            htmlType="submit"
            text="Kiểm tra"
            disabled={isSubmitting || !isFormValid()}
          />
        </form>
      </div>
    </div>
  );
};

export default TrackingReservationForm;
