import React from 'react';
import { ReservationFormData } from '@/types/ReservationFormData.type';

interface SidebarProps {
  formData: ReservationFormData;
}

const Sidebar: React.FC<SidebarProps> = ({ formData }) => {
  return (
    <div className="w-full md:w-[28%]">
      <div className="bg-[#012B40] border border-[#FFDEA0] p-6 min-h-[480px] flex flex-col justify-between">
        <div className="space-y-4 text-sm pt-2">
          <div className="flex mb-2 gap-4">
            <p className="w-[150px]">Họ và tên:</p>
            <p>{formData.name}</p>
          </div>
          <div className="flex mb-2 gap-4">
            <p className="w-[150px]">Số điện thoại:</p>
            <p>{formData.phone}</p>
          </div>
          <div className="flex mb-2 gap-4">
            <p className="w-[150px]">Thời gian:</p>
            <p>{formData.time}</p>
          </div>
          <div className="flex mb-2 gap-4">
            <p className="w-[150px]">Ngày đặt bàn:</p>
            <p>{formData.date}</p>
          </div>
          <div className="flex mb-2 gap-4">
            <p className="w-[150px]">Số bàn:</p>
            <p>{formData.seating}</p>
          </div>
          <div className="flex mb-2 gap-4">
            <p className="w-[150px]">Tổng lượng người:</p>
            <p>{formData.people}</p>
          </div>
        </div>

        <div className="mt-2">
          <p className="mb-2">Ghi chú:</p>
          <textarea
            className="w-full h-32 bg-[#012B40] border border-[#FFDEA0] p-2 text-white resize-none text-sm"
            value={formData.note}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
