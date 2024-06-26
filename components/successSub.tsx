import React from 'react';

interface SuccessSubProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const SuccessSubscription: React.FC<SuccessSubProps> = ({ isOpen, onRequestClose }) => {
  const handleClose = () => {
    onRequestClose();
    window.location.href = '/settings/billing'; // Navigate to the billing page
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto relative w-96 h-60 flex flex-col items-center">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <svg className="h-24 w-24 text-green-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M9 12l2 2l4 -4" />
          </svg>
          <p className="text-2xl font-semibold mb-2">Subscription plan Updated</p>
          <p className="text-sm mb-4">We hope you'll be able to earn more with us!</p>
          <button
            onClick={handleClose}
            className="px-8 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessSubscription;
