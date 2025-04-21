import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "../routers";
import Footer from "../components/layout/footer/Footer";
import ExtendSidebar from "../components/layout/sidebar/ExtendSidebar";
import PrimarySidebar from "../components/layout/sidebar/PrimarySidebar";

const AppLayout: React.FC = () => {
  const location = useLocation();
  const hideSidebarFooter = ["/login", "/register", "/reset-password", "/verify-otp", "/forgot-password"].includes(location.pathname);

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isExtended, setIsExtended] = React.useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  const toggleSidebarExtend = () => {
    setIsExtended(!isExtended);
    setIsSidebarOpen(true);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex overflow-hidden relative">
      <div className="z-30">
        {!hideSidebarFooter && (
          <>
            <div className="relative h-screen">
              <div className={`h-screen fixed top-0 z-60 left-0 w-16 transition-all transform duration-500 ${
                isSidebarOpen && !isExtended ? "translate-x-0" : "-translate-x-16"
              }`}>
                <PrimarySidebar toggleSidebar={toggleSidebarExtend} />
              </div>

              <div className={`fixed top-0 z-60 left-0 w-72 h-screen transition-all transform duration-500 ${
                isSidebarOpen && isExtended ? "translate-x-0" : "-translate-x-72"
              }`}>
                <ExtendSidebar isOpen={isExtended} toggleSidebar={toggleSidebarExtend} />
              </div>
            </div>

            {isMobileSidebarOpen && (
              <>
                <div className="fixed top-0 left-0 w-72 h-screen bg-white z-50 transition-transform duration-300 transform">
                  <ExtendSidebar isOpen={isExtended} toggleSidebar={toggleSidebarExtend} />
                </div>
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40" onClick={toggleMobileSidebar}></div>
              </>
            )}

            {!isSidebarOpen && (
              <button
                className="xl:hidden fixed top-5 left-5 z-30 bg-secondaryColor p-2 rounded-md flex flex-col justify-center items-start space-y-1"
                onClick={toggleMobileSidebar}
                aria-label="Toggle Mobile Sidebar"
              >
                <span className="block w-6 h-0.5 bg-black"></span>
                <span className="block w-5 h-0.5 bg-black"></span>
                <span className="block w-6 h-0.5 bg-black"></span>
              </button>
            )}
          </>
        )}
      </div>

      <div className={`flex-1 transition-all duration-300 ${
        !hideSidebarFooter
          ? isSidebarOpen
            ? isExtended
              ? "xl:ml-72"
              : "xl:ml-16"
            : "ml-0"
          : ""
      }`}>
        <AppRoutes />
        {!hideSidebarFooter && <Footer />}
      </div>
    </div>
  );
};

export default AppLayout;