import React from "react";
import { MdHome, MdMenuBook, MdContactPhone, MdInfo } from "react-icons/md";
import { BiNews } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", label: "TRANG CHỦ", icon: <MdHome className="text-2xl" /> },
  { path: "/menu", label: "THỰC ĐƠN", icon: <MdMenuBook className="text-2xl" /> },
  { path: "/posts", label: "BÀI VIẾT", icon: <BiNews className="text-2xl" /> },
  { path: "/aboutus", label: "GIỚI THIỆU", icon: <MdInfo className="text-2xl" /> },
  { path: "/contact", label: "LIÊN HỆ", icon: <MdContactPhone className="text-2xl" /> },
];

const NavExtend = () => {
  const location = useLocation();

  return (
    <nav className="flex flex-col font-sans text-sm px-6 space-y-5">
      {navItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={`group flex items-center space-x-4 px-5 py-3 text-sm transition-all duration-300 ${
            location.pathname === item.path
              ? " text-secondaryColor border border-secondaryColor shadow-md"
              : "text-white hover:text-secondaryColor hover:bg-gray-800"
          }`}
        >
          {item.icon}
          <span className="transform group-hover:translate-x-1 transition-transform duration-300">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default NavExtend;