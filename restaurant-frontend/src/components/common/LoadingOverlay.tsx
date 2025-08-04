import React from 'react';

const LoadingOverlay: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="inset-0 min-h-[calc(100vh-200px)] bg-transparent flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondaryColor"></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
