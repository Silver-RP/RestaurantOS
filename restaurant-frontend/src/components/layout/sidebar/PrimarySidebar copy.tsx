import React from "react";
import {
  FaHome,
  FaUtensils,
  FaRegListAlt,
  FaPhoneAlt,
  FaHeart,
  FaShoppingBag,
  FaUserAlt,
  FaSearch,
} from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { MdInfo } from "react-icons/md";
import { useLocation, Link } from "react-router-dom";

interface PrimarySidebarProps {
  toggleSidebar: () => void;
}

const PrimarySidebar: React.FC<PrimarySidebarProps> = ({ toggleSidebar }) => {
  const location = useLocation();

  const menuItemsMain = [
    { icon: <FaHome />, label: "Trang chủ", link: "/" },
    { icon: <FaUtensils />, label: "Thực đơn", link: "/menu" },
    { icon: <FaRegListAlt />, label: "Bài viết", link: "/post" },
    { icon: <MdInfo />, label: "Giới thiệu", link: "/aboutus" },
    { icon: <FaPhoneAlt />, label: "Liên hệ", link: "/contact" },
  ];

  const menuItemsBottom = [
    { icon: <FaHeart />, label: "Yêu thích", link: "/favorites" },
    { icon: <FaShoppingBag />, label: "Giỏ hàng", link: "/cart" },
    { icon: <FaUserAlt />, label: "Tài khoản", link: "/profile" },
    { icon: <FaSearch />, label: "Tìm kiếm", link: "/search" },
  ];

  return (
    <div className="h-screen fixed top-0 left-0 w-16 bg-headerBackground transform transition-transform duration-300 flex flex-col items-center py-4 justify-start">
      <div className="flex flex-col items-center space-y-6">
        <div className="p-2 w-12 h-12 flex items-center justify-center mb-4">
          <button onClick={toggleSidebar} aria-label="Close Sidebar">
            <FiArrowRight className="text-white hover:text-secondaryColor text-2xl" />
          </button>
        </div>
        <div className="p-2 w-20 h-20 flex items-center justify-center mb-6">
          <img
            src="/assets/images/logo.png"
            alt="Logo"
            className="w-10 h-auto mx-auto"
          />
        </div>
        <div className="space-y-4 sm:space-y-6">
          {menuItemsMain.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`relative h-1/6 sm:h-1/4 flex items-center justify-center group transition text-base sm:text-lg ${
                location.pathname === item.link
                  ? "text-secondaryColor"
                  : "text-white hover:text-secondaryColor"
              }`}
            >
              <div className="text-xl">{item.icon}</div>
              <span
                className={`absolute left-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300 bg-headerBackground text-secondaryColor uppercase text-xs md:text-sm px-4 py-2 shadow-lg whitespace-nowrap`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6 mt-32 sm:mt-56">
        {menuItemsBottom.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className={`relative h-1/6 sm:h-1/4 flex items-center justify-center group transition ${
              location.pathname === item.link
                ? "text-secondaryColor"
                : "text-white hover:text-secondaryColor"
            }`}
          >
            <div className="text-xl">{item.icon}</div>
            <span
              className={`absolute left-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300 bg-headerBackground text-secondaryColor uppercase text-xs md:text-sm px-4 py-2 shadow-lg whitespace-nowrap`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PrimarySidebar;
