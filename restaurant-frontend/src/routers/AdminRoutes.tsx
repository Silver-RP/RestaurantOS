// src/routes/AdminRoutes.tsx
import { Navigate } from "react-router-dom";

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


const adminRoutes = [
  {
    path: "/admin",
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
      { path: "categories/create", element: <CreateCategoryPage /> },
      { path: "categories/edit/:id", element: <EditCategoryPage /> },
      { path: "users", element: <UserIndexPage /> },
      { path: "users/create", element: <CreateUserPage /> },
      { path: "*", element: <Navigate to="/admin" /> },
    ],
  },
];

export default adminRoutes;