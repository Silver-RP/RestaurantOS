import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaPinterest,
  FaInstagram,
} from 'react-icons/fa';
import { FiUser, FiShoppingCart, FiSearch, FiHeart, FiArrowLeft } from 'react-icons/fi';
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
      className={`fixed top-0 z-60 left-0 w-72 h-screen bg-headerBackground text-white transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } xl:translate-x-0 z-50`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 text-white hover:text-secondaryColor"
        aria-label="Close Sidebar"
      >
        <FiArrowLeft className="text-2xl" />
      </button>

      <div className="w-72 bg-headerBackground text-white h-screen flex flex-col justify-between">
        <div className="p-6">
          <img
            src="assets/images/logo.png"
            alt="Logo Beef Beef"
            className="w-64 h-auto mx-auto"
          />
          <h1 className="text-center text-2xl font-restora font-normal">Beef Beef</h1>
          <p className="text-center font-restora text-sm text-gray-400">Restaurant & Bar</p>
        </div>

        <NavExtend></NavExtend>

        <div className="flex flex-col items-center space-y-6 px-6">
          <div className="flex space-x-8 text-2xl">
            <div className="relative">
              <Link to="/login" aria-label="Login">
                <FiUser className="text-white hover:text-secondaryColor" />
              </Link>
            </div>
            <div className="relative">
              <FiHeart className="text-white hover:text-secondaryColor" aria-label="Favorites" />
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
            <div className="relative">
              <FiSearch className="text-white hover:text-secondaryColor" aria-label="Search" />
            </div>
          </div>
          <Link
            to="/booking"
            className="mx-auto w-full"
            aria-label="Book a Table"
          >
            <ButtonComponents variant='filled' size='large'  className='w-full uppercase font-normal'>Đặt Bàn</ButtonComponents>
          </Link>
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

export default ExtendSidebar;