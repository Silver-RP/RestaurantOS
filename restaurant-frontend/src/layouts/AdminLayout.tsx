import React from 'react';
import { Link, Outlet } from 'react-router-dom';
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
  FaImage
} from 'react-icons/fa';
import { GiHotMeal } from 'react-icons/gi';
import classNames from 'classnames';
import { useAdminSidebar } from '../contexts/AdminSidebarContext';
import AdminHeader from '../components/layout/AdminHeader';

const AdminLayout: React.FC = () => {
  const { isSidebarOpen, toggleSidebarExtend } = useAdminSidebar();

  return (
    <div className="flex min-h-screen bg-adminbg text-admintext">
      {/* Sidebar */}
      <aside
        className={classNames(
          'bg-admincard flex flex-col justify-between transition-all duration-300 fixed top-0 left-0 z-50 h-full',
          isSidebarOpen ? 'w-64 px-4' : 'w-16 items-center',
        )}
      >
        <div className="flex flex-col items-center space-y-8 mt-6 flex-1">
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

          <nav className="flex flex-col gap-6 w-full items-center">
            <NavItem
              href="/admin"
              icon={<FaHome />}
              label="Trang chủ"
              expanded={isSidebarOpen}
            />
            <NavItem
              href="/admin/foods"
              icon={<FaUtensils />}
              label="Món ăn"
              expanded={isSidebarOpen}
            />
            <NavItem
              href="/admin/categories"
              icon={<GiHotMeal />}
              label="Danh mục"
              expanded={isSidebarOpen}
            />
            <NavItem
              href="/admin/orders"
              icon={<FaCartPlus />}
              label="Đơn hàng"
              expanded={isSidebarOpen}
            />
            <NavItem
              href="/admin/posts"
              icon={<FaFileAlt />}
              label="Bài viết"
              expanded={isSidebarOpen}
            />
              <NavItem
              href="/admin/users"
              icon={<FaUser />}
              label="Người dùng"
              expanded={isSidebarOpen}
            />

            <NavItem
              href="/admin/banners"
              icon={<FaImage />}
              label="Banner"
              expanded={isSidebarOpen}
            />
            <NavItem
              href="/admin/about"
              icon={<FaInfoCircle />}
              label="Giới thiệu"
              expanded={isSidebarOpen}
            />
            
            <NavItem
              href="/admin/contact"
              icon={<FaEnvelope />}
              label="Liên hệ"
              expanded={isSidebarOpen}
            />
          </nav>
        </div>

        <div className="mb-6 flex justify-center">
          <NavItem
            href="/logout"
            icon={<FaSignOutAlt />}
            label="Đăng xuất"
            expanded={isSidebarOpen}
            className="text-red-400"
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={classNames(
          'flex-1 flex flex-col transition-all duration-300 bg-white',
          isSidebarOpen ? 'ml-64' : 'ml-16',
        )}
      >
        {/* Header */}
        <AdminHeader />

        {/* Page content */}
        <main className="flex-1 bg-white p-6 transition-all duration-300">
          <div className="w-full h-full overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  className?: string;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  icon,
  label,
  expanded,
  className,
}) => {
  return (
    <Link
      to={href}
      className={classNames(
        'flex items-center px-4 py-2 rounded-lg hover:bg-adminhover transition-colors w-full',
        expanded ? 'justify-start gap-3' : 'justify-center',
        className,
      )}
    >
      <span className="text-lg">{icon}</span>
      {expanded && <span className="text-left w-full">{label}</span>}
    </Link>
  );
};

export default AdminLayout;
