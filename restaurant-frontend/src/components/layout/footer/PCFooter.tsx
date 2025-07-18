import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaYoutube, FaPinterest, FaInstagram, FaClock } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black w-full text-gray-400 pt-14 pb-8 font-sans">
      <div className="w-11/12 md:w-container95 lg:w-container95 xl:w-container95 2xl:w-mainContainer  mx-auto">
        <div className="grid grid-cols-8 xl:grid-cols-15 gap-3">
          <div className="flex flex-col col-span-8 xl:col-span-4  items-center xl:items-start">
              <img
                    src="/assets/images/logo.png"
                    alt="Logo"
                    className="w-48 h-20 object-cover mb-4"
                  />
            <div className="text-center xl:text-left space-y-4 px-6 xs:px-0">
              <p className="text-sm">Nhà Hàng BeefBeef, 161 đường Quốc Hương, Thảo Điền, Quận 2</p>
              <p className="text-sm font-semibold text-white">+84 - 05512345, +84 - 0239991256</p>
              <p className="text-sm">beefbeef@gmail.com</p>
              <div className="flex justify-center xl:justify-start space-x-4">
                {[FaFacebookF, FaTwitter, FaYoutube, FaPinterest, FaInstagram].map((Icon, index) => (
                  <a key={index} href="#" className="text-gray-400 hover:text-secondaryColor transition">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className=" flex flex-col items-center xs:block col-span-8 xs:col-span-4 md:col-span-2 xl:col-span-3">
            <h3 className="md:text-lg text:md font-bold mb-4 mt-5 text-white whitespace-nowrap">GIỜ HOẠT ĐỘNG</h3>
            <ul className="space-y-2 mt-0 xs:mt-7">
              <li><a href="#" className="text-sm hover:text-secondaryColor transition whitespace-nowrap"><FaClock className="inline-block mr-2" /> T2 - T6: 8:00 AM - 10:00 PM</a></li>
              <li><a href="#" className="text-sm hover:text-secondaryColor transition whitespace-nowrap"><FaClock className="inline-block mr-2" /> T7 - CN: 8:00 AM - 11:00 PM</a></li>
            </ul>
          </div>
          <div className="flex flex-col items-center xs:block col-span-8 xs:col-span-4 md:col-span-3 xl:col-span-4 pl-0 md:pl-10">
            <h3 className="md:text-lg text:md font-bold mb-4 mt-5 text-white">HỖ TRỢ KHÁCH HÀNG</h3>
            <ul className="space-y-2 flex flex-col items-center xs:block  mt-0 xs:mt-7">
              <li><Link to="profile/faqs" className="text-sm hover:text-secondaryColor transition">Câu hỏi thường gặp</Link></li>
              <li><Link to="profile/faqs" className="text-sm hover:text-secondaryColor transition">Hỗ trợ đặt bàn</Link></li>
              <li><Link to="profile/faqs" className="text-sm hover:text-secondaryColor transition">Chính sách giao hàng</Link></li>
              <li><Link to="profile/faqs" className="text-sm hover:text-secondaryColor transition">Điều khoản và điều kiện</Link></li>
              <li><Link to="contact" className="text-sm hover:text-secondaryColor transition">Khiếu nại và góp ý</Link></li>
              <li><Link to="/reservation/lookup-reservation" className="text-sm hover:text-secondaryColor transition">Tra cứu đơn đặt bàn</Link></li>
            </ul>
          </div>
          <div className="flex flex-col items-center xs:block col-span-8 md:col-span-3 xl:col-span-4">
            <h3 className="text-lg font-bold mb-4 mt-5 text-white">NHẬN TIN TỨC VÀ ƯU ĐÃI</h3>
            <p className="text-sm mb-4 px-6 xs:px-0 mt-0 xs:mt-7 font-sans whitespace-normal">
              Nhận thông tin cập nhật qua email về cửa hàng mới nhất của chúng tôi và các ưu đãi đặc biệt.
            </p>
            <form className="space-y-4 w-full px-6 xs:px-0">
              <input
                className="w-full py-2 px-3 border border-gray-500 bg-black text-white text-xs"
                type="email"
                placeholder="✉   Địa chỉ email của bạn"
              />
              <button className="w-full py-3 text-xs font-bold bg-secondaryColor text-black border-2 border-transparent hover:bg-black hover:text-secondaryColor hover:border-secondaryColor transition">
                ĐĂNG KÝ NGAY
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-700 col-span-4 mt-10 pt-4">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <p className="text-xs hover:text-secondaryColor transition">
              Copyright © {new Date().getFullYear()} Delicioz. All rights reserved.
            </p>
            <p className="text-xs">
              <a href="#" className="hover:text-secondaryColor transition">Privacy & Cookie Policy | Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;