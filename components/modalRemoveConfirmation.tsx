import React from 'react';
import ModalBackdrop from './modalBackdrop';

interface ModalRemoveConfirmationProps {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ModalRemoveConfirmation: React.FC<ModalRemoveConfirmationProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackdrop onClick={onClose}>

      {/* "X" button on top left */}
      <div
        className="relative bg-white rounded-lg shadow-md w-[600px] h-[390px] p-8 flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 text-2xl"
          onClick={onClose}
          style={{ fontSize: '24px', padding: '8px' }}
        >
          &times;
        </button>

        {/* SVG cross */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          className="w-20 h-20 text-red-600 mb-4"
          style={{ fill: 'none', stroke: 'currentColor', strokeWidth: '2px' }}
        >
          <circle cx="10" cy="10" r="8" />
          <line x1="6" y1="6" x2="14" y2="14" />
          <line x1="14" y1="6" x2="6" y2="14" />
        </svg>

        {/* Message */}
        <p className="text-xl font-bold text-gray-700 mb-8 text-center">{message}</p>
        <div className="flex space-x-4">

          {/* Cancel button */}
          <button
            className="bg-gray-400 text-white px-8 py-2 rounded-lg hover:bg-gray-500"
            onClick={onClose}
          >
            Cancel
          </button>

          {/* Remove button */}
          <button
            className="bg-cred text-white px-7 py-2 rounded-lg hover:bg-red-600"
            onClick={() => {
              console.log('Removing item');
              onClose();
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
};

export default ModalRemoveConfirmation;
