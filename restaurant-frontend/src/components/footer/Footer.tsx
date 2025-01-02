import React from "react";
import logo from "../../assets/logo.png";
import { FaFacebookF, FaTwitter, FaYoutube, FaPinterest, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 font-sans py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Logo and Contact Section */}
          <div className="w-full lg:w-1/4 flex flex-col items-center lg:items-start">
            <img src={logo} alt="Logo" className="w-52 h-24 object-cover mb-4 mx-auto lg:mx-0" />
            <div className="text-center lg:text-left space-y-4">
              <p className="text-xs">Nhà Hàng BeefBeef, 161 đường Quốc Hương, Thảo Điền, Quận 2</p>
              <p className="text-xs font-bold text-white">+84 - 05512345, +84 - 06666999</p>
              <p className="text-xs">beefbeef@gmail.com</p>
              <div className="flex justify-center lg:justify-start space-x-4">
                {[FaFacebookF, FaTwitter, FaYoutube, FaPinterest, FaInstagram].map((Icon, index) => (
                  <a key={index} href="#" className="text-gray-400 hover:text-secondaryColor transition">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="flex-1 mt-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Useful Links */}
              <div className="text-left flex flex-row lg:gap-16 gap-16 justify-between">
                <div className="text-left">
                  <h3 className="text-xs font-bold mb-4 text-white whitespace-nowrap">LIÊN KẾT HỮU ÍCH</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-xs hover:text-secondaryColor transition whitespace-nowrap">Địa điểm yêu thích</a></li>
                    <li><a href="#" className="text-xs hover:text-secondaryColor transition whitespace-nowrap">Lịch sử của chúng tôi</a></li>
                    <li><a href="#" className="text-xs hover:text-secondaryColor transition whitespace-nowrap">Liên hệ với chúng tôi</a></li>
                    <li><a href="#" className="text-xs hover:text-secondaryColor transition whitespace-nowrap">Địa điểm thú vị</a></li>
                    <li><a href="#" className="text-xs hover:text-secondaryColor transition whitespace-nowrap">Thương hiệu của chúng tôi</a></li>
                  </ul>
                </div>

                {/* Favorite Choices */}
                <div className="text-left">
                  <h3 className="text-xs font-bold mb-4 text-white whitespace-nowrap">LỰA CHỌN YÊU THÍCH</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-xs hover:text-secondaryColor transition whitespace-nowrap">Cà phê Latte</a></li>
                    <li><a href="#" className="text-xs hover:text-secondaryColor transition whitespace-nowrap">Espresso</a></li>
                    <li><a href="#" className="text-xs hover:text-secondaryColor transition whitespace-nowrap">Cafe Americano</a></li>
                    <li><a href="#" className="text-xs hover:text-secondaryColor transition whitespace-nowrap">Cà phê đá</a></li>
                    <li><a href="#" className="text-xs hover:text-secondaryColor transition whitespace-nowrap">Mocha</a></li>
                  </ul>
                </div>
              </div>

              {/* Newsletter */}
              <div className="text-center lg:text-left">
                <h3 className="text-xs font-bold mb-4 text-white">NHẬN TIN TỨC VÀ ƯU ĐÃI</h3>
                <p className="text-xs mb-4 whitespace-normal">
                  Đăng ký và được giảm giá 10%. Nhận thông tin cập nhật qua email về cửa hàng mới nhất của chúng tôi và các ưu đãi đặc biệt.
                </p>
                <form className="space-y-4">
                  <input
                    className="w-full py-2 px-3 border border-gray-500 bg-black text-white text-xs"
                    type="email"
                    placeholder="✉   Địa chỉ email của bạn"
                  />
                  <button className="w-full py-2 text-xs font-bold bg-secondaryColor text-black border-2 border-transparent hover:bg-black hover:text-secondaryColor hover:border-secondaryColor transition">
                    ĐĂNG KÝ NGAY
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 mt-10 pt-4">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <p className="text-xs">Copyright © 2022 Delicioz. All rights reserved.</p>
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
