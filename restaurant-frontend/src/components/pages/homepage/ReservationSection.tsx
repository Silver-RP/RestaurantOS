import React from 'react';
import { FaDiamond } from 'react-icons/fa6';
import ButtonComponents from '../../common/ButtonComponents';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/useIsMobile';

const ReservationSection: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile(768);

  const handleReservationClick = () => {
    navigate('/reservation');
  };

  // Dynamic style dựa theo mobile
  const bgHeight = isMobile ? 'h-[320px]' : 'h-[460px]';
  const iconSize = isMobile ? 'w-6 h-6 mb-2' : 'w-10 h-10 mb-4';
  const titleSize = isMobile ? 'text-2xl my-2' : 'text-5xl my-6';
  const subTitleSize = isMobile ? 'text-[9px] mb-3' : 'text-base mb-6';
  const descSize = isMobile ? 'text-[10px] max-w-[260px]' : 'text-sm max-w-xl';
  const buttonSize = isMobile
    ? 'max-w-[140px] text-[10px]'
    : 'max-w-[200px] text-base';

  return (
    <div
      className={`relative mx-auto bg-cover bg-center ${bgHeight} px-3 sm:px-6`}
      style={{ backgroundImage: `url("assets/images/Baccont.png")` }}
    >
      <div className="relative flex items-center justify-center h-full text-white text-center">
        <div className="w-full flex flex-col items-center">
          {/* Icon */}
          <img
            src="assets/images/Icon.svg"
            alt="Icon"
            className={`mx-auto ${iconSize}`}
          />

          {/* Tiêu đề */}
          <h1 className={`font-restora font-medium ${titleSize}`}>Đặt Bàn</h1>

          {/* Sub heading */}
          <h2
            className={`flex justify-center items-center font-sans font-extralight uppercase tracking-widest text-secondaryColor ${subTitleSize}`}
          >
            <FaDiamond className="inline mr-2" style={{ fontSize: '6px' }} />
            BÀN ĂN CỦA BẠN
            <FaDiamond className="inline ml-2" style={{ fontSize: '6px' }} />
          </h2>

          {/* Mô tả */}
          <p className={`mx-auto leading-relaxed ${descSize}`}>
            Hãy trải nghiệm tinh hoa ẩm thực Pháp, nơi hương vị nguyên bản của
            các nguyên liệu được tôn vinh và mở ra những hành trình khám phá ẩm
            thực đầy cảm hứng.
          </p>

          {/* Button */}
          <div className="mx-auto w-full mt-10 " aria-label="Book a Table">
            <ButtonComponents
              variant="filled"
              size="large"
              onClick={handleReservationClick}
              className="max-width-[200px] text-xs sm:text-sm md:text-base uppercase font-normal"
            >
              Đặt Bàn Ngay
            </ButtonComponents>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationSection;
