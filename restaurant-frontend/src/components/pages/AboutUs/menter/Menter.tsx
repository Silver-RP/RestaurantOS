import React from "react";
import { FaDiamond } from "react-icons/fa6";
import MenterComponent from "./MenterComponent";

const teamMembers = [
  {
    name: "Lê Hoàng Thạch",
    title: "CEO & FOUNDER",
    description: "Sở hữu chuỗi 50 nhà hàng trên toàn quốc.",
    img: "/assets/images/AboutUs/CEO.svg",
    socials: ["facebook", "twitter", "instagram", "pinterest"],
  },
  {
    name: "Phạm Quang Đại",
    title: "MASTER CHEF",
    description:
      "Đầu bếp hàng đầu tại Pháp được mời về làm bếp trưởng tại nhà hàng với mức lương nghìn đô.",
    img: "/assets/images/AboutUs/Daikhung.svg",
    socials: ["facebook", "twitter", "instagram", "pinterest"],
  },
  {
    name: "Nguyễn Ngọc Phương Uyên",
    title: "PASTRY CHEF",
    description:
      "Nữ đầu bếp tài ba được đánh giá cao về các loại bánh ngọt hàng đầu.",
    img: "/assets/images/AboutUs/PASTRY.svg",
    socials: ["facebook", "twitter", "instagram", "pinterest"],
  },
  {
    name: "Lâm Gia Bảo",
    title: "PASTRY CHEF",
    description:
      "Đầu bếp đi du lịch nhiều nhất Việt Nam nên có kiến thức đa dạng về ẩm thực nhiều nơi trên thế giới.",
    img: "/assets/images/AboutUs/PASTRYCHEF.svg",
    socials: ["facebook", "twitter", "instagram", "pinterest"],
  },
  {
    name: "Nguyễn Thanh Tiến",
    title: "CHEF",
    description: "Mới gia nhập nhà hàng.",
    img: "/assets/images/AboutUs/CHEFPRO.svg",
    socials: ["facebook", "twitter", "instagram", "pinterest"],
  },
  {
    name: "Nguyễn Ngọc Mỹ",
    title: "CEO & FOUNDER",
    description: "Đóng góp 1% cổ phần so với 99% của Lê Hoàng Thạch.",
    img: "/assets/images/AboutUs/CEO1%.svg",
    socials: ["facebook", "twitter", "instagram", "pinterest"],
  },
];

const Menter = () => {
  return (
    <div className="bg-bodyBackground min-h-screen flex items-center justify-center">
      <div className="w-mainContainer sm:w-container95 px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <img
              src="/assets/images/AboutUs/Icon (1).svg"
              alt="Menu Banner"
              className="rounded"
            />
          </div>
          <h1 className="text-white text-[26px] md:text-[36px] font-restora">Đội Ngũ Của Chúng Tôi</h1>
          <h2 className="text-xs sm:text-sm md:text-base flex justify-center items-center font-sans font-extralight uppercase tracking-widest mb-6 text-secondaryColor">
            <FaDiamond className="inline mr-2" style={{ fontSize: "7px" }} />
            AMAZING TEAM
            <FaDiamond className="inline ml-2" style={{ fontSize: "7px" }} />
          </h2>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <MenterComponent key={index} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menter;
