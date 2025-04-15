import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppRoutes from "./routers";
import Footer from "./components/layout/footer/Footer";
import Sidebar from "./components/layout/sidebar/Sidebar";



const AppLayout = () => {
  const location = useLocation();
  const hideSidebarFooter = ["/login", "/register"].includes(location.pathname);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex overflow-hidden relative">
      {!hideSidebarFooter && (
        <>
          {/* Sidebar */}
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          {/* Hamburger Button */}
          <button
            className="xl:hidden fixed top-5 py-5 px-5 left-5 z-30 bg-secondaryColor p-2 flex flex-col justify-center items-start space-y-1"
            onClick={toggleSidebar}
          >
            <span className="block w-4 h-0.5 bg-black"></span>
            <span className="flex w-3 justify-start h-0.5 bg-black"></span>
            <span className="block w-4 h-0.5 bg-black"></span>
          </button>

          {/* Backdrop */}
          {isSidebarOpen && (
            <div
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 xl:hidden"
              onClick={toggleSidebar}
            ></div>
          )}
        </>
      )}

      {/* Main Content */}
      <div className={`flex-1 ${!hideSidebarFooter ? "xl:ml-72" : ""}`}>
        <AppRoutes />
        {!hideSidebarFooter && <Footer />}
      </div>
    </div>


  );
};

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>

  );
};

export default App;
