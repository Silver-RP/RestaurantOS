import React, { createContext, useContext, useEffect, useState } from 'react';

interface SidebarContextProps {
  isSidebarOpen: boolean;
  isExtended: boolean;
  isMobileSidebarOpen: boolean;
  toggleSidebarExtend: () => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isExtended, setIsExtended] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebarExtend = () => {
    setIsExtended((prev) => !prev);
    setIsSidebarOpen(true);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setIsSidebarOpen(false);
        setIsExtended(false);
      } else {
        setIsSidebarOpen(true);
        setIsMobileSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        isExtended,
        isMobileSidebarOpen,
        toggleSidebarExtend,
        toggleMobileSidebar,
        closeMobileSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
