import React from 'react';
import { FiUser, FiShoppingCart, FiHeart, FiSearch } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import ButtonComponents from '../../common/ButtonComponents';
import NavExtend from './NavExtend';
import { BsPersonCheck } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { useGetCart } from '@/hooks/useCart';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { openSearchModal } from '../../../redux/feature/modal/searchModalSlice';
import { toast } from 'react-toastify';

interface MobileSidebarProps {
  toggleSidebar: () => void;
  isOpen: boolean;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  toggleSidebar,
  isOpen,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: cart } = useGetCart();
  const countCart = cart?.items?.length || 0;

  const user = useSelector((state: RootState) => state.auth.userInfo);
  const favoriteCount = useSelector(
    (state: RootState) => state.favorite.items.length,
  );

  const handleNavigation = (path: string, message?: string) => {
    if (user) {
      navigate(path);
      toggleSidebar();
    } else if (message) {
      toast.error(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -288 }}
        animate={{ x: isOpen ? 0 : -288 }}
        exit={{ x: -288 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-72 h-full bg-headerBackground text-white fixed left-0 top-0 z-50"
      >
        <div className="flex flex-col h-full relative">
          <div className="p-6">
            <Link to="/">
              <img
                src="/assets/images/logo.png"
                alt="Logo Beef Beef"
                className="w-40 mx-auto"
              />
            </Link>
            <h1 className="text-center text-xl font-restora">Beef Beef</h1>
            <p className="text-center text-xs text-gray-400 font-restora">
              Restaurant & Bar
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-6">
            <NavExtend onNavigate={handleNavigation} />

            <div className="flex flex-col items-center space-y-6 mt-8">
              <div className="flex space-x-6 text-xl">
                {/* User / Login */}
                {user ? (
                  <Link to="/profile" onClick={toggleSidebar} aria-label="Profile">
                    <BsPersonCheck className="hover:text-secondaryColor" />
                  </Link>
                ) : (
                  <Link to="/login" onClick={toggleSidebar} aria-label="Login">
                    <FiUser className="hover:text-secondaryColor" />
                  </Link>
                )}

                {/* Favorites */}
                <button
                  onClick={() =>
                    handleNavigation('/favorites', 'Vui lòng đăng nhập để xem danh sách yêu thích')
                  }
                  aria-label="Favorites"
                  className="relative"
                >
                  <FiHeart className="hover:text-secondaryColor" />
                  <span className="absolute -top-1 -right-2 bg-secondaryColor text-black text-xs rounded-full px-1">
                    {favoriteCount > 0 ? favoriteCount : 0}
                  </span>
                </button>

                {/* Cart */}
                <button
                  onClick={() =>
                    handleNavigation('/cart', 'Vui lòng đăng nhập để xem giỏ hàng')
                  }
                  aria-label="Shopping Cart"
                  className="relative"
                >
                  <FiShoppingCart className="hover:text-secondaryColor" />
                  <span className="absolute -top-1 -right-2 bg-secondaryColor text-black text-xs rounded-full px-1">
                    {countCart > 0 ? countCart : 0}
                  </span>
                </button>

                {/* Search */}
                <FiSearch
                  onClick={() => dispatch(openSearchModal())}
                  className="hover:text-secondaryColor"
                  aria-label="Search"
                />
              </div>

              {/* Reservation */}
              <ButtonComponents
                variant="filled"
                size="large"
                className="w-full text-xs uppercase"
                onClick={() => handleNavigation('/reservation')}
              >
                Đặt Bàn
              </ButtonComponents>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overlay */}
      <motion.div
        onClick={toggleSidebar}
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 0.5 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex-1 bg-black fixed inset-0 z-40 ${isOpen ? '' : 'pointer-events-none'}`}
      />
    </div>
  );
};

export default MobileSidebar;
