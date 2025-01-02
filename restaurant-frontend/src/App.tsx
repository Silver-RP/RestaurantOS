import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppRoutes from "./routers";
import Sidebar from "./components/sidebar/Sidebar";
import Footer from "./components/footer/Footer";

const AppLayout = () => {
  const location = useLocation();
  const hideSidebarFooter = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="flex overflow-hidden">
      {!hideSidebarFooter && (
        <div className="w-72 h-screen fixed left-0 top-0">
          <Sidebar />
        </div>
      )}
      <div className={`flex-1 ${!hideSidebarFooter ? "ml-72" : ""}`}>
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