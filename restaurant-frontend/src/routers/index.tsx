import React from "react";
import { useRoutes } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Homepage from "../pages/Homepage";
import WishList from "../pages/WishList";
import AboutUs from "../pages/AboutUs";

const AppRoutes = () => {
  const routes = useRoutes([
    { path: "/", element: <Homepage /> },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/wishlist", element: <WishList/> },
    { path: "/aboutus", element: <AboutUs/> },
  ]);
  return routes;
};

export default AppRoutes