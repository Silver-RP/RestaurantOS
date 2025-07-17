import React, { useState, useEffect } from 'react';
import { MdHome, MdMenuBook, MdContactPhone, MdInfo } from 'react-icons/md';
import { BiNews } from 'react-icons/bi';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavExtendProps {
  onNavigate?: (path: string) => void; 
}

const navItems = [
  { path: '/', label: 'TRANG CHỦ', icon: <MdHome className="text-2xl" /> },
  {
    path: 'menu?sort=categoryAZ',
    label: 'THỰC ĐƠN',
    icon: <MdMenuBook className="text-2xl" />,
  },
  { path: '/posts', label: 'BÀI VIẾT', icon: <BiNews className="text-2xl" /> },
  {
    path: '/aboutus',
    label: 'GIỚI THIỆU',
    icon: <MdInfo className="text-2xl" />,
  },
  {
    path: '/contact',
    label: 'LIÊN HỆ',
    icon: <MdContactPhone className="text-2xl" />,
  },
];

const NavExtend: React.FC<NavExtendProps> = ({ onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // Hook dùng để cập nhật chiều cao cửa sổ khi thay đổi kích thước
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Clean up listener khi component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const fontSize = windowHeight <= 600 ? 'text-xs' : 'text-sm'; 
  const iconSize = windowHeight <= 600 ? 'text-xs' : 'text-sm'; 

  return (
    <nav className="flex flex-col font-sans text-sm px-6 space-y-5">
      {navItems.map((item, index) => (
        <button
          key={index}
          onClick={() => handleClick(item.path)}
          className={`group flex items-center  ${iconSize}  space-x-4 px-5 py-3 text-sm transition-all duration-300 w-full text-left ${
            location.pathname === item.path
              ? "text-secondaryColor border border-secondaryColor shadow-md"
              : "text-white hover:text-secondaryColor hover:bg-gray-800"
          }`}
        >
          {item.icon}
          <span 
          className={`transform group-hover:translate-x-1 ${fontSize}  transition-transform duration-300`}
          >
            {item.label}
          </span>
        </button>
      ))}
    </nav>
    
  );
};

export default NavExtend;
