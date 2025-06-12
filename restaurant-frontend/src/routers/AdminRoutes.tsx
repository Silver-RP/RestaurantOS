// src/routes/AdminRoutes.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

import FoodList from "../components/pages/admin/food/index";
import DashboardPage from "@components/pages/admin/Dashborad";
import AdminLayout from "../layouts/AdminLayout";
import { AdminSidebarProvider } from "../contexts/AdminSidebarContext";

import FoodCreatePage from "../components/pages/admin/food/Create";
import FoodEditPage from "../components/pages/admin/food/Edit";
import CategoriesPage from "@components/pages/admin/category";
import CreateCategoryPage from "@components/pages/admin/category/Create";
import EditCategoryPage from "@components/pages/admin/category/Edit";
import UserIndexPage from "@/components/pages/admin/user";
import CreateUserPage from "@/components/pages/admin/user/CreateUserPage";
import SearchResults from "@/components/pages/admin/food/SearchResults";
import TrashPage from "@/components/pages/admin/food/Trash";
import OrderPage from "@components/pages/admin/order";
import BannerPage from '@/components/pages/admin/banner';
import CreateBannerPage from '@/components/pages/admin/banner/Create';
import EditBannerPage from '@/components/pages/admin/banner/Edit';
import EditUserPage from '@/components/pages/admin/user/EditUserPage';
import ProtectedRoute from '@/utils/ProtectedRoute';
import Post from '@/components/pages/admin/posts';
import CreatePostPage from '@/components/pages/admin/posts/Create';
import EditPostPage from '@/components/pages/admin/posts/Edit';



const adminRoutes = [
  {
    path: '/admin',
    element: (
      <AdminSidebarProvider>
        <AdminLayout />
      </AdminSidebarProvider>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "foods", element: <FoodList /> },
      { path: "foods/create", element: <FoodCreatePage /> },
      { path: "foods/edit/:slug", element: <FoodEditPage /> },
      { path: "foods/trash", element: <TrashPage /> },
      { path: "foods/search", element: <SearchResults /> },
      { path: 'categories', element: <CategoriesPage />},
      { path: 'orders', element: <OrderPage /> },
      { path: "categories/create", element: <CreateCategoryPage /> },
      { path: "categories/edit/:id", element: <EditCategoryPage /> },
      { path: "users", element: <ProtectedRoute><UserIndexPage /></ProtectedRoute> },
      { path: "users/create", element: <CreateUserPage /> },
      { path: "users/edit/:id", element: <EditUserPage /> },
      { path: "banners", element: <BannerPage /> },
      { path: "banners/create", element: <CreateBannerPage /> },
      { path: "banners/edit/:id", element: <EditBannerPage /> },
      { path: "*", element: <Navigate to="/admin" /> },      { path: "posts", element: <Post /> },
      { path: "posts/create", element: <CreatePostPage /> },
      { path: "posts/edit/:id", element: <EditPostPage /> },
    ],
  },
];

export default adminRoutes;
