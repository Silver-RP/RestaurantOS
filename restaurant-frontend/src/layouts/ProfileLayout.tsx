import { Outlet } from 'react-router-dom';
import { HiOutlineMenu } from 'react-icons/hi';
import { useState } from 'react';
import ProfileSidebar from '../components/pages/proflie/ProfileSidebar';
import MobileDrawer from '@/components/common/MobileDrawer';

export default function ProfileLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4">
      {/* Nút mở sidebar mobile */}
      <div className="md:hidden mb-4 order-0">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[#FFE0A0] text-[#FFE0A0] hover:bg-[#FFE0A0] hover:text-[#082635] transition"
          aria-label="Mở menu tài khoản"
          aria-expanded={mobileSidebarOpen}
          aria-controls="mobile-profile-drawer"
        >
          <HiOutlineMenu className="text-xl" />
          <span className="font-medium">Tài khoản</span>
        </button>
      </div>

      {/* Sidebar mobile drawer */}
      <MobileDrawer
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        title="Tài khoản"
        drawerId="mobile-profile-drawer"
      >
        <ProfileSidebar onItemClick={() => setMobileSidebarOpen(false)}/>
      </MobileDrawer>

      {/* Nội dung trang con */}
      <div className="flex-1 order-2">
        <Outlet />
      </div>
    </div>
  );
}
