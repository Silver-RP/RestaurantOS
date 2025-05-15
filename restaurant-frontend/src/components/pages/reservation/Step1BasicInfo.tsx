import React, { useState, useEffect } from 'react';
import { ReservationFormData } from '../../../types/ReservationFormData.type';
import ButtonComponents from '@components/common/ButtonComponents';
import { reservationSchema } from '@/utils/zodSchemas';
import { Listbox } from '@headlessui/react';
import { FaChevronDown } from 'react-icons/fa';
interface Step1BasicInfoProps {
  formData: ReservationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReservationFormData>>;
  onNext: () => void;
}

const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
  formData,
  setFormData,
  onNext,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [timeOptions, setTimeOptions] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState(formData.time);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, time: selectedTime }));
  }, [selectedTime]);
  useEffect(() => {
    const generateTimeOptions = () => {
      const options: string[] = [];
      const now = new Date();
      const selectedDate = new Date(formData.date);
      const isToday = selectedDate.toDateString() === now.toDateString();
      const minTime = isToday
        ? new Date(now.getTime() + 3 * 60 * 60 * 1000)
        : new Date(selectedDate.setHours(0, 0, 0, 0));

      for (let hour = 9; hour <= 21; hour++) {
        for (let min = 0; min < 60; min += 15) {
          const time = new Date(selectedDate);
          time.setHours(hour, min, 0, 0);

          if (!isToday || time >= minTime) {
            const formatted = `${hour.toString().padStart(2, '0')}:${min
              .toString()
              .padStart(2, '0')}`;
            options.push(formatted);
          }
        }
      }

      setTimeOptions(options);
    };

    if (formData.date) {
      generateTimeOptions();
    }
  }, [formData.date]);

  useEffect(() => {
    if (!formData.date) return;

    const now = new Date();
    const selectedDate = new Date(formData.date);
    const isToday = selectedDate.toDateString() === now.toDateString();

    if (isToday && timeOptions.length === 0) {
      setErrors((prev) => ({
        ...prev,
        time: 'Không còn khung giờ nào khả dụng hôm nay. Vui lòng chọn ngày khác.',
      }));
    } else {
      setErrors((prev) => ({ ...prev, time: '' }));
    }
  }, [formData.date, timeOptions]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    const result = reservationSchema.safeParse({ ...formData, [name]: value });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const errorMessage =
        fieldErrors[name as keyof typeof fieldErrors]?.[0] || '';
      setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = reservationSchema.safeParse(formData);

    if (result.success) {
      setErrors({});
      onNext();
    } else {
      const fieldErrors = result.error.flatten().fieldErrors;
      const formatted: Record<string, string> = {};
      Object.entries(fieldErrors).forEach(([key, val]) => {
        if (val && val.length) formatted[key] = val[0];
      });
      setErrors(formatted);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-4 sm:px-[50px] py-6 rounded text-left space-y-6"
    >
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm">Họ tên</label>
          <input
            type="text"
            name="name"
            placeholder="Tên của bạn"
            value={formData.name}
            onChange={handleChange}
            className="p-3 bg-transparent text-white placeholder:text-gray-400 border border-[#074b6b] rounded focus:outline-none focus:ring-1 focus:ring-secondaryColor focus:border-secondaryColor focus:bg-transparent transition"
          />
          {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm">Email</label>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            className="p-3 bg-transparent text-white placeholder:text-gray-400 border border-[#074b6b] rounded focus:outline-none focus:ring-1 focus:ring-secondaryColor focus:border-secondaryColor focus:bg-transparent transition"
          />
          {errors.email && (
            <p className="text-red-400 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm">Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            className="p-3 bg-transparent text-white placeholder:text-gray-400 border border-[#074b6b] rounded focus:outline-none focus:ring-1 focus:ring-secondaryColor focus:border-secondaryColor focus:bg-transparent transition"
          />
          {errors.phone && (
            <p className="text-red-400 text-sm">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm mb-1">Số người</label>
          <div className="relative">
            <input
              type="number"
              name="people"
              min={1}
              max={100}
              placeholder="Nhập số người"
              value={formData.people}
              onChange={handleChange}
              className="h-[48px] w-full px-4 bg-transparent border border-[#074b6b] text-white placeholder:text-gray-400 rounded focus:outline-none focus:border-secondaryColor focus:ring-1 focus:ring-secondaryColor transition pr-10 no-spinner"
            />
            {errors.people && (
              <p className="text-red-400 text-sm">{errors.people}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm mb-1">Ngày</label>
          <div className="relative w-full">
            <input
              type="date"
              name="date"
              min={new Date().toISOString().split('T')[0]}
              max={
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0]
              }
              value={formData.date}
              onChange={handleChange}
              className="h-[48px] w-full px-4 pr-2 bg-transparent border border-[#074b6b] text-white placeholder:text-gray-400 rounded focus:outline-none focus:border-secondaryColor focus:ring-1 focus:ring-secondaryColor transition [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:invert"
            />
            {errors.date && (
              <p className="text-red-400 text-sm">{errors.date}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm mb-1">Giờ</label>
          <div className="relative w-full">
            <Listbox
              value={selectedTime}
              onChange={(val) => {
                setSelectedTime(val);
                setFormData((prev) => ({ ...prev, time: val }));
              }}
            >
              <div className="relative">
                <Listbox.Button
                  className="h-[48px] w-full px-4 pr-10 text-left bg-transparent border border-[#074b6b] text-white placeholder:text-gray-400 rounded focus:outline-none focus:border-secondaryColor focus:ring-1 focus:ring-secondaryColor flex items-center justify-between"
                  onClick={() => {
                    if (!formData.date) {
                      setErrors((prev) => ({
                        ...prev,
                        time: 'Vui lòng chọn ngày trước khi chọn giờ.',
                      }));
                    }
                  }}
                >
                  <span className="normal-case">
                    {selectedTime || '-- Chọn giờ --'}
                  </span>
                  <FaChevronDown className="text-sm absolute right-4" />
                </Listbox.Button>

                <Listbox.Options className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto bg-headerBackground border border-bodyBackground rounded shadow-lg text-white focus:outline-none">
                  {timeOptions.map((time) => (
                    <Listbox.Option
                      key={time}
                      value={time}
                      className={({ active, selected }) =>
                        `cursor-pointer px-4 py-2 transition ${
                          active
                            ? 'bg-secondaryColor text-bodyBackground'
                            : selected
                              ? 'bg-[#0d3347]'
                              : ''
                        }`
                      }
                    >
                      {time}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
            {errors.time && (
              <p className="text-red-400 text-sm mt-1">{errors.time}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm">Ghi chú thêm</label>
        <textarea
          name="note"
          placeholder="Ghi chú đặc biệt nếu có..."
          value={formData.note}
          onChange={handleChange}
          rows={4}
          className="p-3 bg-transparent border border-[#074b6b] text-white placeholder:text-gray-400 rounded focus:outline-none focus:border-secondaryColor focus:ring-1 focus:ring-secondaryColor transition"
        />
      </div>

      <div className="text-center">
        <ButtonComponents
          type="submit"
          variant="filled"
          size="large"
          className="w-1/2 text-xs sm:text-sm md:text-base uppercase font-normal"
        >
          Tiếp tục
        </ButtonComponents>
      </div>
    </form>
  );
};

export default Step1BasicInfo;
