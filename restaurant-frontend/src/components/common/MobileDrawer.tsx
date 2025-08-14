import React from 'react';
import { HiOutlineX } from 'react-icons/hi';

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  drawerId: string;
  children: React.ReactNode;
};

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  open,
  onClose,
  title = 'Menu',
  drawerId,
  children,
}) => (
  <div className="md:hidden">
    {/* Backdrop với hiệu ứng mờ */}
    <div
      className={
        `fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ` +
        (open
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none')
      }
      onClick={onClose}
      aria-hidden={!open}
    />

    {/* Panel trượt từ trái */}
    <aside
      id={drawerId}
      className={
        `fixed z-50 left-0 top-0 h-full w-[85%] max-w-sm bg-bodyBackground text-white ` +
        `border-r border-[#FFE0A0] shadow-xl p-4 overflow-y-auto transform transition-transform duration-300 ease-out ` +
        (open ? 'translate-x-0' : '-translate-x-full')
      }
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          type="button"
          aria-label="Đóng"
          onClick={onClose}
          className="p-2 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFE0A0]/60"
        >
          <HiOutlineX className="text-2xl" />
        </button>
      </div>
      {children}
    </aside>
  </div>
);

export default MobileDrawer;
