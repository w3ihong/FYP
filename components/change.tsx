"use client"
import React, { FormEvent, useState } from 'react';
import { CreditCard, Calendar, Key } from 'lucide-react';
import CVVModal from './cvvmodal';
import PaymentSuccessModal from './saveModal';



interface ChangePaymentProps {
  billingDetails: {
    cardNumber: string;
    expiryDate: string;
    billingAddress: string;
    nameCard: string;
  };
  onBillingDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

const ChangePayment: React.FC<ChangePaymentProps> = ({
  billingDetails,
  onBillingDetailsChange,
  onCancel,
}) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const handlePaymentChangeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic for changing payment method
    setIsSuccessModalOpen(true);
  };
  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full lg:w-3/4">
      <h2 className="bg-gray-100 rounded p-2 text-2xl font-semibold mb-4 text-accent">Enter Payment Details</h2>
      <form onSubmit={handlePaymentChangeSubmit} className="text-gray-700 space-y-4">
        <div className='border px-4 py-4 space-y-4'>
            <div className='flex space-x-4 mb-4'>
                <img className="object-scale-down h-12 w-12" src='/visa.png' alt="Visa" />
                <img className="object-scale-down h-12 w-12" src='/mc.png' alt="MasterCard" />
          </div>
          <div className="relative">
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-900 mb-1">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={billingDetails.cardNumber}
              onChange={onBillingDetailsChange}
              className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 pr-10"
              placeholder="Enter card number"
              required
            />
            <CreditCard className="absolute top-1/2 right-3 transform -translate-y-1/5 text-gray-400" />
          </div>
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-900 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={billingDetails.expiryDate}
                onChange={onBillingDetailsChange}
                className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 pr-10"
                placeholder="MM/YYYY"
                required
              />
              <Calendar className="absolute top-1/2 right-3 transform -translate-y-1/5 text-gray-400" />
            </div>
            <div className="relative flex-1">
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-900 mb-1">
                CVV
              </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 pr-10"
                  placeholder="CVV"
                  required
                />
              <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/5 text-gray-400"
                onClick={() => setModalOpen(true)}
              >
                <Key />
              </button>
            </div>
          </div>
          <div className="relative">
            <label htmlFor="nameCard" className="block text-sm font-medium text-gray-900 mb-1">
              Name on Card
            </label>
            <input
              type="text"
              id="nameCard"
              name="nameCard"
              value={billingDetails.nameCard}
              onChange={onBillingDetailsChange}
              className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 pr-10"
              placeholder="Enter name on card"
              required
            />
            
          </div>
          <div className="relative">
            <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-900 mb-1" >
              Billing Address
            </label>
            <input
              type="text"
              id="billingAddress"
              name="billingAddress"
              value={billingDetails.billingAddress}
              onChange={onBillingDetailsChange}
              className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 pr-10"
              placeholder="Enter billing address"
              required
            />
          </div>
          <p className="text-gray-600 mt-4">
            Your payments will be processed internationally. Additional bank fees may apply.
          </p>
          <p className="text-gray-600 mt-4">
            By ticking the tickbox below, you agree that EchoSphere will automatically continue your membership and charge the membership fee (currently $39/month) to your payment method until you cancel. You may cancel at any time to avoid future charges.
          </p>
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="agreement"
              name="agreement"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
            />
            <label htmlFor="agreement" className="ml-2 text-sm font-medium text-gray-900">
              I agree!
            </label>
          </div>
          <div className='flex justify-center mt-4 space-x-4'>
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-cyan-950 text-white rounded hover:bg-cyan-900"
          >
            Save
          </button>
          <button
            type="button"
            className="mt-4 ml-4 px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={onCancel}
          >
            Cancel
          </button>
          </div>
        </div>
      </form>
      <CVVModal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
      />
      <PaymentSuccessModal 
        isOpen={isSuccessModalOpen} 
        onRequestClose={handleCloseSuccessModal}
        />
    </div>
  );
};

export default ChangePayment;
