import { Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import React from 'react';
import Homepage from '../pages/Homepage';
import AboutUs from '../pages/AboutUs';
import Register from '../pages/Register';
import Login from '../pages/Login';
import WishList from '../pages/WishList';
import ResetPassword from '../pages/ResetPassword';
import ForgotPassword from '../pages/ForgotPassword';
import EnterOTP from '../pages/EnterOTP';
import EnterOTPEmail from '../pages/EnterOTPEmail';
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
import FavoritePage from '@/pages/FavoritePage';
import MyReservationsPage from '@/pages/MyReservationsPage';
import PaymentSuccess from '@/pages/PaymentSuccess';
import PaymentFailed from '@/pages/PaymentFailed';
import PostsByTagPage from '../pages/PostsByTagPage';
import VoucherPage from '../pages/VoucherPage';
import UserVoucherList from '@/components/pages/voucher/UserVoucherList';
import TrackingReservationPage from '@/pages/TrackingReservation';
import UserReviews from '@/components/pages/proflie/UserReviews';
import ProfileLayout from '../layouts/ProfileLayout';


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
      { path: 'verify-otp-email', element: <EnterOTPEmail /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'foods/:slug', element: <ProductDetail /> },
      { path: 'contact', element: <ContactUsPage /> },
      { path: 'posts', element: <PostPage /> },
      { path: 'posts/tag/:tag', element: <PostsByTagPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'reservation', element: <ReservationPage /> },
      { path: 'favorites', element: <FavoritePage /> },
      { path: 'post-details/:id', element: <PostDetailsPage /> },
      { path: '*', element: <Navigate to="/" /> },
      { path: '/confirm', element: <ConfirmOrder /> },
      { path: '/payment-success', element: <PaymentSuccess /> },
      { path: '/payment-failed', element: <PaymentFailed /> },
      { path: 'vouchers', element: <VoucherPage /> },
      { path: '/reservation/lookup-reservation', element: <TrackingReservationPage /> },
      // { path: 'profile', element: <ProfilePage /> },
      // { path: 'profile/orders', element: <OrderPage /> },
      // { path: 'profile/faqs', element: <FAQsCompoent /> },
      // { path: 'profile/address', element: <AddressPage /> },
      // { path: '/profile/reviews', element: <UserReviews /> },
      // { path: 'profile/vouchers', element: <UserVoucherList /> },
      // { path: '/profile/user-vouchers', element: <UserVoucherList /> },
      // { path: '/profile/my-reservation', element: <MyReservationsPage /> },
      {
        path: 'profile',
        element: <ProfileLayout />, 
        children: [
          { index: true, element: <ProfilePage /> },
          { path: 'address', element: <AddressPage /> },
          { path: 'user-vouchers', element: <UserVoucherList /> },
          { path: 'faqs', element: <FAQsCompoent /> },
          { path: 'orders', element: <OrderPage /> },
          { path: 'my-reservation', element: <MyReservationsPage /> },
          { path: 'reviews', element: <UserReviews /> },
        ],
      },

    ],
  },
];

export default PublicRoutes;
