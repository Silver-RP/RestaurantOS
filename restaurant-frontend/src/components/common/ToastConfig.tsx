import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastConfig = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      toastClassName="bg-headerBackground text-white font-sans border border-secondaryColor rounded-md shadow-md"
    //   bodyClassName="text-sm font-medium"
      progressClassName="bg-secondaryColor"
    />
    
  );
};
export const ToastConfigAdmin = () => (
  <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    toastClassName="bg-headerBackground text-white border border-secondaryColor rounded-md shadow-md"
    progressClassName="bg-secondaryColor"
    style={{ marginTop: '70px' }}
  />
);
