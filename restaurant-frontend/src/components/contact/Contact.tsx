import React from "react";
import bar from "../../../public/assets/images/Contact.png";
import icon from "../../../public/assets/images/Icon2.svg";

const ContactCard = () => {
  const secondaryColor = "#FFDEA0"; // Màu thay thế cho màu vàng
  const contactBackground = "#021D2A"; // Màu nền mới

  return (
    <div
      className="flex flex-col md:flex-row text-white relative w-full mx-auto h-auto md:h-[682px]"
      style={{ backgroundColor: contactBackground }}
    >
      {/* Left Side - Image */}
      <div className="w-full md:w-1/2">
        <img
          src={bar}
          alt="Bar"
          className="w-full h-[300px] md:h-[682px] object-cover"
        />
      </div>

      {/* Right Side - Contact Information */}
      <div className="w-full md:w-1/2 flex items-center justify-center relative px-4 py-8 md:py-0">
        {/* Outer Container with the Yellow Border */}
        <div className="relative w-full max-w-[377px]">
          {/* Offset Border */}
          <div
            className="absolute inset-0 border-2 hidden md:block"
            style={{
              borderColor: secondaryColor,
              transform: "translate(10px, 10px)",
            }}
          ></div>

          {/* Inner Content */}
          <div
            className="relative p-6 md:p-10 text-center shadow-lg border-2 bg-transparent w-full"
            style={{ borderColor: secondaryColor }}
          >
            {/* Icon */}
            <div className="mb-4">
              <img
                src={icon}
                alt="Icon"
                className="mx-auto w-[40px] h-[40px] md:w-[50px] md:h-[50px]"
              />
            </div>

            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Liên hệ với chúng tôi
            </h2>
            <p className="text-sm md:text-lg mb-2">Đặt bàn</p>
            <a
              href="tel:+39055123456"
              className="text-[18px] md:text-[20px] font-semibold"
              style={{ color: secondaryColor }}
            >
              +39-055-123456
            </a>
            <p className="mt-4 mb-8 text-gray-400 text-sm">
              Địa chỉ <br /> 161 đường Quốc Hương, Thảo Điền, Quận 2
            </p>

            <div className="grid grid-cols-2 gap-2 md:gap-4 text-sm text-gray-400">
              <div>
                <h3 className="font-semibold text-[13px] md:text-[15px] text-white">
                  Bữa trưa
                </h3>
                <p className="text-[10px] md:text-[11px]">Thứ 2 - Chủ Nhật</p>
                <p className="text-[10px] md:text-[11px]">10:30 am - 3:00 pm</p>
              </div>
              <div>
                <h3 className="font-semibold text-[13px] md:text-[15px] text-white">
                  Bữa tối
                </h3>
                <p className="text-[10px] md:text-[11px]">Thứ 2 - Chủ Nhật</p>
                <p className="text-[10px] md:text-[11px]">5:30 pm - 11:00 pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
