import React from 'react';
import { GoGift } from "react-icons/go";
import { FaDiamond } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const PromotionSection: React.FC = () => {
  return (
    <div
      className="relative mx-auto bg-cover bg-center h-[250px] sm:h-[300px] md:h-[460px]"
      style={{ backgroundImage: `url("assets/images/Baccont.png")` }}
    >
      <div className="relative flex flex-col items-center w-full justify-center h-full text-white text-center px-4">
        <div className="w-full max-w-6xl mx-auto">
          <GoGift className="mx-auto mb-3 text-3xl md:text-4xl text-secondaryColor" />
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-3 tracking-wide font-restora">
            Chương trình khuyến mãi
          </h2>
          <div className="text-xs sm:text-sm md:text-base flex justify-center items-center font-sans font-extralight uppercase tracking-widest mb-6 text-secondaryColor">
            <FaDiamond className="inline mr-2" style={{ fontSize: "7px" }} />
             Ưu đãi hấp dẫn dành cho bạn
            <FaDiamond className="inline ml-2" style={{ fontSize: "7px" }} />
          </div>
          <p className="text-[12px] sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed text-gray-200 mb-8">
            Đừng bỏ lỡ các mã giảm giá và ưu đãi đặc biệt từ nhà hàng! Sử dụng ngay để tiết kiệm và tận hưởng trải nghiệm ẩm thực tuyệt vời cùng bạn bè và người thân.
          </p>
          <Link
            to="/vouchers"
            className="px-5 py-2 sm:px-8 sm:py-3 md:px-10 md:py-4 bg-transparent border border-secondaryColor text-secondaryColor hover:bg-secondaryColor hover:text-headerBackground transition font-semibold text-base md:text-lg tracking-wide animate-fade-down"
          >
            KHÁM PHÁ NGAY
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PromotionSection; 