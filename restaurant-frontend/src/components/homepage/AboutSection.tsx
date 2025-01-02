import React from "react";

const AboutSection = () => {
  return (
    <section className="bg-bodyBackground text-white py-16 px-6 md:px-20">
      <div className="w-mainContainer mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-restora font-extralight mb-4">
            About Beef Beef
          </h2>
          <p className="text-secondaryColor font-sans font-extralight text-sm uppercase tracking-widest">
            Restaurant & Bar
          </p>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            Nhà hàng của chúng tôi mang đến trải nghiệm ẩm thực phong cách châu Âu đầy tinh tế và thú vị, lấy cảm hứng từ Bếp trưởng Chris Hill. Thực đơn phục vụ cả ngày là sự hòa quyện tinh hoa của những món ngon đặc trưng theo mùa.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Cột 1 */}
          <div className="flex flex-col items-start space-y-6">
            <img
              src="/assets/images/about/leo_delicioz_h4_about-1.webp"
              alt="Restaurant"
              className="w-full h-auto rounded-lg"
            />
            <div>
              <h3 className="text-8xl font-restora font-extralight text-secondaryColor">
                230+
              </h3>
              <p className="mt-2 font-restora text-xl">Lượt Khách Hàng Ngày</p>
              <p className="text-gray-400 mt-4">
                Những vị khách ghé thăm mỗi ngày mang lại sức sống cho nhà hàng.
                Tận hưởng không gian ấm cúng và dịch vụ tận tâm.
              </p>
            </div>
          </div>

          {/* Cột 2 */}
          <div className="flex flex-col items-start space-y-6 justify-center">
            <img
              src="/assets/images/about/leo_delicioz_h4_about-2.webp"
              alt="Delivery"
              className="w-full h-auto rounded-lg"
            />
            <div>
              <h3 className="text-8xl font-restora font-extralight text-secondaryColor">
                1590+
              </h3>
              <p className="mt-2 font-restora text-xl">Giao Hàng Mỗi Tháng</p>
              <p className="text-gray-400 mt-4">
                Đội ngũ chúng tôi luôn nỗ lực để phục vụ các món ăn tươi ngon
                đến tận tay khách hàng với sự nhanh chóng và tận tâm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;