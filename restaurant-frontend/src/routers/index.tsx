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
import AboutUs from "../pages/AboutUs";
import FAQsCompoent from "../pages/FaqPage";
import AddressPage from "../pages/AddressPage";
import PostPage from "../pages/PostPage";
import ConfirmOrder from "../pages/Confirm";
import PostDetailsPage from "../pages/PostDetailsPage";
import ReservationInformationPage from "../pages/ReservationInformationPage";
import ContactReservationPage from "../pages/ContactReservationPage"; // 👈 Cập nhật đường dẫn ở đây

const AppRoutes = () => {
  const routes = useRoutes([
    { path: "/", element: <Homepage /> },
    { path: "/aboutus", element: <AboutUs /> },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/wishlist", element: <WishList /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/verify-otp", element: <EnterOTP /> },
    { path: "/profile", element: <ProfilePage /> },
    { path: "/profile/address", element: <AddressPage /> },
    { path: "/menu", element: <MenuPage /> },
    { path: "/product/:slug", element: <ProductDetail /> },
    { path: "/contact", element: <ContactUsPage /> },
    { path: "/faqs", element: <FAQsCompoent /> },
    { path: "/posts", element: <PostPage /> },
    { path: "/post-details", element: <PostDetailsPage /> },
    { path: "/confirm", element: <ConfirmOrder /> },
    { path: "/reservation-information", element: <ReservationInformationPage /> }, // Cập nhật đường dẫn
    { path: "/contact-reservation", element: <ContactReservationPage /> }, // Cập nhật đường dẫn cho ContactReservationPage
  ]);
  return routes;
};

export default AppRoutes;
