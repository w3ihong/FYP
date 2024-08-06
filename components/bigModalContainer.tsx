import React from 'react';
import ModalBackdrop from './modalBackdrop';

interface ModalContainerProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const BigModalContainer: React.FC<ModalContainerProps> = ({ children, isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackdrop onClick={onClose}>
      <div className="relative bg-white rounded-lg shadow-md w-[800px] h-[600px] p-8" onClick={(e) => e.stopPropagation()}>
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

export default BigModalContainer;
