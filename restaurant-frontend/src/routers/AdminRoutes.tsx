// src/routes/AdminRoutes.tsx
import React from "react";
import { Navigate } from "react-router-dom";

import FoodList from "../components/pages/admin/food/index";
import DashboardPage from "@components/pages/admin/Dashborad";
import AdminLayout from "../layouts/AdminLayout";
import { AdminSidebarProvider } from "../contexts/AdminSidebarContext";

import FoodCreatePage from "../components/pages/admin/food/Create";
import FoodEditPage from "../components/pages/admin/food/Edit";

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
      { path: "*", element: <Navigate to="/admin" /> },
    ],
  },
];

export default adminRoutes;