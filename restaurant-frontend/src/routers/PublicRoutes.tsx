import React from 'react';
import { Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';

import Homepage from '../pages/Homepage';
import AboutUs from '../pages/AboutUs';
import Register from '../pages/Register';
import Login from '../pages/Login';
import WishList from '../pages/WishList';
import ResetPassword from '../pages/ResetPassword';
import ForgotPassword from '../pages/ForgotPassword';
import EnterOTP from '../pages/EnterOTP';
import ProfilePage from '../pages/Profile';
import AddressPage from '../pages/AddressPage';
import MenuPage from '../pages/Menu';
import ProductDetail from '../pages/ProductDetail';
import ContactUsPage from '../pages/ContactUsPage';
import FAQsCompoent from '../pages/FaqPage';
import PostPage from '../pages/PostPage';
import OrderPage from '../pages/OrderPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/Checkout';
import ReservationPage from '../pages/ReservationPage';
import ConfirmOrder from '../pages/Confirm';
import PostDetailsPage from '../pages/PostDetailsPage';
import ReservationInformationPage from '../pages/ReservationInformationPage';
import ContactReservationPage from '../pages/ContactReservationPage'; //

const PublicRoutes = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Homepage /> },
      { path: 'aboutus', element: <AboutUs /> },
      { path: 'register', element: <Register /> },
      { path: 'login', element: <Login /> },
      { path: 'wishlist', element: <WishList /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'verify-otp', element: <EnterOTP /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'profile/address', element: <AddressPage /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'foods/:slug', element: <ProductDetail /> },
      { path: 'contact', element: <ContactUsPage /> },
      { path: 'profile/faqs', element: <FAQsCompoent /> },
      { path: 'posts', element: <PostPage /> },
      { path: 'order', element: <OrderPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'reservation', element: <ReservationPage /> },
      { path: '*', element: <Navigate to="/" /> },
      { path: '/post-details', element: <PostDetailsPage /> },
      { path: '/confirm', element: <ConfirmOrder /> },
      {
        path: '/reservation-information',
        element: <ReservationInformationPage />,
      }, // Cập nhật đường dẫn
      { path: '/contact-reservation', element: <ContactReservationPage /> },
    ],
  },
];

export default PublicRoutes;
