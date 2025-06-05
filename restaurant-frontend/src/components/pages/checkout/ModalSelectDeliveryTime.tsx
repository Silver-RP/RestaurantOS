import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import  ButtonComponent  from "@/components/common/ButtonComponents";

// Delivery option types
export interface DeliveryTime {
  type: "now" | "scheduled";
  scheduledTime?: Date; // For scheduled deliveries
}

interface ModalSelectDeliveryTimeProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (deliveryTime: DeliveryTime) => void;
  currentSelection?: DeliveryTime;
}

const ModalSelectDeliveryTime = ({
  isOpen,
  onClose,
  onSelect,
  currentSelection,
}: ModalSelectDeliveryTimeProps) => {
  const [selectedType, setSelectedType] = useState<"now" | "scheduled">(
    currentSelection?.type || "now"
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // Initialize dates and times on component mount
  useEffect(() => {
    if (currentSelection?.type === "scheduled" && currentSelection.scheduledTime) {
      const date = currentSelection.scheduledTime;
      setSelectedDate(formatDateForInput(date));
      setSelectedTime(formatTimeForInput(date));
    } else {
      // Default to today
      setSelectedDate(formatDateForInput(new Date()));
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
    const times: string[] = [];
    
    // Starting hour (9:00 AM)
    const startHour = 9;
    // Ending hour (9:00 PM)
    const endHour = 21;
    
    // Check if selected date is today
    const isToday = selectedDateObj.toDateString() === now.toDateString();
    
    // For today, start times 2 hours from now, rounded up to nearest hour
    let currentHour = startHour;
    if (isToday) {
      currentHour = now.getHours() + 2;
      // Round up to the next hour
      if (now.getMinutes() > 0) {
        currentHour += 1;
      }
      // Cap to start hour if needed
      currentHour = Math.max(currentHour, startHour);
    }
    
    // Generate available times
    for (let hour = currentHour; hour <= endHour; hour++) {
        // Add quarter-hour increments (00, 15, 30, 45)
        times.push(`${hour.toString().padStart(2, '0')}:00`);
        if (hour < endHour) {
        times.push(`${hour.toString().padStart(2, '0')}:15`);
        times.push(`${hour.toString().padStart(2, '0')}:30`);
        times.push(`${hour.toString().padStart(2, '0')}:45`);
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
    if (selectedType === "now") {
      onSelect({ type: "now" });
    } else {
      // Combine date and time for scheduled delivery
      if (selectedDate && selectedTime) {
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const scheduledTime = new Date(selectedDate);
        scheduledTime.setHours(hours, minutes, 0, 0);
        
        onSelect({
          type: "scheduled",
          scheduledTime
        });
      }
    }
    onClose();
  };

  // Format the date in a readable format
  const formatReadableDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel
            className="w-full max-w-lg bg-bodyBackground rounded-lg max-h-[90vh] overflow-y-auto"
            style={{
                scrollbarWidth: 'none',       
                msOverflowStyle: 'none'      
            }}
            >
          <div className="sticky top-0 bg-bodyBackground px-6 py-4 border-b border-gray-700 z-10">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-lg font-bold text-white">
                Chọn Thời Gian Giao Nhận Hàng
              </Dialog.Title>
              <button onClick={onClose} className="text-white">
                <IoClose className="text-xl" />
              </button>
            </div>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* Delivery option selection */}
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setSelectedType("now")}
                className={`cursor-pointer border p-4 rounded-lg text-center ${
                  selectedType === "now"
                    ? "border-primary bg-headerBackground"
                    : "border-gray-300"
                }`}
              >
                <p className="font-semibold text-white">Giao Hàng Ngay</p>
                <p className="text-sm text-gray-300 mt-2">
                  Dự kiến nhận hàng <br /> trong 45-90 phút tính từ lúc đặt hàng.
                </p>
              </div>
              
              <div
                onClick={() => setSelectedType("scheduled")}
                className={`cursor-pointer border p-4 rounded-lg text-center ${
                  selectedType === "scheduled"
                    ? "border-primary bg-headerBackground"
                    : "border-gray-300"
                }`}
              >
                <p className="font-semibold text-white">Đặt Lịch Nhận Hàng</p>
                <p className="text-sm text-gray-300 mt-2">
                  Chọn ngày và giờ nhận hàng cụ thể
                </p>
              </div>
            </div>

            {/* Scheduled delivery options */}
            {selectedType === "scheduled" && (
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
                  Lưu ý: Thời gian giao hàng từ 9:00 đến 21:00 và phải sau thời điểm hiện tại ít nhất 2 giờ
                </div>
              </div>
            )}
          </div>

          {/* Confirmation button */}
          <div className="sticky bottom-0  flex  justify-center  bg-bodyBackground px-6 py-4 border-t border-gray-700">
            {/* <button
              onClick={handleSubmit}
              disabled={selectedType === "scheduled" && (!selectedDate || !selectedTime || availableTimes.length === 0)}
              className={`w-full py-3 rounded-lg font-medium ${
                selectedType === "scheduled" && (!selectedDate || !selectedTime || availableTimes.length === 0)
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              Xác Nhận
            </button> */}
            <ButtonComponent
              className="w-1/2 mt-4"
              onClick={handleSubmit}
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

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, options, onChange, renderOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
        <IoIosArrowDown className={`transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
            <div
            className="absolute z-10 mt-1 w-full bg-headerBackground border border-gray-700 rounded-lg max-h-60 overflow-y-auto shadow-lg"
            style={{
                scrollbarWidth: 'none',       
                msOverflowStyle: 'none' 
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

export default ModalSelectDeliveryTime;