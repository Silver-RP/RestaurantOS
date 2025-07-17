import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
// Bỏ import toastService vì không sử dụng nữa
// import { toastService } from '@/utils/toastService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Cookies from 'js-cookie';
import {
  FiUser,
  FiShoppingCart,
  FiSearch,
  FiHeart,
  FiArrowLeft,
} from 'react-icons/fi';
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaPinterest,
  FaInstagram,
} from 'react-icons/fa';
import { BsPersonCheck } from 'react-icons/bs';
import ButtonComponents from '../../common/ButtonComponents';
import NavExtend from './NavExtend';
import { openSearchModal } from '../../../redux/feature/modal/searchModalSlice';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const ExtendSidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const { data: cart } = useGetCart();
  const { isAuthenticated } = useAuth();
  const countCart = cart?.items?.length || 0;
  const favoriteCount = useSelector(
    (state: RootState) => state.favorite.items.length,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = useNavigate();

  const handleReservationClick = () => {
    navigate('/reservation');
  };

  const fontSize = windowHeight <= 600 ? 'text-sm' : 'text-base';
  const iconSize = windowHeight <= 600 ? 'text-xl' : 'text-2xl';

  const userInfo = Cookies.get('userInfo');
  const user = userInfo ? JSON.parse(userInfo) : null;

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-headerBackground text-white transform transition-all ease-in-out duration-500 ${
        isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      } xl:translate-x-0 z-50`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 text-white hover:text-secondaryColor z-10"
        aria-label="Close Sidebar"
      >
        <FiArrowLeft className="text-2xl" />
      </button>

      <div className="h-screen flex flex-col relative">
        <div className="p-6 flex-shrink-0">
          <img
            src="/assets/images/logo.png"
            alt="Logo Beef Beef"
            className="w-40 md:w-48 lg:w-56 h-auto mx-auto"
          />
          <h1 className={`text-center ${fontSize} font-restora font-normal`}>
            Beef Beef
          </h1>
          <p className="text-center font-restora text-xs sm:text-sm text-gray-400">
            Restaurant & Bar
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 scrollbar-custom">
          <div className="flex justify-center">
            <NavExtend />
          </div>

          <div className="flex flex-col items-center space-y-4 sm:space-y-6 md:space-y-8 mt-6">
            <div className="flex space-x-6 sm:space-x-8 text-lg sm:text-xl">
              {user ? (
                <Link to="/profile" aria-label="Login">
                  <BsPersonCheck
                    className={`text-white hover:text-secondaryColor ${iconSize}`}
                  />
                </Link>
              ) : (
                <Link to="/login" aria-label="Login">
                  <FiUser
                    className={`text-white hover:text-secondaryColor ${iconSize}`}
                  />
                </Link>
              )}
              <div className="relative">
                <Link to="/favorites" aria-label="Favorites">
                  <FiHeart
                    className={`text-white hover:text-secondaryColor ${iconSize}`}
                    aria-label="Favorites"
                  />
                </Link>
                <span className="absolute -top-1 -right-2 bg-secondaryColor text-black text-xs rounded-full px-1">
                  {favoriteCount > 0 ? favoriteCount : 0}
                </span>
              </div>
              <div className="relative">
                <Link to="/cart" aria-label="cart">
                  <FiShoppingCart
                    className={`text-white hover:text-secondaryColor ${iconSize}`}
                    aria-label="Shopping Cart"
                  />
                </Link>
                <span className="absolute -top-1 -right-2 bg-secondaryColor text-black text-xs rounded-full px-1">
                  {isAuthenticated ? countCart : 0}
                </span>
              </div>
              <FiSearch
                onClick={() => dispatch(openSearchModal())}
                className={`text-white hover:text-secondaryColor ${iconSize} cursor-pointer`}
                aria-label="Search"
              />
            </div>
            <div className="mx-auto w-full" aria-label="Book a Table">
              <ButtonComponents
                variant="filled"
                size="large"
                onClick={handleReservationClick}
                className="w-full text-xs sm:text-sm md:text-base uppercase font-normal"
              >
                Đặt Bàn
              </ButtonComponents>
            </div>
          </div>
          <div className="p-6">
            <div className="text-center text-sm text-white">
              <p>Đặt bàn tại</p>
              <p>Nhà Hàng BeefBeef, 161 đường Quốc Hương, Thảo Điền, Quận 2</p>
              <p>+84 - 0239991255</p>
              <p>beefbeef@gmail.com</p>
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
    </div>
  );
};

export default ExtendSidebar;
