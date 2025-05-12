import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-full md:w-[28%]">
      <div className="bg-[#012B40] border border-[#FFDEA0] p-6 min-h-[480px] flex flex-col justify-between">
        <div className="space-y-4 text-sm pt-2">
          <div className="flex mb-2 gap-4">
            <p className="w-[150px]">Họ và tên:</p>
            <p>Nguyễn Ngọc Mỹ</p>
          </div>
          <div className="flex mb-2 gap-4">
            <p className="w-[150px]">Số điện thoại:</p>
            <p>0378712722</p>
          </div>
          <div className="flex mb-2 gap-4">
            <p className="w-[150px]">Thời gian:</p>
            <p>18h00 - 20h00</p>
          </div>
          <div className="flex mb-2 gap-4">
            <p className="w-[150px]">Ngày đặt bàn:</p>
            <p>dd/mm/yyyy</p>
          </div>
          <div className="flex mb-2 gap-4">
            <p className="w-[150px]">Số bàn:</p>
            <p>6</p>
          </div>
          <div className="flex mb-2 gap-4">
            <p className="w-[150px]">Tổng lượng người:</p>
            <p>8</p>
          </div>
        </div>

        <div className="mt-2">
          <p className="mb-2">Ghi chú:</p>
          <textarea
            className="w-full h-32 bg-[#012B40] border border-[#FFDEA0] p-2 text-white resize-none text-sm"
            defaultValue="Trang trí sinh nhật giúp tôi."
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
