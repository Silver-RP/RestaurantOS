import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const FullScreenOverlayLoading = () => {
  const overlayLoading = useSelector((state: RootState) => state.ui.overlayLoading);

  if (!overlayLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-t-transparent border-secondaryColor rounded-full animate-spin"></div>
    </div>
  );
};

export default FullScreenOverlayLoading;