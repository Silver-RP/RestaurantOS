import React from 'react';
import { ReservationStatus } from '@/types/reservation.type';

export const reservationTabs = [
  'Tất cả',
  'Chờ xác nhận',
  'Đã xác nhận',
  'Đã hủy',
  'Hoàn tất',
];

export const reservationStatusMapping: Record<
  string,
  ReservationStatus[] | null
> = {
  'Tất cả': null,
  'Chờ xác nhận': ['PENDING'],
  'Đã xác nhận': ['CONFIRMED'],
  'Đã hủy': ['CANCELLED'],
  'Hoàn tất': ['DONE'],
};

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavigationReservation: React.FC<Props> = ({ activeTab, onTabChange }) => {
  return (
    <div className="text-white px-2 md:px-0 py-4">
      <h1 className="text-xl md:text-2xl mb-4">Lịch sử đặt bàn</h1>
      <div className="overflow-x-auto">
        <div className="flex text-xs lg:justify-between md:text-base whitespace-nowrap space-x-4 md:justify-between pb-4 border-b border-white/20">
          {reservationTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`hover:underline transition ${
                activeTab === tab ? 'underline text-secondaryColor' : ''
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationReservation;
