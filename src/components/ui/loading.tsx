import React from 'react';

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-full min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const LoadingScreen = () => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

export default LoadingScreen;
