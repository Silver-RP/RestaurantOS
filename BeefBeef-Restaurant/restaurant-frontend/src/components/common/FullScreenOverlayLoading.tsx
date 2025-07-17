import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const FullScreenOverlayLoading = () => {
  const { overlayLoading, overlayMessage } = useSelector((state: RootState) => state.ui);

  if (!overlayLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-t-transparent border-secondaryColor rounded-full animate-spin" />
      {overlayMessage && (
        <p className="text-white text-base text-center px-4">{overlayMessage}</p>
      )}
    </div>
  );
};

export default FullScreenOverlayLoading;
