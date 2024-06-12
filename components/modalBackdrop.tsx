import React from 'react';

interface ModalBackdropProps {
  children: React.ReactNode;
  onClick: () => void;
}

export default function ModalBackdrop({ children, onClick }: { children: any, onClick: any }) {
    return (
        <div className="fixed top-0 left-0 w-full h-full z-50 bg-[#000000af] flex justify-center items-center" onClick={onClick}>
            {children}
        </div>
    );
}
