import React from 'react';
import { FaDiamond } from 'react-icons/fa6';
import ButtonComponents from '../../common/ButtonComponents';
import { useNavigate } from 'react-router-dom';

const ReservationSection: React.FC = () => {
  const navigate = useNavigate();

  const handleReservationClick = () => {
    navigate('/reservation');
  };
  return (
    <div
      className="relative mx-auto bg-cover bg-center h-[250px] sm:h-[300px] md:h-[460px]"
      style={{ backgroundImage: `url("assets/images/Baccont.png")` }}
    >
      <div className="relative flex items-center w-full justify-center h-full text-white text-center px-4">
        <div className="w-full">
          <img
            src="assets/images/Icon.svg"
            alt="Icon"
            className="mx-auto mb-4 w-10 h-10 sm:w-12 sm:h-12"
          />

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-restora font-medium my-6 ">
            Đặt Bàn
          </h1>
          <h2 className="text-xs sm:text-sm md:text-base flex justify-center items-center  font-sans font-extralight uppercase tracking-widest mb-6 text-secondaryColor">
            <FaDiamond className="inline mr-2" style={{ fontSize: '7px' }} />
            BÀN ĂN CỦA BẠN
            <FaDiamond className="inline ml-2" style={{ fontSize: '7px' }} />
          </h2>

          <p className="text-[10px] sm:text-xs md:text-sm max-w-sm sm:max-w-xl mx-auto leading-relaxed">
            Hãy trải nghiệm tinh hoa ẩm thực Pháp, nơi hương vị nguyên bản của
            các nguyên liệu được tôn vinh và mở ra những hành trình khám phá ẩm
            thực đầy cảm hứng.
          </p>
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
