import React, { useState } from 'react';
import ModalSelectDeliveryTime, {
  DeliveryTime,
} from './ModalSelectDeliveryTime';

interface DeliveryTimeSectionProps {
  onDeliveryTimeChange: (deliveryTime: DeliveryTime) => void;
  initialDeliveryTime?: DeliveryTime;
}

const DeliveryTimeSection = ({
  onDeliveryTimeChange,
  initialDeliveryTime = { type: 'now' },
}: DeliveryTimeSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliveryTime, setDeliveryTime] =
    useState<DeliveryTime>(initialDeliveryTime);

  const handleDeliveryTimeSelect = (selectedTime: DeliveryTime) => {
    setDeliveryTime(selectedTime);
    onDeliveryTimeChange(selectedTime);
  };

  // Format delivery time for display
  const getFormattedDeliveryTime = () => {
    if (deliveryTime.type === 'now') {
      return 'Giao hàng ngay khi chuẩn bị xong';
    } else if (deliveryTime.scheduledTime) {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return `Giao vào ${deliveryTime.scheduledTime.toLocaleString('vi-VN', options)}`;
    }
    return 'Chưa chọn thời gian giao hàng';
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 border border-white/10 rounded-md text-white">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-base sm:text-lg md:text-xl mb-1">
            Thời gian giao hàng
          </h2>
          <div className='flex gap-4'>
            <p className="text-sm text-white/70">
              {getFormattedDeliveryTime()}
            </p>
            <p
              onClick={() => setIsModalOpen(true)}
              className="text-primary text-blue-500 text-sm cursor-pointer"
            >
              Thay đổi
            </p>
          </div>
        </div>
      </div>

      <ModalSelectDeliveryTime
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleDeliveryTimeSelect}
        currentSelection={deliveryTime}
      />
    </div>
  );
};

export default DeliveryTimeSection;
