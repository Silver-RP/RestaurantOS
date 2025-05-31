import React from 'react';
import { ReservationStatus } from '@/types/reservation.type';

export const reservationTabs = [
  'Tất cả',
  'Chờ xác nhận',
  'Đã xác nhận',
  'Đã hủy',
  'Hoàn tất',
];

export const reservationStatusMapping: Record<string, ReservationStatus[] | null> = {
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
    <div className="text-white px-2 md:px-4 py-4">
      <h1 className="text-xl md:text-2xl font-semibold mb-4">Lịch sử đặt bàn</h1>
      <div className="overflow-x-auto">
        <div className="flex text-xs md:text-sm whitespace-nowrap space-x-4 pb-4 border-b border-white/20">
          {reservationTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`hover:underline transition ${activeTab === tab ? 'underline text-secondaryColor' : ''}`}
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