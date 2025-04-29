import React from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from '../routers';
import Footer from '../components/layout/footer/Footer';
import ExtendSidebar from '../components/layout/sidebar/ExtendSidebar';
import PrimarySidebar from '../components/layout/sidebar/PrimarySidebar';
import MobileSidebar from '../components/layout/sidebar/MobileSidebar';
import { SidebarProvider, useSidebar } from '../contexts/SidebarContext';

const LayoutContent: React.FC = () => {
  const location = useLocation();
  const hideSidebarFooter = [
    '/login',
    '/register',
    '/reset-password',
    '/verify-otp',
    '/forgot-password',
  ].includes(location.pathname);

  const {
    isSidebarOpen,
    isExtended,
    isMobileSidebarOpen,
    toggleSidebarExtend,
    toggleMobileSidebar,
  } = useSidebar();
 

  console.log('width: ', window.innerWidth);
  console.log('height: ', window.innerHeight);
  const height = window.innerHeight;

  return (
   
    <div className="flex overflow-hidden min-h-screen relative">
      {!hideSidebarFooter && (
        <>
          {/* Sidebar cho desktop */}
          <div className="hidden xl:block">
            {/* Sidebar nhỏ */}
            <div
              className={`fixed top-0 left-0 z-60 h-full w-16 transition-transform duration-300 ${
                isSidebarOpen && !isExtended
                  ? 'translate-x-0'
                  : '-translate-x-16'
              }`}
            >
              <PrimarySidebar toggleSidebar={toggleSidebarExtend} />
            </div>

            {/* Sidebar mở rộng */}
            <div
              className={`fixed top-0 left-0 z-60 h-full transition-transform duration-300 ${
                isSidebarOpen && isExtended
                  ? 'translate-x-0'
                  : '-translate-x-72'
              } 
              ${window.innerHeight >= 600 ? 'w-72' : 'w-64'}`} 
            >
              <div>{height}</div>
              <ExtendSidebar
                isOpen={isExtended}
                toggleSidebar={toggleSidebarExtend}
              />
            </div>
          </div>

          {/* Sidebar mobile */}
          {isMobileSidebarOpen && (
            <>
              <MobileSidebar
                isOpen={isMobileSidebarOpen}
                toggleSidebar={toggleMobileSidebar}
              />
              <div
                className="fixed top-0 left-0 w-full h-full bg-black/50 z-40"
                onClick={toggleMobileSidebar}
              />
            </>
          )}

          {/* Nút toggle sidebar mobile */}
          {!isSidebarOpen && (
            <button
              className="xl:hidden fixed top-5 left-5 z-50 w-10 h-10 bg-secondaryColor p-2 rounded-md flex flex-col justify-center items-center space-y-1"
              onClick={toggleMobileSidebar}
            >
              {!isMobileSidebarOpen ? (
                <>
                  <span className="block w-6 h-0.5 bg-black"></span>
                  <span className="block w-5 h-0.5 bg-black"></span>
                  <span className="block w-6 h-0.5 bg-black"></span>
                </>
              ) : (
                <svg
                  className="h-6 w-6 text-black"
                  fill="none"
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
      {/* <div
        className={`flex-1 min-h-screen bg-white transition-all duration-300 overflow-y-auto 
      ${
        !hideSidebarFooter
          ? isSidebarOpen
            ? isExtended
              ? 'xl:ml-64'
              : 'xl:ml-16'
            : 'ml-0'
          : ''
      }
    `}
      > */}
      <div
        className={`flex-1 min-h-screen bg-white transition-all duration-300 overflow-y-auto 
      ${
        !hideSidebarFooter
          ? isSidebarOpen
            ? isExtended
              ? window.innerHeight >= 600
                ? 'xl:ml-72'
                : 'xl:ml-64'
              : 'xl:ml-16'
            : 'ml-0'
          : ''
      }
    `}
      >
        <AppRoutes />
        {!hideSidebarFooter && <Footer />}
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => (
  <SidebarProvider>
    <LayoutContent />
  </SidebarProvider>
);

export default AppLayout;
