import React, { useState } from 'react';
import Step1BasicInfo from '@components/pages/reservation/Step1BasicInfo';
import BreadcrumbComponent from '@components/common/BreadCrumbComponents';
import ShowcaseSection from '@components/common/ShowcaseSection';
import Step2Seating from '@components/pages/reservation/Step2Seating';
import Step3Menu from '@components/pages/reservation/Step3Menu';
import Step4Review from '@/components/pages/reservation/Step4Review';
import { ReservationFormData } from '@/types/ReservationFormData.type';
const steps = [
  { label: 'Thông tin', step: 1 },
  { label: 'Vị trí ngồi', step: 2 },
  { label: 'Menu', step: 3 },
  { label: 'Reiview', step: 4 },
];

const ReservationPage: React.FC = () => {
  const [formData, setFormData] = useState<ReservationFormData>({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    people: 1,
    note: '',
    seating: '',
    menu: '',
    selectedItems: [],
  });
  const [step, setStep] = useState(1);

  return (
    <>
      <BreadcrumbComponent />
      <div className="bg-bodyBackground text-white pt-16">
        <div className="max-w-[1200px] w-full mx-auto text-center pb-10">
          <div className="w-full flex justify-between items-center px-4 sm:px-10 mb-10 relative">
            {steps.map((s, index) => {
              const isCompleted = step > s.step;
              const isActive = step === s.step;

              return (
                <div
                  key={s.step}
                  className="flex-1 flex flex-col items-center text-center relative group transition-all duration-300"
                >
                  <div
                    className={`
            w-8 h-8 flex items-center justify-center bg-bodyBackground z-20 rounded-full border-2 
            transition-all duration-500 transform 
            ${isCompleted ? 'bg-secondaryColor text-black border-secondaryColor scale-100' : ''}
            ${isActive ? 'border-secondaryColor text-secondaryColor scale-110 shadow-lg' : ''}
            ${!isCompleted && !isActive ? 'border-white/40 text-white/40 scale-95' : ''}
          `}
                  >
                    {isCompleted ? '✓' : s.step}
                  </div>

                  <div
                    className={`text-sm mt-2 font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-secondaryColor'
                        : isCompleted
                          ? 'text-white'
                          : 'text-white/50'
                    }`}
                  >
                    {s.label}
                  </div>

                  <div
                    className={`text-xs mt-1 transition-all duration-300 ${
                      isCompleted
                        ? 'text-green-400'
                        : isActive
                          ? 'text-secondaryColor'
                          : 'text-white/40'
                    }`}
                  >
                    <div
                      className={`text-xs mt-1 transition-all duration-300 hidden sm:block ${
                        isCompleted
                          ? 'text-green-400'
                          : isActive
                            ? 'text-secondaryColor'
                            : 'text-white/40'
                      }`}
                    >
                      {isCompleted
                        ? 'Đã xong'
                        : isActive
                          ? 'Đang thực hiện'
                          : 'Chưa thực hiện'}
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className="absolute top-4 left-1/2 right-[-50%] h-[2px] z-0"
                      style={{
                        backgroundColor:
                          step > s.step
                            ? '#FFDEA0'
                            : 'rgba(255, 255, 255, 0.2)',
                        width: '100%',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
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
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}
        </div>
        <ShowcaseSection />
      </div>
    </>
  );
};

export default ReservationPage;
