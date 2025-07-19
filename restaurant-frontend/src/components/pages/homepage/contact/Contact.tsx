import React from 'react';

const ContactCard = () => {
  return (
    <div className="flex flex-col lg:flex-row text-white bg-headerBackground w-full">
      <div className="w-full lg:w-1/2 h-[300px] lg:h-auto">
        <img
          src="/assets/images/Contact.png"
          alt="Bar"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 lg:py-20">
        <div className="relative w-full md:max-w-[360px] lg:max-w-[447px]">
          <div className="absolute hidden lg:block inset-0 border-2 translate-x-2 translate-y-2 border-secondaryColor"></div>

          <div className="relative bg-transparent border-2 border-secondaryColor px-6 py-8 lg:px-12 lg:py-16 text-center shadow-lg">
            <img
              src="/assets/images/Icon.svg"
              alt="Icon"
              className="mx-auto w-10 h-10 lg:w-12 lg:h-12 mb-4"
            />

            <h2 className="text-xl lg:text-3xl font-restora font-light mb-4">
              Liên hệ với chúng tôi
            </h2>

            <p className="text-sm lg:text-lg font-restora mb-1">Đặt bàn</p>
            <a
              href="tel:+390239991255"
              className="text-lg lg:text-3xl font-roboto font-light text-secondaryColor block mb-4"
            >
              0239991255
            </a>

            <p className="text-sm lg:text-lg font-restora mb-1">Địa chỉ</p>
            <p className="text-xs lg:text-base text-white font-thin mb-6">
              161 đường Quốc Hương, Thảo Điền, Quận 2
            </p>

            <hr className="border-t border-hr mb-6" />

            <div className="grid grid-cols-2 gap-6 text-left text-xs lg:text-sm text-gray-300">
              <div>
                <h3 className="text-base lg:text-lg font-restora text-white mb-1">
                  Thứ 2 - Thứ 6
                </h3>
                <p className="whitespace-nowrap">08:00 - 22:00</p>
              </div>
              <div>
                <h3 className="text-base lg:text-lg font-restora text-white mb-1">
                  Thứ 7 - Chủ Nhật
                </h3>
                <p className="whitespace-nowrap">08:00 - 23:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
