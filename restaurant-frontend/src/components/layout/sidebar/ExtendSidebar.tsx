import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaPinterest,
  FaInstagram,
} from 'react-icons/fa';
import {
  FiUser,
  FiShoppingCart,
  FiSearch,
  FiHeart,
  FiArrowLeft,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import ButtonComponents from '../../common/ButtonComponents';
import NavExtend from './NavExtend';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const ExtendSidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-72 h-screen bg-headerBackground text-white transform transition-all ease-in-out duration-500 ${
        isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      } xl:translate-x-0 z-50`}
    >
      {/* Close button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 text-white hover:text-secondaryColor z-10"
        aria-label="Close Sidebar"
      >
        <FiArrowLeft className="text-2xl" />
      </button>

      {/* Sidebar layout */}
      <div className="w-72 h-screen flex flex-col relative">
        {/* Logo Section */}
        <div className="p-6 flex-shrink-0">
          <img
            src="assets/images/logo.png"
            alt="Logo Beef Beef"
            className="w-40 sm:w-48 md:w-56 lg:w-64 h-auto mx-auto"
          />
          <h1 className="text-center text-xl sm:text-2xl font-restora font-normal">
            Beef Beef
          </h1>
          <p className="text-center font-restora text-xs sm:text-sm text-gray-400">
            Restaurant & Bar
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 scrollbar-custom">
          <NavExtend />

          {/* Icons */}
          <div className="flex flex-col items-center space-y-4 sm:space-y-6 md:space-y-8 mt-6">
            <div className="flex space-x-6 sm:space-x-8 text-lg sm:text-xl">
              <Link to="/login" aria-label="Login">
                <FiUser className="text-white hover:text-secondaryColor" />
              </Link>
              <div className="relative">
                <FiHeart
                  className="text-white hover:text-secondaryColor"
                  aria-label="Favorites"
                />
                <span className="absolute -top-1 -right-2 bg-secondaryColor text-black text-xs rounded-full px-1">
                  0
                </span>
              </div>
              <div className="relative">
                <FiShoppingCart
                  className="text-white hover:text-secondaryColor"
                  aria-label="Shopping Cart"
                />
                <span className="absolute -top-1 -right-2 bg-secondaryColor text-black text-xs rounded-full px-1">
                  0
                </span>
              </div>
              <FiSearch
                className="text-white hover:text-secondaryColor"
                aria-label="Search"
              />
            </div>
            <Link
              to="/booking"
              className="mx-auto w-full"
              aria-label="Book a Table"
            >
              <ButtonComponents
                variant="filled"
                size="large"
                className="w-full text-xs sm:text-sm md:text-base uppercase font-normal"
              >
                Đặt Bàn
              </ButtonComponents>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 flex-shrink-0">
          <div className="text-center text-xs sm:text-sm text-white">
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

export default ExtendSidebar;
