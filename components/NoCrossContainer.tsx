import React from 'react';

interface NoCrossContainerProps {
  children: React.ReactNode;
  isOpen: boolean;
}

const NoCrossContainer: React.FC<NoCrossContainerProps> = ({ children, isOpen }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="relative bg-white rounded-lg shadow-md w-[40rem] h-[25rem] p-8 flex items-center justify-center">
      {children}
    </div>
  );
};

export default NoCrossContainer;