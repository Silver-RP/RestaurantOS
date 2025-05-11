import BreadcrumbComponent from '@components/common/BreadCrumbComponents';
import ButtonComponents from '@components/common/ButtonComponents';
import ShowcaseSection from '@components/common/ShowcaseSection';
import React, { useState } from 'react';
import { FiCalendar, FiChevronDown, FiClock } from 'react-icons/fi';

const ReservationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '07:00 pm',
    people: '1 Person',
    note: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reservation Info:', formData);
  };

  return (
    <>
      <BreadcrumbComponent />
      <div className="bg-bodyBackground text-white py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-restora mb-2">Đặt bàn trực tuyến</h2>
          <p className="text-gray-300 mb-8">
            Đặt bàn cho bữa trưa hoặc bữa tối của bạn.
          </p>

          <form
            onSubmit={handleSubmit}
            className=" p-6 rounded text-left space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm">Họ tên</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Tên của bạn"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="p-3 bg-transparent border border-[#074b6b] text-white 
                  placeholder:text-gray-400 rounded focus:outline-none 
                  focus:border-secondaryColor focus:ring-1 focus:ring-secondaryColor transition"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="p-3 bg-transparent border border-[#074b6b] text-white 
                  placeholder:text-gray-400 rounded focus:outline-none 
                  focus:border-secondaryColor focus:ring-1 focus:ring-secondaryColor transition"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm mb-1">Số người</label>
                <div className="relative">
                  <select
                    name="people"
                    value={formData.people}
                    onChange={handleChange}
                    className="h-[48px] w-full appearance-none px-4 bg-transparent border border-[#074b6b] text-white placeholder:text-gray-400 rounded focus:outline-none  focus:border-secondaryColor focus:ring-1 focus:ring-secondaryColor transition pr-10"
                  >
                    <option>👤 1 người</option>
                    <option>👥 2 người</option>
                    <option>👥 3 người</option>
                    <option>👥 4 người</option>
                    <option>👥 5 - 10 người</option>
                    <option>👥 10 - 20 người</option>
                    <option>👥 Trên 20 người</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm mb-1">Ngày</label>
                <div className="relative w-full">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="h-[48px] w-full px-4 pr-10 bg-transparent border border-[#074b6b] text-white 
        placeholder:text-gray-400 rounded focus:outline-none focus:border-secondaryColor 
        focus:ring-1 focus:ring-secondaryColor transition 
        [&::-webkit-calendar-picker-indicator]:opacity-0"
                  />
                  <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
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
                    className="h-[48px] w-full px-4 pr-10 bg-transparent border border-[#074b6b] text-white 
        placeholder:text-gray-400 rounded focus:outline-none focus:border-secondaryColor 
        focus:ring-1 focus:ring-secondaryColor transition 
        [&::-webkit-calendar-picker-indicator]:opacity-0"
                  />
                  <FiClock className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
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
                className="w-full text-xs sm:text-sm md:text-base uppercase font-normal"
              >
                Đặt Bàn
              </ButtonComponents>
            </div>
          </form>
        </div>
        <ShowcaseSection/>
      </div>
    </>
  );
};

export default ReservationPage;
