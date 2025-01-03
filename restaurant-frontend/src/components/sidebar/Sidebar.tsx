import React from 'react';
import { BiNews } from 'react-icons/bi';
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaPinterest,
  FaInstagram,
} from 'react-icons/fa';
import { FiUser, FiShoppingCart, FiSearch, FiHeart, FiArrowLeft } from 'react-icons/fi';
import { MdHome, MdMenuBook, MdContactPhone, MdInfo } from 'react-icons/md';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div
    className={`fixed top-0 z-60 left-0 w-72 h-screen bg-headerBackground text-white transition-transform transform ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    } xl:translate-x-0 z-50`}
  >
    <button
      onClick={toggleSidebar}
      className="absolute top-4 right-4 text-secondaryColor :hidden"
    >
      <FiArrowLeft className='text-2xl' />
    </button>
      <div className="w-72 bg-headerBackground text-white h-screen flex flex-col justify-between">

        <div className="p-6">
          <img
            src="./public/assets/images/logo.png"
            alt="Logo"
            className="w-64 h-auto mx-auto"
          />
          <h1 className="text-center text-xl font-semibold">Beef Beef</h1>
          <p className="text-center text-sm text-gray-400">Restaurant & Bar</p>
        </div>

        <nav className="flex flex-col font-sans text-sm px-6">
          <Link
            to="#"
            className="group flex justify-start w-3/5 mx-auto items-center space-x-3 px-2 py-5 text-white hover:text-secondaryColor transition-all duration-300"
          >
            <MdHome className="text-xl" />
            <span className="transform group-hover:translate-x-2 transition-transform duration-300">TRANG CHỦ</span>
          </Link>
          <a
            href="#"
            className="group flex justify-start w-3/5 mx-auto items-center space-x-3 px-2 py-5 text-white hover:text-secondaryColor transition-all duration-300"
          >
            <MdMenuBook className="text-xl" />
            <span className="transform group-hover:translate-x-2 transition-transform duration-300">THỰC ĐƠN</span>
          </a>
          <a
            href="#"
            className="group flex justify-start w-3/5 mx-auto items-center space-x-3 px-2 py-5 text-white hover:text-secondaryColor transition-all duration-300"
          >
            <BiNews className="text-xl" />
            <span className="transform group-hover:translate-x-2 transition-transform duration-300">BÀI VIẾT</span>
          </a>
          <a
            href="#"
            className="group flex justify-start w-3/5 mx-auto items-center space-x-3 px-2 py-5 text-white hover:text-secondaryColor transition-all duration-300"
          >
            <MdInfo className="text-xl" />
            <span className="transform group-hover:translate-x-2 transition-transform duration-300">GIỚI THIỆU</span>
          </a>
          <a
            href="#"
            className="group flex justify-start w-3/5 mx-auto items-center space-x-3 px-2 py-5 text-white hover:text-secondaryColor transition-all duration-300"
          >
            <MdContactPhone className="text-xl" />
            <span className="transform group-hover:translate-x-2 transition-transform duration-300">LIÊN HỆ</span>
          </a>
        </nav>

        <div className="flex flex-col items-center space-y-6 px-6">
          <div className="flex space-x-8 text-2xl">
            <div className="relative">
              <Link to = "/login">   
              <FiUser className="text-white hover:text-secondaryColor" />
              </Link>
            </div>
            <div className="relative">
              <FiHeart className="text-white hover:text-secondaryColor" />
              <span className="absolute -top-1 -right-2 bg-secondaryColor text-black text-xs rounded-full px-1">
                0
              </span>
            </div>
            <div className="relative">
              <FiShoppingCart className="text-white hover:text-secondaryColor" />
              <span className="absolute -top-1 -right-2 bg-secondaryColor text-black text-xs rounded-full px-1">
                0
              </span>
            </div>
            <div className="relative">
              <FiSearch className="text-white hover:text-secondaryColor" />
            </div>
          </div>
          <button className="mx-auto w-[200px] text-sm bg-secondaryColor border border-secondaryColor text-black py-4 hover:text-secondaryColor hover:bg-headerBackground">
            ĐẶT BÀN
          </button>
        </div>

        <div className="p-6">
          <div className="text-center text-sm text-white">
            <p>Booking Info</p>
            <p>71 Madison Ave, New York, USA</p>
            <p>+39-055-123456</p>
            <p>demo@demo.com</p>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <a
              href="#"
              className="group text-white hover:text-secondaryColor transition-all duration-300"
              aria-label="Facebook"
            >
              <FaFacebookF className="transform group-hover:-translate-y-2 transition-transform duration-300" />
            </a>
            <a
              href="#"
              className="group text-white hover:text-secondaryColor transition-all duration-300"
              aria-label="Twitter"
            >
              <FaTwitter className="transform group-hover:-translate-y-2 transition-transform duration-300" />
            </a>
            <a
              href="#"
              className="group text-white hover:text-secondaryColor transition-all duration-300"
              aria-label="YouTube"
            >
              <FaYoutube className="transform group-hover:-translate-y-2 transition-transform duration-300" />
            </a>
            <a
              href="#"
              className="group text-white hover:text-secondaryColor transition-all duration-300"
              aria-label="Pinterest"
            >
              <FaPinterest className="transform group-hover:-translate-y-2 transition-transform duration-300" />
            </a>
            <a
              href="#"
              className="group text-white hover:text-secondaryColor transition-all duration-300"
              aria-label="Instagram"
            >
              <FaInstagram className="transform group-hover:-translate-y-2 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;