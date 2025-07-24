/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaUser, FaClipboardList, FaMapMarkerAlt, FaStar, FaQuestionCircle, FaSignOutAlt, FaRegClock, FaTicketAlt } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogoutUser } from '../../../redux/feature/auth/authActions';
import { useAppDispatch } from '../../../redux/hook';
import Cookies from 'js-cookie';
import React from 'react';
import { socket } from '../../../utils/socket'; 
const sidebarItems = [
  { title: 'Thông tin tài khoản', icon: <FaUser />, path: '/profile' },
  { title: 'Lịch sử đơn hàng', icon: <FaClipboardList />, path: '/profile/orders' },
  { title: 'Lịch sử đặt bàn', icon: <FaRegClock />, path: '/profile/my-reservation' },
  { title: 'Sổ địa chỉ', icon: <FaMapMarkerAlt />, path: '/profile/address' },
  { title: 'Voucher của tôi', icon: <FaTicketAlt/>, path: '/profile/user-vouchers' },
  { title: 'Đánh giá và phản hồi', icon: <FaStar />, path: '/profile/reviews' },
  { title: 'Chính sách và câu hỏi thường gặp', icon: <FaQuestionCircle />, path: '/profile/faqs' },
];


const ProfileSidebar = () => {
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
    const isGoogleLogin = userInfo?.isGoogleLogin;
    const userId = userInfo?._id; // 👈 Đảm bảo bạn có userId
    if (userId) {
      socket.emit('manualDisconnect', { userId });
      socket.disconnect();
    }

    if (isGoogleLogin) {
      const email = userInfo?.email;
      if (email && (window as any).google?.accounts.id.revoke) {
        (window as any).google.accounts.id.revoke(email, () => {
          console.log('Google session revoked');
          Cookies.remove('userInfo');
          localStorage.removeItem('token');
          clearAuthData();
          navigate('/');
        });
      } else {
        (window as any).google?.accounts.id.disableAutoSelect?.();
        Cookies.remove('userInfo');
        localStorage.removeItem('token');
        clearAuthData();
        setTimeout(() => {
          navigate('/');
        }, 100);
      }
      return;
    }

    try {
      await dispatch(LogoutUser()).unwrap();
      console.log('LogoutUser called');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setTimeout(() => {
        window.location.href = '/login'; 
      }, 100);
    }
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
        <FaSignOutAlt className="text-lg" /> Đăng xuất
      </button>
    </div>
  );
};

export default ProfileSidebar;