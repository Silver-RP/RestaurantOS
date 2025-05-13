import React, { useState } from 'react';
import { ReservationFormData } from '../../../types/ReservationFormData.type';
import ButtonComponents from '@components/common/ButtonComponents';
import { reservationSchema } from '@/utils/zodSchemas';
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate từng field khi nhập
    const result = reservationSchema.safeParse({ ...formData, [name]: value });
    if (!result.success) {
      const fieldError = result.error.flatten().fieldErrors[name as keyof typeof formData]?.[0];
      setErrors((prev) => ({ ...prev, [name]: fieldError || '' }));
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
          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
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
          {errors.phone && <p className="text-red-400 text-sm">{errors.phone}</p>}
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
            {errors.people && <p className="text-red-400 text-sm">{errors.people}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm mb-1">Ngày</label>
          <div className="relative w-full">
          <input
  type="date"
  name="date"
  min={new Date().toISOString().split('T')[0]}
  value={formData.date}
  onChange={handleChange}
  className="h-[48px] w-full px-4 pr-2 bg-transparent border border-[#074b6b] text-white placeholder:text-gray-400 rounded focus:outline-none focus:border-secondaryColor focus:ring-1 focus:ring-secondaryColor transition [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:invert"
/>
            {errors.date && <p className="text-red-400 text-sm">{errors.date}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm mb-1">Giờ</label>
          <div className="relative w-full">
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="h-[48px] w-full px-4 pr-2 bg-transparent border border-[#074b6b] text-white placeholder:text-gray-400 rounded focus:outline-none focus:border-secondaryColor focus:ring-1 focus:ring-secondaryColor transition [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:invert"
            />
            {errors.time && <p className="text-red-400 text-sm">{errors.time}</p>}
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
