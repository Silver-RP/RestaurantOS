import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaUtensils,
  FaFileAlt,
  FaInfoCircle,
  FaEnvelope,
  FaSignOutAlt,
  FaAngleLeft,
  FaAngleRight,
  FaUser,
  FaCartPlus,
  FaImage,
  FaTicketAlt,
  FaBell,
  FaCrown,
} from 'react-icons/fa';
import { GiHotMeal, GiWheat } from 'react-icons/gi';
import { FaCalendarAlt } from 'react-icons/fa';
import classNames from 'classnames';
import { useAdminSidebar } from '../contexts/AdminSidebarContext';
import AdminHeader from '../components/layout/AdminHeader';
import { LogoutUser } from '../redux/feature/auth/authActions';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hook';
import { BsChatDots } from 'react-icons/bs';

const AdminLayout: React.FC = () => {
  const { isSidebarOpen, toggleSidebarExtend } = useAdminSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const clearAuthData = () => {
    Cookies.remove('userInfo');
    Cookies.remove('refreshToken');
    Cookies.remove('accessToken');
    localStorage.removeItem('token');
    console.log('Auth data cleared');
  };

  const handleLogout = async () => {

    const userInfo = JSON.parse(Cookies.get('userInfo') || '{}');

    if (userInfo) {
        (window as any).google?.accounts.id.disableAutoSelect?.();
        Cookies.remove('userInfo');
        localStorage.removeItem('token');
        clearAuthData();
        setTimeout(() => {
          navigate('/admin/login'); 
        }, 1000);
      return;
    }
    

    try {
      await dispatch(LogoutUser()).unwrap(); 
      console.log('LogoutUser called');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setTimeout(() => {
        navigate('/admin/login');
      }, 100);
    }
  };

  return (
    <div className="flex min-h-screen bg-adminbg text-admintext">
      {/* Sidebar */}
      <aside
        className={classNames(
          'bg-admincard flex flex-col justify-between transition-all duration-300 fixed top-0 left-0 z-50 h-full overflow-y-auto', // 👈 thêm overflow-y-auto
          isSidebarOpen ? 'w-[200px] px-4' : 'w-16 items-center',
        )}
      >
        <div className="flex max-w-[200px] flex-col items-center space-y-8 mt-6 flex-1">
          <button
            className={classNames(
              'text-adminprimary focus:outline-none transition-all',
              isSidebarOpen ? 'self-end mr-2' : 'self-center',
            )}
            onClick={toggleSidebarExtend}
          >
            {isSidebarOpen ? (
              <FaAngleLeft className="w-5 h-5" />
            ) : (
              <FaAngleRight className="w-5 h-5" />
            )}
          </button>

          <nav className="flex flex-col gap-6 w-full max-w-[200px items-center">
            <NavItem
              href="/admin"
              icon={<FaHome />}
              label="Trang chủ"
              expanded={isSidebarOpen}
              currentPath={location.pathname}
            />
            <NavItem
              href="/admin/foods"
              icon={<FaUtensils />}
              label="Món ăn"
              expanded={isSidebarOpen}
              currentPath={location.pathname}
            />
            <NavItem
              href="/admin/categories"
              icon={<GiHotMeal />}
              label="Danh mục"
              expanded={isSidebarOpen}
              currentPath={location.pathname}
            />
            <NavItem
              href="/admin/orders"
              icon={<FaCartPlus />}
              label="Đơn hàng"
              expanded={isSidebarOpen}
              currentPath={location.pathname}
            />
            <NavItem
              href="/admin/reservations"
              icon={<FaCalendarAlt />}
              label="Đặt bàn"
              expanded={isSidebarOpen}
              currentPath={location.pathname}
            />
            <NavItem
              href="/admin/posts"
              icon={<FaFileAlt />}
              label="Bài viết"
              expanded={isSidebarOpen}
              currentPath={location.pathname}
            />
            <NavItem
              href="/admin/users"
              icon={<FaUser />}
              label="Người dùng"
              expanded={isSidebarOpen}
              currentPath={location.pathname}
            />

            <NavItem
              href="/admin/ingredients"
              icon={<GiWheat />}
              label="Nguyên liệu"
              expanded={isSidebarOpen}
              currentPath={location.pathname}
            />

            <NavItem
              href="/admin/banners"
              icon={<FaImage />}
              label="Banner"
              expanded={isSidebarOpen}
              currentPath={location.pathname}
            />

            <NavItem
              href="/admin/vouchers"
              icon={<FaTicketAlt />}
              label="Voucher"
              expanded={isSidebarOpen}
              currentPath={location.pathname}
            />
            <NavItem 
            href="/admin/chatbox"
            icon={<BsChatDots />}
            label="Chatbox"
            expanded={isSidebarOpen}
            currentPath={location.pathname}
            />

            <NavItem
              href="/admin/loyalty"
              icon={<FaCrown />}
              label="Tích điểm"
              expanded={isSidebarOpen}
              currentPath={location.pathname}
            />

          </nav>
        </div>

        <div className="my-5 flex justify-center">
          <NavItem
            onClick={handleLogout}
            icon={<FaSignOutAlt />}
            label="Đăng xuất"
            expanded={isSidebarOpen}
            className="text-red-400"
            currentPath={location.pathname} href={''}          />
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={classNames(
          'flex-1 flex flex-col transition-all duration-300 bg-white',
          isSidebarOpen ? 'ml-[200px]' : 'ml-16',
        )}
      >
        {/* Header */}
        <AdminHeader />

        {/* Page content */}
        <main className="flex-1 w-full bg-white p-6 transition-all duration-300">
          <div className="w-full h-full overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

interface NavItemProps {
  onClick?: () => void;
  href: string;
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  className?: string;
  currentPath?: string;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  icon,
  label,
  expanded,
  className,
  currentPath = '',
  onClick,
}) => {
  const isActive = currentPath === href;

  const classes = classNames(
    'flex items-center px-4 py-2 rounded-lg transition-colors w-full',
    expanded ? 'justify-start gap-3' : 'justify-center',
    isActive ? '!bg-[#012B40] !text-[#ffffff] ' : 'hover:bg-adminhover',
    className,
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={classes}
      >
        <span className="text-lg">{icon}</span>
        {expanded && <span className="text-left w-full">{label}</span>}
      </button>
    );
  }

  return (
    <Link to={href} className={classes}>
      <span className="text-lg">{icon}</span>
      {expanded && <span className="text-left w-full">{label}</span>}
    </Link>
  );
};


export default AdminLayout;
