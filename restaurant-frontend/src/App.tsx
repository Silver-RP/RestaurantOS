import React, { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppRoutes from "./routers";
import Footer from "./components/layout/footer/Footer";
<<<<<<< HEAD
import Sidebar from "./components/layout/sidebar/Sidebar";



=======
import ExtendSidebar from "./components/layout/sidebar/ExtendSidebar";
import PrimarySidebar from "./components/layout/sidebar/PrimarySidebar";
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import 'react-toastify/dist/ReactToastify.css';
>>>>>>> 9a9d0d57fb85df353c6d942b4285a62524fd05ab
const AppLayout = () => {
  const location = useLocation();
  const hideSidebarFooter = ["/login", "/register" , "/reset-password", "/verify-otp", "/forgot-password"].includes(location.pathname);

  // State quản lý Sidebar chính
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isExtended, setIsExtended] = React.useState(true);

  // State quản lý Sidebar trên Mobile
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  // Quản lý trạng thái Sidebar (Desktop/Mobile)
  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

  // Quản lý chuyển đổi giữa Primary và Extended Sidebar
  const toggleSidebarExtend = () => {
    setIsExtended(!isExtended);
    setIsSidebarOpen(true); // Đảm bảo Sidebar mở khi chuyển đổi
  };

  // Quản lý trạng thái Sidebar Mobile
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Xử lý tự động ẩn Sidebar trên Mobile khi màn hình nhỏ hơn 1280px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsMobileSidebarOpen(false); // Đóng Sidebar Mobile nếu màn hình lớn
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
            {/* Sidebar trên Desktop */}
            <div className="relative h-screen">
              {/* Primary Sidebar */}
              <div
                className={`h-screen fixed top-0 z-60 left-0 w-16 transition-all transform duration-500 ${
                  isSidebarOpen && !isExtended ? "translate-x-0" : "-translate-x-16"
                }`}
              >
                <PrimarySidebar toggleSidebar={toggleSidebarExtend} />
              </div>

              {/* Extended Sidebar */}
              <div
                className={`fixed top-0 z-60 left-0 w-72 h-screen transition-all transform duration-500 ${
                  isSidebarOpen && isExtended ? "translate-x-0" : "-translate-x-72"
                }`}
              >
                <ExtendSidebar isOpen={isExtended} toggleSidebar={toggleSidebarExtend} />
              </div>
            </div>

            {/* Sidebar trên Mobile */}
            {isMobileSidebarOpen && (
              <div
                className="fixed top-0 left-0 w-72 h-screen bg-white z-50 transition-transform duration-300 transform"
              >
                <ExtendSidebar isOpen={isExtended} toggleSidebar={toggleSidebarExtend} />
              </div>
            )}

            {/* Hamburger Button */}
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

            {/* Backdrop cho Mobile Sidebar */}
            {isMobileSidebarOpen && (
              <div
                className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
                onClick={toggleMobileSidebar}
              ></div>
            )}
          </>
        )}
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          !hideSidebarFooter
            ? isSidebarOpen
              ? isExtended
                ? "xl:ml-72"
                : "xl:ml-16"
              : "ml-0"
            : ""
        }`}
      >
        <AppRoutes />
        {!hideSidebarFooter && <Footer />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <ToastContainer />
        <AppLayout />
      </Router>
    </Provider>
  );
};

export default App;