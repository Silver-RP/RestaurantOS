// src/components/ProtectedRoute.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useSelector((state: RootState) => state.user);
  console.log('user in header', user);
  const roles = user?.roles || [];

  if (
    !roles.some(
      (role: { _id: string; name: string }) => role.name === 'superadmin',
    ) &&
    !roles.some(
      (role: { _id: string; name: string }) => role.name === 'manager',
    )
  ) {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default ProtectedRoute;
