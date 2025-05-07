import { useRoutes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import AdminRoutes from "./AdminRoutes";

const AppRoutes = () => {
  const routes = useRoutes([
    ...PublicRoutes,
    ...AdminRoutes,
  ]);

  return routes;
};

export default AppRoutes;