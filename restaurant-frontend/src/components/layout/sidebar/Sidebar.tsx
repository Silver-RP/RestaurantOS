import React from "react";
import ExtendSidebar from "./ExtendSidebar";
import PrimarySidebar from "./PrimarySidebar";

interface SidebarProps {
  isExtended: boolean;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExtended, isOpen, toggleSidebar }) => {
  return (
    <div className="relative h-screen">
      <div
        className={`h-screen fixed top-0 z-60 left-0 w-16 transition-opacity transform duration-500 ${
          isExtended
            ? "opacity-0 -translate-x-0 pointer-events-none"
            : "opacity-100 translate-x-0 pointer-events-auto"
        }`}
      >
        <PrimarySidebar toggleSidebar={toggleSidebar} />
      </div>

      <div
        className={`fixed top-0 z-60 left-0 w-72 h-screen transition-opacity transform duration-500 ${
          isOpen
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 translate-x-0 pointer-events-none"
        }`}
      >
        <ExtendSidebar isOpen={isExtended} toggleSidebar={toggleSidebar} />
      </div>
    </div>
  );
};

export default Sidebar;