import React from 'react';

interface Step {
  label: string;
  step: number;
}

interface ReservationStepsProps {
  step: number;
  steps: Step[];
}

const ReservationSteps: React.FC<ReservationStepsProps> = ({ step, steps }) => {
  return (
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
  );
};

export default ReservationSteps;