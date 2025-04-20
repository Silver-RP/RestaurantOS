import React from 'react';
import { FaUser, FaClipboardList, FaMapMarkerAlt, FaStar, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const sidebarItems = [
  { title: 'Thông tin tài khoản', icon: <FaUser />, path: '/profile' },
  { title: 'Lịch sử đơn hàng', icon: <FaClipboardList />, path: '/profile/orders' },
  { title: 'Sổ địa chỉ', icon: <FaMapMarkerAlt />, path: '/profile/address' },
  { title: 'Đánh giá và phản hồi', icon: <FaStar />, path: '/profile/reviews' },
  { title: 'Chính sách và câu hỏi thường gặp', icon: <FaQuestionCircle />, path: '/profile/faq' },
];

const ProfileSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logout clicked');
    navigate('/login');
  };

  return (
    <div className="flex flex-col gap-4 font-sans">
      {sidebarItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.title}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-md border transition-all text-base
              ${isActive
                ? 'bg-[#FFE0A0] text-headerBackground font-semibold'
                : 'bg-transparent text-white hover:bg-[#FFE0A0]/20 hover:text-headerBackground'}
              border-[#FFE0A0]
            `}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.title}</span>
          </Link>
        );
      })}

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-md border text-white text-left transition-all hover:bg-red-500 hover:border-red-500 hover:text-white border-[#FFE0A0] text-base"
      >
        <FaSignOutAlt className="text-lg" />
        <span>Đăng xuất</span>
      </button>
    </div>
  );
};

export default ProfileSidebar;