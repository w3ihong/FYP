import React from 'react';
import SmallModalContainer from './smallModalContainer';

interface SuccessSubProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const SuccessSubscription: React.FC<SuccessSubProps> = ({ isOpen, onRequestClose }) => {
  const handleClose = () => {
    onRequestClose();
    window.location.href = '/settings/billing';
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
            className="w-20 h-20 text-green-500"
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
        <p className="pb-5 text-accent text-wrap w-96 text-center font-semibold font text-lg">
          Subscription plan Updated. We hope you'll be able to earn more with us!
        </p>
        <button className="bg-cgreen w-24 h-8 rectangle-generic text-white" onClick={handleClose}>
          OK
        </button>
      </div>
    </SmallModalContainer>
  );
};

export default SuccessSubscription;
