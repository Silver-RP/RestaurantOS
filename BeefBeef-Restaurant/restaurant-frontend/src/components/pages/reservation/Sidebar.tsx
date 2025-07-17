import React from 'react';
import { ReservationFormData } from '@/types/reservation.type';

interface SidebarProps {
  formData: ReservationFormData;
}

const Sidebar: React.FC<SidebarProps> = ({ formData }) => {
  return (
    <div className="w-full">
      <div className="bg-[#012B40] border border-[#FFDEA0] p-6 min-h-[500px] flex flex-col justify-between">
        <div className="space-y-4 text-left text-sm pt-2">
          <div className="flex text-left mb-2 gap-0">
            <p className="w-[150px]">Họ và tên:</p>
            <p>{formData.full_name}</p>
          </div>
          <div className="flex mb-2 gap-0">
            <p className="w-[150px]">Số điện thoại:</p>
            <p>{formData.phone}</p>
          </div>
          <div className="flex mb-2 gap-0">
            <p className="w-[150px]">Thời gian:</p>
            <p>{formData.time}</p>
          </div>
          <div className="flex mb-2 gap-0">
            <p className="w-[150px]">Ngày đặt bàn:</p>
            <p>{formData.date}</p>
          </div>
          <div className="flex mb-2 gap-0">
            <p className="w-[150px]">Loại bàn:</p>
            <p>{formData.seatingName}</p>
          </div>
          <div className="flex mb-2 gap-0">
            <p className="w-[150px]">Số lượng người:</p>
            <p>{formData.number_of_people}</p>
          </div>
        </div>

        <div className="mt-2 text-left">
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
