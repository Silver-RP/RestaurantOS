import React, { useEffect, useState } from 'react';
import Step1BasicInfo from '@components/pages/reservation/Step1BasicInfo';
import BreadcrumbComponent from '@components/common/BreadCrumbComponents';
import ShowcaseSection from '@components/common/ShowcaseSection';
import Step2Seating from '@components/pages/reservation/Step2Seating';
import Step3Menu from '@components/pages/reservation/Step3Menu';
import Step4Review from '@/components/pages/reservation/Step4Review';
import { ReservationFormData } from '@/types/reservation.type';
import ReservationSteps from '@/components/pages/reservation/ReservationSteps';
import { confirmAlert } from 'react-confirm-alert';
import ButtonComponents from '@/components/common/ButtonComponents';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { toastService } from '@/utils/toastService';
const steps = [
  { label: 'Thông tin', step: 1 },
  { label: 'Vị trí ngồi', step: 2 },
  { label: 'Menu', step: 3 },
  { label: 'Reiview', step: 4 },
];

const ReservationPage: React.FC = () => {
  const navigate = useNavigate();
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
      number_of_people: 1,
      note: '',
      table_type: '',
      seatingName: '',
      menu: '',
      selectedItems: [],
    };
  };
  const currentUser = useSelector((state: RootState) => state.user.user);
  useEffect(() => {
    if (!currentUser?._id) {
      toastService.warning('Vui lòng đăng nhập để đặt bàn');
      navigate('/');
    }
  }, [currentUser, navigate]);

  const [formData, setFormData] =
    useState<ReservationFormData>(getInitialFormData());
  const [step, setStep] = useState(1);
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
            <div className="custom-ui bg-headerBackground text-secondaryColor p-6 shadow-md max-w-md mx-auto text-center">
              <h2 className="text-xl mb-4">Khôi phục dữ liệu?</h2>
              <p className="mb-6">
                Bạn còn giữ thông tin đặt bàn trước đó. <br /> Bạn có muốn sử
                dụng lại không?
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
                      number_of_people: 1,
                      note: '',
                      table_type: '',
                      seatingName: '',
                      menu: '',
                      selectedItems: [],
                    });
                    onClose();
                  }}
                  className="px-6 py-2 rounded-none border-secondaryColor"
                >
                  Tạo mới
                </ButtonComponents>

                <ButtonComponents
                  variant="filled"
                  size="small"
                  onClick={() => {
                    setFormData(parsed.formData);
                    onClose();
                  }}
                  className="px-6 py-2 rounded-none"
                >
                  Sử dụng lại
                </ButtonComponents>
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
      timestamp: Date.now(),
    };
    localStorage.setItem('reservation-data', JSON.stringify(dataToSave));
  }, [formData]);
  return (
    <>
      <BreadcrumbComponent />
      <div className="bg-bodyBackground text-white pt-16">
        <div className="max-w-[1200px] w-full mx-auto text-center pb-10">
          <ReservationSteps step={step} steps={steps} />
          {step === 1 && (
            <Step1BasicInfo
              formData={formData}
              setFormData={setFormData}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <Step2Seating
              formData={formData}
              setFormData={setFormData}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <Step3Menu
              formData={formData}
              setFormData={setFormData}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && (
            <Step4Review
              formData={formData}
              setFormData={setFormData}
              onNext={() => setStep(5)}
              onBack={() => setStep(3)}
            />
          )}
          {step === 5 && (
            <div className="text-center py-20">
              <h2 className="text-3xl font-semibold text-green-400 mb-4">
                🎉 Đặt bàn thành công!
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Cảm ơn bạn đã đặt bàn. Chúng tôi sẽ liên hệ với bạn để xác nhận
                lại trong thời gian sớm nhất.
              </p>
              <ButtonComponents
                variant="filled"
                size="medium"
                onClick={() => navigate('/')}
                className="px-6 py-2"
              >
                Quay về trang chủ
              </ButtonComponents>
            </div>
          )}
        </div>
        <ShowcaseSection />
      </div>
    </>
  );
};

export default ReservationPage;
