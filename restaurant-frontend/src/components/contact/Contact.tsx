import React from "react";

const ContactCard = () => {
  return (
    <div className="flex flex-col md:flex-row text-white relative w-full mx-auto h-auto md:h-[810px] bg-headerBackground">
      <div className="w-full md:w-1/2">
        <img
          src="/assets/images/Contact.png"
          alt="Bar"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center relative px-4 py-8 md:py-0">
        <div className="relative w-full max-w-[447px]">
          <div className="absolute inset-0 border-2 hidden md:block translate-x-2 translate-y-2 border-secondaryColor"></div>
          <div className="relative flex flex-col justify-between h-fit px-6 md:py-20 md:px-20 text-center shadow-lg border-2 bg-transparent w-full border-secondaryColor">
            <div className="mb-4 flex justify-between">
              <img
                src="assets/images/Icon.svg"
                alt="Icon"
                className="mx-auto w-[40px] h-[40px] md:w-[50px] md:h-[50px]"
              />
            </div>

            <h2 className="text-2xl font-restora md:text-3xl font-light mb-4">
              Liên hệ với chúng tôi
            </h2>
            <p className="text-sm font-restora md:text-lg mb-2">Đặt bàn</p>
            <a
              href="tel:+39055123456"
              className="text-[18px] md:text-4xl font-restora font-thin text-secondaryColor"
            >
              +39-055-123456
            </a>
            <p className="text-sm md:text-xl font-restora">Địa chỉ</p>
            <p className="mb-8 px-10 text-white font-thin text-md">
               161 đường Quốc Hương, Thảo Điền, Quận 2
            </p>
            <hr className="border-t border-hr mb-8" />
            <div className="grid grid-cols-2 gap-2 md:gap-4 text-sm text-gray-400">
              <div className=" flex flex-col items-start">
                <h3 className="font-thin font-restora text-[13px] md:text-[24px] text-white">
                  Bữa trưa
                </h3>
                <p className="text-[10px] md:text-[14px]">Thứ 2 - Chủ Nhật</p>
                <p className="text-[10px] md:text-[14px]">10:30 am - 3:00 pm</p>
              </div>
              <div className=" flex flex-col items-start">
                <h3 className="font-thin font-restora text-[13px] md:text-[24px] text-white">
                  Bữa tối
                </h3>
                <p className="text-[10px] md:text-[14px]">Thứ 2 - Chủ Nhật</p>
                <p className="text-[10px] md:text-[14px]">5:30 pm - 11:00 pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;