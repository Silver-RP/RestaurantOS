// src/routes/AdminRoutes.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

import FoodList from '../components/pages/admin/food/index';
import DashboardPage from '@components/pages/admin/Dashborad';
import AdminLayout from '../layouts/AdminLayout';
import { AdminSidebarProvider } from '../contexts/AdminSidebarContext';
import IngredientsList from '../components/pages/admin/ingredients/Index';
import CreateIngredient from '../components/pages/admin/ingredients/Create';
import EditIngredient from '../components/pages/admin/ingredients/Edit';
import TrashIngredient from '../components/pages/admin/ingredients/Trash';
import WarehouseTransactionViewPage from '../components/pages/admin/ingredients/WarehouseTransactionViewPage';

import FoodCreatePage from '../components/pages/admin/food/Create';
import FoodEditPage from '../components/pages/admin/food/Edit';
import CategoriesPage from '@components/pages/admin/category';
import CreateCategoryPage from '@components/pages/admin/category/Create';
import EditCategoryPage from '@components/pages/admin/category/Edit';
import UserIndexPage from '@/components/pages/admin/user';
import CreateUserPage from '@/components/pages/admin/user/CreateUserPage';
import SearchResults from '@/components/pages/admin/food/SearchResults';
import TrashPage from '@/components/pages/admin/food/Trash';
import OrderPage from '@components/pages/admin/order';
import OrderTable from '@components/pages/admin/reservation';
import OrderTableResevation from '@components/pages/admin/table';
import BannerPage from '@/components/pages/admin/banner';
import CreateBannerPage from '@/components/pages/admin/banner/Create';
import EditBannerPage from '@/components/pages/admin/banner/Edit';
import EditUserPage from '@/components/pages/admin/user/EditUserPage';
import ProtectedRoute from '@/utils/ProtectedRoute';
import Post from '@/components/pages/admin/posts';
import CreatePostPage from '@/components/pages/admin/posts/Create';
import EditPostPage from '@/components/pages/admin/posts/Edit';
import ReportPostsPage from '@/components/pages/admin/posts/ReportPostsPage';
import VoucherPage from '../components/pages/admin/voucher';
import CreateVoucherPage from '../components/pages/admin/voucher/Create';
import EditVoucherPage from '../components/pages/admin/voucher/Edit';
import TrashVoucherPage from '../components/pages/admin/voucher/Trash';
import AdminLoginPage from '@/components/pages/admin/login/Index';
import LoyaltyAdmin from '@/components/pages/admin/loyalty';import ChatAdminPanel from "../components/pages/admin/chatbox/ChatAdminPanel";


const adminRoutes = [
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminSidebarProvider>
          <AdminLayout />
        </AdminSidebarProvider>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'foods', element: <FoodList /> },
      { path: 'foods/create', element: <FoodCreatePage /> },
      { path: 'foods/edit/:slug', element: <FoodEditPage /> },
      { path: 'foods/trash', element: <TrashPage /> },
      { path: 'foods/search', element: <SearchResults /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'orders', element: <OrderPage /> },
      { path: 'reservations', element: <OrderTable /> },
      { path: 'tables', element: <OrderTableResevation /> },
      { path: 'categories/create', element: <CreateCategoryPage /> },
      { path: 'categories/edit/:id', element: <EditCategoryPage /> },
      {
        path: 'users',
        element: (
          <ProtectedRoute allowedRoles={['superadmin']}>
            <UserIndexPage />
          </ProtectedRoute>
        ),
      },
      { path: 'users/create', element: <CreateUserPage /> },
      { path: 'users/edit/:id', element: <EditUserPage /> },
      { path: 'banners', element: <BannerPage /> },
      { path: 'banners/create', element: <CreateBannerPage /> },
      { path: 'banners/edit/:id', element: <EditBannerPage /> },
      { path: '*', element: <Navigate to="/admin" /> },
      { path: 'posts', element: <Post /> },
      { path: 'posts/create', element: <CreatePostPage /> },
      { path: 'posts/edit/:id', element: <EditPostPage /> },
      { path: 'posts/report', element: <ReportPostsPage /> },
      { path: 'ingredients', element: <IngredientsList /> },
      { path: 'ingredients/create', element: <CreateIngredient /> },
      { path: 'ingredients/edit/:slug', element: <EditIngredient /> },
      { path: 'ingredients/trash', element: <TrashIngredient /> },
      { path: 'vouchers', element: <VoucherPage /> },
      { path: 'vouchers/create', element: <CreateVoucherPage /> },
      { path: 'vouchers/edit/:id', element: <EditVoucherPage /> },
      { path: 'vouchers/trash', element: <TrashVoucherPage /> },
      {
        path: 'warehouse/transaction-view',
        element: <WarehouseTransactionViewPage />,
      },
      { path: "chatbox", element: <ChatAdminPanel /> },
      { path: 'loyalty', element: <LoyaltyAdmin /> },

      { path: '*', element: <Navigate to="/admin" /> },
    ],
  },
];

export default adminRoutes;
