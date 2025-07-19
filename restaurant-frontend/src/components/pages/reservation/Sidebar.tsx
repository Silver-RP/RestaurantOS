import React from 'react';
import { ReservationFormData } from '@/types/Reservation.type';

interface SidebarProps {
  formData: ReservationFormData;
}

const Sidebar: React.FC<SidebarProps> = ({ formData }) => {
  // Hàm helper để hiển thị tên loại bàn
  const getTableTypeDisplayName = (tableCategory?: string): string => {
    switch (tableCategory) {
      case 'vip':
        return 'Bàn VIP';
      case 'group':
        return 'Bàn nhóm';
      case 'quiet':
        return 'Bàn yên tĩnh';
      case 'standard':
        return 'Bàn thường';
      default:
        return 'Không xác định';
    }
  };

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
            <p>
              {formData.tableCategory
                ? getTableTypeDisplayName(formData.tableCategory)
                : formData.seatingName}
            </p>
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
