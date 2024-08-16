import React from 'react';
import SmallModalContainer from './smallModalContainer';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ isOpen, onRequestClose }) => {
  const handleClose = () => {
    onRequestClose();
  };

  return (
    <SmallModalContainer isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col items-center justify-center rounded-2xl bg-primary w-[32rem] h-80 opacity-100">
        <div className="pb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            className="w-20 h-20 text-cgreen"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="currentColor"
              strokeWidth="2"
              d="M9 12l2 2l4 -4"
            />
          </svg>
        </div>
        <p className="pb-5 text-accent text-wrap w-96 text-center font-semibold text-lg">
          Payment Details Updated
        </p>
        <p className="text-sm mb-4 text-center">Glad to have you with us!</p>
        <button
          onClick={handleClose}
          className="bg-cgreen w-24 h-8 rectangle-generic text-white"
        >
          OK
        </button>
      </div>
    </SmallModalContainer>
  );
};

export default PaymentSuccessModal;
