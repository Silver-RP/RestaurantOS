import React from 'react';
import ButtonComponents from "../../../components/common/ButtonComponents";

const ContactReservation = () => {
  return (
    <div className="flex min-h-screen bg-[#012B40] text-white font-sans">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <section className="border border-[#FFDEA0] p-8 rounded-md w-full max-w-3xl text-white bg-[#012B40]">
          <h1 className="text-3xl sm:text-4xl mb-6 font-restora text-[#ffffff] text-center">
            Liên hệ đặt bàn
          </h1>

          <form className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block mb-1">Họ và tên:</label>
              <input
                type="text"
                className="w-full p-3 rounded-none border border-[#FFDEA0] bg-[#012B40] text-white"
              />
            </div>
            <div>
              <label className="block mb-1">Email:</label>
              <input
                type="email"
                className="w-full p-3 rounded-none border border-[#FFDEA0] bg-[#012B40] text-white"
              />
            </div>
            <div>
              <label className="block mb-1">Số điện thoại:</label>
              <input
                type="tel"
                className="w-full p-3 rounded-none border border-[#FFDEA0] bg-[#012B40] text-white"
              />
            </div>
            <div>
              <label className="block mb-1">Tổng số người:</label>
              <input
                type="number"
                className="w-full p-3 rounded-none border border-[#FFDEA0] bg-[#012B40] text-white"
              />
            </div>
            <div>
              <label className="block mb-1">Chọn giờ:</label>
              <input
                type="time"
                className="w-full p-3 rounded-none border border-[#FFDEA0] bg-[#012B40] text-white"
              />
            </div>
            <div>
              <label className="block mb-1">Chọn ngày:</label>
              <input
                type="date"
                className="w-full p-3 rounded-none border border-[#FFDEA0] bg-[#012B40] text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-1">Lời nhắn:</label>
              <textarea
                rows={4}
                className="w-full p-3 rounded-none border border-[#FFDEA0] bg-[#012B40] text-white"
              ></textarea>
            </div>
          </form>

          <div className="mt-6 text-center">
            <ButtonComponents
              variant="filled"
              size="small"
              className="px-6 sm:px-8 py-3 rounded-none text-sm sm:text-base"
            >
              Tiếp tục
            </ButtonComponents>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactReservation;
