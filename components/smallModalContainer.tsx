import React from 'react';
import ModalBackdrop from './modalBackdrop';

interface ModalContainerProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const SmallModalContainer: React.FC<ModalContainerProps> = ({ children, isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <ModalBackdrop onClick={handleBackdropClick}>
      <div className="relative bg-white rounded-lg shadow-md w-[40rem] h-[25rem] p-8 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 text-2xl"
          onClick={onClose}
          style={{ fontSize: '24px', padding: '8px' }}
        >
          &times;
        </button>
        {children}
      </div>
    </ModalBackdrop>
  );
};

export default SmallModalContainer;
