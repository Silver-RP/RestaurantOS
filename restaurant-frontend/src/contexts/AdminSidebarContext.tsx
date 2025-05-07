import React, { createContext, useContext, useState } from 'react';

interface AdminSidebarContextProps {
  isSidebarOpen: boolean;
  toggleSidebarExtend: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextProps | undefined>(undefined);

export const AdminSidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebarExtend = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <AdminSidebarContext.Provider value={{ isSidebarOpen, toggleSidebarExtend }}>
      {children}
    </AdminSidebarContext.Provider>
  );
};

export const useAdminSidebar = () => {
  const context = useContext(AdminSidebarContext);
  if (!context) {
    throw new Error('useAdminSidebar must be used within an AdminSidebarProvider');
  }
  return context;
};
