
import React from 'react';
import { useLocation } from 'react-router-dom';

import { ToastConfig, ToastConfigAdmin } from './ToastConfig';


const ToastSwitcher = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return isAdmin ? <ToastConfigAdmin /> : <ToastConfig />;
};

export default ToastSwitcher;
