import React from 'react';

interface ModalBackdropProps {
  children: React.ReactNode;
  onClick: () => void;
}

export default function ModalBackdrop({ children, onClick }: ModalBackdropProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-40 bg-[#000000af] flex justify-center items-center" onClick={onClick}>
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
