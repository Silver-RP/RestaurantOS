import React from "react";
import { useRoutes } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Homepage from "../pages/Homepage";
import WishList from "../pages/WishList";
import ResetPassword from "../pages/ResetPassword";
import ForgotPassword from "../pages/ForgotPassword";
import EnterOTP from "../pages/EnterOTP";
import ProfilePage from "../pages/Profile";
import MenuPage from "../pages/Menu";
import ProductDetail from "../pages/ProductDetail";
import ContactUsPage from "../pages/ContactUsPage";
// import AboutUs from "../pages/AboutUs";
import FAQsCompoent from "../pages/FaqPage";

const AppRoutes = () => {
  const routes = useRoutes([
    { path: "/", element: <Homepage /> },
    // { path: "/aboutus", element: <AboutUs /> },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/wishlist", element: <WishList/> },
    { path: "/reset-password", element: <ResetPassword/> }, 
    { path: "/forgot-password", element: <ForgotPassword/> },
    { path: "/verify-otp", element: <EnterOTP/> },
    { path: "/profile", element: <ProfilePage/> },
    { path: "/menu", element: <MenuPage/> },
    { path: "/productdetail", element: <ProductDetail/> },
    { path: "/contact", element: <ContactUsPage/> },
    { path: "/faqs", element: <FAQsCompoent /> },
  ]);
  return routes;
};

export default AppRoutes