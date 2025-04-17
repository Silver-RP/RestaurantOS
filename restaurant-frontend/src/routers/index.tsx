import React from "react";
import { useRoutes } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Homepage from "../pages/Homepage";
import ProductPage from "../pages/ProductPage";

const AppRoutes = () => {
  const routes = useRoutes([
    { path: "/", element: <Homepage /> },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/product", element: <ProductPage /> },
  ]);
  return routes;
};

export default AppRoutes