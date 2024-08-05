import React from 'react';

interface ModalBackdropProps {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function ModalBackdrop({ children, onClick }: ModalBackdropProps) {
  return (
    <div className="fixed inset-0 z-50 bg-[#000000af] flex justify-center items-center" onClick={onClick}>
      {children}
    </div>
  );
}
