import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { IoClose } from 'react-icons/io5';
import { IoIosArrowDown } from 'react-icons/io';
import ButtonComponent from '@/components/common/ButtonComponents';

// Delivery option types
export interface PickupTime {
  type: 'scheduled';
  scheduledTime: Date; // Bắt buộc phải có scheduledTime
}

interface ModalSelectPickupTimeProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (pickupTime: PickupTime) => void;
  currentSelection?: PickupTime;
}

const ModalSelectPickupTime = ({
  isOpen,
  onClose,
  onSelect,
  currentSelection,
}: ModalSelectPickupTimeProps) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]); // Initialize dates and times on component mount with default being now + 30 minutes
  useEffect(() => {
    if (
      currentSelection?.type === 'scheduled' &&
      currentSelection.scheduledTime
    ) {
      // Use selected time if available
      const date = currentSelection.scheduledTime;
      setSelectedDate(formatDateForInput(date));
      setSelectedTime(formatTimeForInput(date));
    } else {
      // Default to now + 30 minutes
      const defaultDate = new Date();
      defaultDate.setMinutes(defaultDate.getMinutes() + 30);
      setSelectedDate(formatDateForInput(defaultDate));
      setSelectedTime(formatTimeForInput(defaultDate));

      // Auto select this default time
      onSelect({
        type: 'scheduled',
        scheduledTime: defaultDate,
      });
    }

    // Generate available dates (today + next 7 days)
    generateAvailableDates();
  }, [currentSelection]);

  // Update available times when date changes
  useEffect(() => {
    if (selectedDate) {
      generateAvailableTimes(selectedDate);
    }
  }, [selectedDate]);

  // Format date for the input field (YYYY-MM-DD)
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Format time for the input field (HH:MM)
  const formatTimeForInput = (date: Date): string => {
    return date.toTimeString().substring(0, 5);
  };

  // Generate available dates (today + next 7 days)
  const generateAvailableDates = () => {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 0; i < 8; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(formatDateForInput(date));
    }

    setAvailableDates(dates);
  };

  // Generate available times for the selected date
  const generateAvailableTimes = (dateStr: string) => {
    const selectedDateObj = new Date(dateStr);
    const now = new Date();
    const times: string[] = []; // Starting hour (9:00 AM)
    const startHour = 9;
    // Ending hour (9:00 PM)
    const endHour = 21;

    // Check if selected date is today
    const isToday = selectedDateObj.toDateString() === now.toDateString();

    // For today, start from current time
    let currentHour = startHour;
    let startMinutes = 0;
    if (isToday) {
        currentHour = now.getHours();
        // Round up to the next hour
        if (now.getMinutes() > 0) {
          currentHour += 1;
        }
        // Cap to start hour if needed
        currentHour = Math.max(currentHour, startHour);
      }
    for (let hour = currentHour; hour <= endHour; hour++) {
      // For the current hour on today, start from startMinutes
      const minuteIntervals =
        hour === currentHour && isToday
          ? [0, 15, 30, 45].filter((m) => m >= startMinutes)
          : [0, 15, 30, 45];

      // Only add times for this hour if we have valid minutes
      if (minuteIntervals.length > 0) {
        for (const minute of minuteIntervals) {
          if (hour < endHour || (hour === endHour && minute === 0)) {
            times.push(
              `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
            );
          }
        }
      }
    }

    setAvailableTimes(times);

    // Set default selected time to first available time
    if (times.length > 0 && (!selectedTime || !times.includes(selectedTime))) {
      setSelectedTime(times[0]);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const scheduledTime = new Date(selectedDate);
      scheduledTime.setHours(hours, minutes, 0, 0);

      onSelect({
        type: 'scheduled',
        scheduledTime,
      });
    }
    onClose();
  };

  // Format the date in a readable format
  const formatReadableDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="w-full max-w-lg bg-bodyBackground rounded-lg max-h-[90vh] overflow-y-auto"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div className="sticky top-0 bg-bodyBackground px-6 py-4 border-b border-gray-700 z-10">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-lg font-bold text-white">
                Chọn Thời Gian Nhận Hàng
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-white"
                aria-label="Đóng"
              >
                <IoClose className="text-xl" />
              </button>
            </div>
          </div>

          <div className="px-6 py-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Chọn Ngày
                </label>
                <CustomDropdown
                  value={selectedDate}
                  options={availableDates}
                  onChange={setSelectedDate}
                  renderOption={formatReadableDate}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Chọn Giờ
                </label>
                {availableTimes.length === 0 ? (
                  <p className="text-sm text-secondaryColor">
                    Không có khung giờ nào khả dụng cho ngày đã chọn
                  </p>
                ) : (
                  <CustomDropdown
                    value={selectedTime}
                    options={availableTimes}
                    onChange={setSelectedTime}
                    renderOption={(time) => time}
                  />
                )}
              </div>

              <div className="text-xs text-gray-400 mt-2">
                Lưu ý: Thời gian nhận đặt hàng từ 9:00 đến 21:00
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 flex justify-center bg-bodyBackground px-6 py-4 border-t border-gray-700">
            <ButtonComponent
              className="w-1/2 mt-4"
              onClick={handleSubmit}
              disabled={
                !selectedDate || !selectedTime || availableTimes.length === 0
              }
            >
              Xác Nhận
            </ButtonComponent>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

// Custom dropdown component to prevent overflow issues
interface CustomDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  renderOption: (value: string) => string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  options,
  onChange,
  renderOption,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full p-3 bg-headerBackground border border-gray-700 rounded-lg text-white cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{renderOption(value)}</span>
        <IoIosArrowDown
          className={`transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </div>

      {isOpen && (
        <div
          className="absolute z-10 mt-1 w-full bg-headerBackground border border-gray-700 rounded-lg max-h-60 overflow-y-auto shadow-lg"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {options.map((option) => (
            <div
              key={option}
              className={`p-3 cursor-pointer hover:bg-gray-700 ${option === value ? 'bg-gray-700' : ''}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {renderOption(option)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModalSelectPickupTime;
