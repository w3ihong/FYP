import React from 'react';

interface CVVModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const CVVModal: React.FC<CVVModalProps> = ({ isOpen, onRequestClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto relative w-96 h-60 flex flex-col items-center">
        <button
          onClick={onRequestClose}
          className="absolute top-2 left-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <p className="mb-3 text-sm text-center">Your card's security code (CVV) is the 3 digit number located on the front or back of most cards.</p>
        <img src="/CVV.jpg"className="mb-4 justify-center items-center" />
      </div>
    </div>
  );
};

export default CVVModal;
