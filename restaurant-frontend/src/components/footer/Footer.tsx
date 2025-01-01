import React from "react";
import logo from "../../assets/logo.png";
import { FaFacebookF, FaTwitter, FaYoutube, FaPinterest, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 font-sans py-5">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-x-14">
        {/* Logo and Contact */}
        <div className="w-56  space-y-4 lg:space-y-5 mt-4">
          <img src={logo} alt="Logo" className="w-52 h-24 object-cover mb-4" />
          <p className="text-xs w-56">Nhà Hàng BeefBeef, 161 đường Quốc Hương, Thảo Điền, Quận 2</p>
          <p className="text-xs font-bold w-56">+84 - 05512345, +84 - 06666999</p>
          <p className="text-xs">beefbeef@gmail.com</p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-secondaryColor transition">
              <FaFacebookF size={18} />
            </a>
            <a href="#" className="text-gray-400 hover:text-secondaryColor transition">
              <FaTwitter size={18} />
            </a>
            <a href="#" className="text-gray-400 hover:text-secondaryColor transition">
              <FaYoutube size={18} />
            </a>
            <a href="#" className="text-gray-400 hover:text-secondaryColor transition">
              <FaPinterest size={18} />
            </a>
            <a href="#" className="text-gray-400 hover:text-secondaryColor transition">
              <FaInstagram size={18} />
            </a>
          </div>
        </div>

        {/* Useful Links */}
        <div className="w-40  mt-20">
          <h3 className="text-xs font-bold mb-4">LIÊN KẾT HỮU ÍCH</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-xs hover:text-secondaryColor transition">Địa điểm yêu thích</a></li>
            <li><a href="#" className="text-xs hover:text-secondaryColor transition">Lịch sử của chúng tôi</a></li>
            <li><a href="#" className="text-xs hover:text-secondaryColor transition">Liên hệ với chúng tôi</a></li>
            <li><a href="#" className="text-xs hover:text-secondaryColor transition">Địa điểm thú vị</a></li>
            <li><a href="#" className="text-xs hover:text-secondaryColor transition">Thương hiệu của chúng tôi</a></li>
          </ul>
        </div>

        {/* Favorite Choices */}
        <div className="w-36 mt-20">
          <h3 className="text-xs font-bold mb-4 w-36">LỰA CHỌN YÊU THÍCH</h3>
          <ul className="space-y-2 w-36">
            <li><a href="#" className="text-xs hover:text-secondaryColor transition">Cà phê Latte</a></li>
            <li><a href="#" className="text-xs hover:text-secondaryColor transition">Esspreso</a></li>
            <li><a href="#" className="text-xs hover:text-secondaryColor transition">Cafe Americano</a></li>
            <li><a href="#" className="text-xs hover:text-secondaryColor transition">Cà phê đá</a></li>
            <li><a href="#" className="text-xs hover:text-secondaryColor transition">Mocha</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="w-40 flex-1 mt-20">
          <h3 className="text-xs font-bold mb-4">NHẬN TIN TỨC VÀ ƯU ĐÃI</h3>
          <p className="text-xs mb-4">
            Đăng ký và được giảm giá 10%. Nhận thông tin cập nhật qua email về cửa hàng mới nhất của chúng tôi và các ưu đãi đặc biệt.
          </p>
          <form className="space-y-4">
            <input
              className="w-full py-2 px-3 border border-gray-500 bg-black text-white text-center text-xs"
              type="email"
              placeholder="✉   Địa chỉ email của bạn"
            />
           <button className="w-full py-2 text-xs font-bold bg-secondaryColor text-black border-2 border-transparent hover:bg-black hover:text-secondaryColor hover:border-secondaryColor transition">
  ĐĂNG KÝ NGAY
</button>

          </form>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-4 text-xs flex justify-between items-center">
        <p className="ml-24">Copyright © 2022 Delicioz. All rights reserved.</p>
        <p className="mr-24">
          <a href="#" className="hover:text-secondaryColor transition">Privacy & Cookie Policy | Terms of Service</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
