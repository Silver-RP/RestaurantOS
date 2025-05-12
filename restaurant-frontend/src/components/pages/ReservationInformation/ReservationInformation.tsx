import React from 'react';
import Sidebar from './Sidebar';
import Section from './Section';
import ButtonComponents from "../../../components/common/ButtonComponents";

const ReservationInformation: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#012B40] text-white py-8 px-4 flex items-center justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Thông tin đặt bàn</h1>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <Sidebar />
          <Section />
        </div>

        {/* Nút xác nhận nằm ngoài phần Section để căn giữa màn hình */}
        <div className="flex justify-center mt-6">
            <ButtonComponents variant="filled" size="large" className="px-6 sm:px-8 py-3 rounded-none text-sm sm:text-base">
              Xác nhận đặt bàn
        </ButtonComponents>
        </div>
      </div>
    </div>
  );
};

export default ReservationInformation;
