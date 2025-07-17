import Container from "@/components/common/Container";
import React from "react";
import { FaDiamond } from "react-icons/fa6";

const AboutSection = () => {
  return (
    <section className="bg-bodyBackground w-full text-white py-16">
      <Container>
      <img src="/assets/images/home/IconOnline.svg" alt="Icon" className="mx-auto mb-8" />
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-restora font-thin mb-4">
            Về Chúng Tôi
          </h2>
          <h2 className="text-xs sm:text-sm md:text-base flex justify-center items-center  font-sans font-extralight uppercase tracking-widest mb-6 text-secondaryColor">
                     <FaDiamond className="inline mr-2" style={{ fontSize: "7px" }} /> 
                     Restaurant & Bar
                     <FaDiamond className="inline ml-2" style={{ fontSize: "7px" }} />
                   </h2>
         
          <p className="mt-4 text-gray-300 max-w-xl md:max-w-2xl mx-auto text-sm sm:text-base">
            Nhà hàng của chúng tôi mang đến trải nghiệm ẩm thực phong cách châu
            Âu đầy tinh tế và thú vị, lấy cảm hứng từ Bếp trưởng Chris Hill.
            Thực đơn phục vụ cả ngày là sự hòa quyện tinh hoa của những món
            ngon đặc trưng theo mùa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="flex flex-col space-y-6">
            <img
              src="/assets/images/about/leo_delicioz_h4_about-1.webp"
              alt="Restaurant"
              className="w-full h-auto rounded-lg"
            />
            <div>
              <h3 className="text-5xl md:text-7xl lg:text-8xl font-restora font-extralight text-secondaryColor">
                230+
              </h3>
              <p className="mt-2 font-restora text-lg sm:text-xl">
                Lượt Khách Hàng Ngày
              </p>
              <p className="text-gray-400 mt-4 text-sm sm:text-base">
                Những vị khách ghé thăm mỗi ngày mang lại sức sống cho nhà hàng.
                Tận hưởng không gian ấm cúng và dịch vụ tận tâm.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <img
              src="/assets/images/about/leo_delicioz_h4_about-2.webp"
              alt="Delivery"
              className="w-full h-auto rounded-lg"
            />
            <div>
              <h3 className="text-5xl md:text-7xl lg:text-8xl font-restora font-extralight text-secondaryColor">
                1590+
              </h3>
              <p className="mt-2 font-restora text-lg sm:text-xl">
                Giao Hàng Mỗi Tháng
              </p>
              <p className="text-gray-400 mt-4 text-sm sm:text-base">
                Đội ngũ chúng tôi luôn nỗ lực để phục vụ các món ăn tươi ngon
                đến tận tay khách hàng với sự nhanh chóng và tận tâm.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutSection;