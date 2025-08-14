import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import UnauthorizedPage from '@/components/pages/admin/login/UnauthorizedPage';
import Cookies from 'js-cookie';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();

  const userInfoString = Cookies.get('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  if (!userInfo) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  const userRoles = userInfo.roles?.map((r: { name: string }) => r.name) || [];

  if (!userRoles.length) {
    return <UnauthorizedPage />;
  }


  if (userRoles.includes('user') || userRoles.includes('')) {
    return <UnauthorizedPage />;
  }

  const hasPermission =
    !allowedRoles || allowedRoles.length === 0
      ? true
      : userRoles.some((role: string) => allowedRoles.includes(role));

  useEffect(() => {
    if (!hasPermission) {
      toast.error('Bạn không có quyền truy cập trang này.');
    }
  }, [hasPermission]);

  if (!hasPermission) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
