import React from 'react';

const OrderDetails = () => (
  <div className="border border-[#FFDEA0] p-4 sm:p-6 rounded max-w-full sm:max-w-[1100px] mx-auto mb-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-3 gap-y-4 text-sm sm:text-base text-center">
      <div>
        <div className="text-[#FFDEA0] font-medium">Mã đơn hàng</div>
        <div>13119</div>
      </div>
      <div>
        <div className="text-[#FFDEA0] font-medium">Ngày đặt</div>
        <div>06/05/2025</div>
      </div>
      <div>
        <div className="text-[#FFDEA0] font-medium">Ngày nhận</div>
        <div>08/05/2025</div>
      </div>
      <div>
        <div className="text-[#FFDEA0] font-medium">Tổng tiền</div>
        <div>530.000VND</div>
      </div>
      <div>
        <div className="text-[#FFDEA0] font-medium">Thanh toán</div>
        <div>Chuyển khoản ngân hàng</div>
      </div>
    </div>
  </div>
);

export default OrderDetails;
