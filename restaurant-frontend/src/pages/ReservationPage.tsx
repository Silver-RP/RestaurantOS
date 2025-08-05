import React, { useEffect, useState, useRef } from 'react';
import Step1BasicInfo from '@components/pages/reservation/Step1BasicInfo';
import Step2Seating from '@components/pages/reservation/Step2Seating';
import Step3Menu from '@components/pages/reservation/Step3Menu';
import Step4Review from '@/components/pages/reservation/Step4Review';
import Step5Deposit from '@/components/pages/reservation/Step5Deposit';
import { ReservationFormData } from '../types/Reservation.type';
import ReservationSteps from '@components/pages/reservation/ReservationSteps';
import { confirmAlert } from 'react-confirm-alert';
import ButtonComponents from '@/components/common/ButtonComponents';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { releaseTableApi } from '@/api/TableReservationApi';

const steps = [
  { label: 'Thông tin', step: 1 },
  { label: 'Vị trí ngồi', step: 2 },
  { label: 'Menu', step: 3 },
  { label: 'Review', step: 4 },
  { label: 'Đặt cọc', step: 5 },
];

const ReservationPage: React.FC = () => {
  const navigate = useNavigate();
  // const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [, setPaymentMethod] = useState<string>('');
  const getInitialFormData = (): ReservationFormData => {
    const saved = localStorage.getItem('reservation-data');
    if (saved) {
      const parsed = JSON.parse(saved);
      const expired = Date.now() - parsed.timestamp > 60 * 60 * 1000;
      if (!expired) return parsed.formData;
    }
    return {
      full_name: '',
      phone: '',
      email: '',
      date: '',
      time: '',
      number_of_people: 0,
      note: '',
      table_type: '',
      seatingName: '',
      tableCategory: '',
      menu: '',
      selectedItems: [],
    };
  };

  const [formData, setFormData] =
    useState<ReservationFormData>(getInitialFormData());
  const [step, setStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (formData.table_type && step < 6) {
        try {
          await releaseTableApi({ table_code: formData.seatingName });
          console.log(
            'Đã tự động release bàn khi user thoát:',
            formData.seatingName,
          );
        } catch (error) {
          console.error('Lỗi khi release bàn:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formData.table_type, formData.seatingName, step]);

  useEffect(() => {
    const saved = localStorage.getItem('reservation-data');
    if (saved) {
      const parsed = JSON.parse(saved);
      const expired = Date.now() - parsed.timestamp > 60 * 1000;
      const hasInfo =
        parsed.formData?.full_name ||
        parsed.formData?.phone ||
        parsed.formData?.email ||
        parsed.formData?.selectedItems?.length > 0;

      if (!expired && hasInfo) {
        confirmAlert({
          overlayClassName: 'custom-overlay',
          customUI: ({ onClose }) => (
            <div className="px-2">
              <div className="custom-ui bg-headerBackground text-secondaryColor p-4 sm:p-6 shadow-md max-w-lg mx-auto text-center">
                <h2 className="text-lg sm:text-xl mb-3 sm:mb-4">
                  Khôi phục thông tin đặt bàn
                </h2>
                <p className="text-sm sm:text-base mb-5 sm:mb-6">
                  Hệ thống phát hiện bạn có thông tin đặt bàn được lưu gần đây.{' '}
                  <br />
                  Bạn muốn tiếp tục với dữ liệu đã lưu hay bắt đầu đặt mới?
                </p>
                <div className="flex justify-center gap-4">
                  <ButtonComponents
                    variant="outline"
                    size="small"
                    onClick={() => {
                      localStorage.removeItem('reservation-data');
                      setFormData({
                        full_name: '',
                        phone: '',
                        email: '',
                        date: '',
                        time: '',
                        number_of_people: 0,
                        note: '',
                        table_type: '',
                        seatingName: '',
                        tableCategory: '',
                        menu: '',
                        selectedItems: [],
                      });
                      onClose();
                    }}
                    className="px-4 sm:px-6 py-2 text-sm sm:text-base rounded-none border-secondaryColor"
                  >
                    Bắt đầu mới
                  </ButtonComponents>

                  <ButtonComponents
                    variant="filled"
                    size="small"
                    onClick={() => {
                      setFormData(parsed.formData);
                      if (parsed.step && typeof parsed.step === 'number') {
                        setStep(parsed.step);
                      } else {
                        setStep(1);
                      }
                      onClose();
                    }}
                    className="px-4 sm:px-6 py-2 text-sm sm:text-base rounded-none"
                  >
                    Tiếp tục đặt bàn
                  </ButtonComponents>
                </div>
              </div>
            </div>
          ),
        });
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      formData,
      step,
      timestamp: Date.now(),
    };
    localStorage.setItem('reservation-data', JSON.stringify(dataToSave));
  }, [formData, step]);
  return (
    <>
      <div
        ref={containerRef}
        className="bg-bodyBackground text-white pt-6 sm:pt-8"
      >
        <div className="max-w-[1200px] w-full mx-auto text-center pb-6 sm:pb-8">
          <ReservationSteps step={step} steps={steps} />

          {step === 1 && (
            <Step1BasicInfo
              formData={formData}
              setFormData={setFormData}
              onNext={() => {
                setStep(2);
                containerRef.current?.scrollTo(0, 0);
              }}
            />
          )}

          {step === 2 && (
            <Step2Seating
              formData={formData}
              setFormData={setFormData}
              onNext={() => {
                setStep(3);
                containerRef.current?.scrollTo(0, 0);
              }}
              onBack={() => {
                setStep(1);
                containerRef.current?.scrollTo(0, 0);
              }}
            />
          )}

          {step === 3 && (
            <Step3Menu
              formData={formData}
              setFormData={setFormData}
              onNext={() => {
                setStep(4);
                containerRef.current?.scrollTo(0, 0);
              }}
              onBack={() => {
                setStep(2);
                containerRef.current?.scrollTo(0, 0);
              }}
            />
          )}

          {step === 4 && (
            <Step4Review
              formData={formData}
              setFormData={setFormData}
              onNext={() => {
                setStep(5);
                containerRef.current?.scrollTo(0, 0);
              }}
              onBack={() => {
                setStep(3);
                containerRef.current?.scrollTo(0, 0);
              }}
            />
          )}

          {step === 5 && (
            <Step5Deposit
              formData={formData}
              onSuccess={() => {
                setStep(6);
                containerRef.current?.scrollTo(0, 0);
              }}
              onBack={() => {
                setStep(4);
                containerRef.current?.scrollTo(0, 0);
              }}
              onPaymentMethodChange={(method) => setPaymentMethod(method || '')}
            />
          )}

          {step === 6 && (
            <div className="text-center py-16 sm:py-24 px-4 bg-bodyBackground">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 150 }}
                className="text-green-500 mb-4 flex justify-center"
              >
                <AiOutlineCheckCircle size={72} />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Đặt bàn thành công!
              </h2>
              <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto mb-6">
                Cảm ơn bạn đã đặt bàn. Chúng tôi sẽ liên hệ để xác nhận lại
                trạng thái. Vui lòng kiểm tra email hoặc lịch sử đặt bàn để theo
                dõi trạng thái.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <ButtonComponents
                  onClick={() => navigate('/menu?sort=categoryAZ')}
                  className="bg-secondaryColor hover:bg-secondaryColor/90 text-black font-semibold px-6 py-2"
                >
                  Tiếp tục đặt món
                </ButtonComponents>

                <ButtonComponents
                  onClick={() => navigate('/profile/my-reservation')}
                  className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 font-semibold px-6 py-2"
                >
                  Lịch sử đặt bàn
                </ButtonComponents>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReservationPage;
