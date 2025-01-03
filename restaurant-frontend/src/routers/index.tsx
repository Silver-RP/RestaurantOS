import React from "react";
import { useRoutes } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Homepage from "../pages/Homepage";

const AppRoutes = () => {
  const routes = useRoutes([
    { path: "/", element: <Homepage /> },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
  ]);
  return routes;
};

export default AppRoutes