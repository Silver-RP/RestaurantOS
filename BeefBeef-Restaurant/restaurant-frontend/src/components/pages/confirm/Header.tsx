import React from 'react';

const Header = () => (
  <div className="flex flex-col items-center justify-center gap-4 mb-6">
    <div className="bg-[#FFDEA0] w-14 h-14 rounded-full flex items-center justify-center mb-4">
      <span className="text-[#012B40] text-2xl font-bold">✓</span>
    </div>

    <div className="text-center">
      <h2 className="text-2xl sm:text-xl font-restora font-light text-[#FFDEA0]">
        Xác nhận đơn hàng
      </h2>
      <p className="text-sm sm:text-base text-white/80">
        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng sớm nhất.
      </p>
    </div>
  </div>
);

export default Header;
