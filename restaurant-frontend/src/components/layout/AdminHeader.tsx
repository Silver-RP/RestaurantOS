import React from 'react';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { FaUserCircle } from 'react-icons/fa';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

const AdminHeader: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.user);
    
  return (
    <header className="h-20 px-6 flex items-center justify-between backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-md sticky top-0 z-30">
      <div className="flex items-center gap-3 text-admintext font-bold text-2xl">
        <HiOutlineMenuAlt2 className="text-blue-600" />
        <span>Beef Beef Dashboard</span>
      </div>

      <div className="flex items-center gap-3 text-gray-700">
        <span className="text-sm font-medium hidden sm:block">{user?.username}</span>
        <FaUserCircle className="text-2xl text-blue-500" />
      </div>
    </header>
  );
};

export default AdminHeader;