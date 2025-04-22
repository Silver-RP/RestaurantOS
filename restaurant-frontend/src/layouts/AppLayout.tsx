import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from '../routers';
import Footer from '../components/layout/footer/Footer';
import ExtendSidebar from '../components/layout/sidebar/ExtendSidebar';
import PrimarySidebar from '../components/layout/sidebar/PrimarySidebar';
import MobileSidebar from '../components/layout/sidebar/MobileSidebar';
import { SidebarProvider } from '../contexts/SidebarContext';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const hideSidebarFooter = [
    '/login',
    '/register',
    '/reset-password',
    '/verify-otp',
    '/forgot-password',
  ].includes(location.pathname);

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
    <SidebarProvider>
      <div className="flex overflow-hidden relative">
        {!hideSidebarFooter && (
          <>
            <div className="relative hidden xl:block">
              <div
                className={`h-screen fixed top-0 left-0 z-60 w-16 transition-transform duration-500 ${isSidebarOpen && !isExtended ? 'translate-x-0' : '-translate-x-16'}`}
              >
                <PrimarySidebar toggleSidebar={toggleSidebarExtend} />
              </div>
              <div
                className={`h-screen fixed top-0 left-0 z-60 w-72 transition-transform duration-500 ${isSidebarOpen && isExtended ? 'translate-x-0' : '-translate-x-72'}`}
              >
                <ExtendSidebar
                  isOpen={isExtended}
                  toggleSidebar={toggleSidebarExtend}
                />
              </div>
            </div>

            {isMobileSidebarOpen && (
              <>
                <MobileSidebar
                  isOpen={isMobileSidebarOpen}
                  toggleSidebar={toggleMobileSidebar}
                />
                <div
                  className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
                  onClick={toggleMobileSidebar}
                ></div>
              </>
            )}

            {!isSidebarOpen && (
              <button
                className="xl:hidden fixed top-5 w-[35px] h-[35px] left-5 z-50 bg-secondaryColor p-2 rounded-md flex flex-col justify-center items-center space-y-1"
                onClick={toggleMobileSidebar}
                aria-label="Toggle Mobile Sidebar"
              >
                {!isMobileSidebarOpen ? (
                  <>
                    <span className="block w-6 h-0.5 bg-black"></span>
                    <span className="block w-5 h-0.5 bg-black"></span>
                    <span className="block w-6 h-0.5 bg-black"></span>
                  </>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            )}
          </>
        )}

        <div
          className={`flex-1 transition-all duration-300 ${!hideSidebarFooter ? (isSidebarOpen ? (isExtended ? 'xl:ml-72' : 'xl:ml-16') : 'ml-0') : ''}`}
        >
          <AppRoutes />
          {!hideSidebarFooter && <Footer />}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
