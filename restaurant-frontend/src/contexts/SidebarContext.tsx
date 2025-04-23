import React, { createContext, useContext, useState } from 'react';

interface SidebarContextProps {
  isExtended: boolean;
  setIsExtended: (val: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isExtended, setIsExtended] = useState(true);

  return (
    <SidebarContext.Provider value={{ isExtended, setIsExtended }}>
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