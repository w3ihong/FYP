"use client";
import React, { FormEvent, useState } from 'react';
import { CreditCard, Calendar, Key } from 'lucide-react';
import CVVModal from './cvvmodal';
import PaymentSuccessModal from './saveModal';
import { updateCardDetails } from '@/app/actions';

interface BillingDetails {
  credit_card_no: string;
  credit_card_expiry: string;
  credit_card_cvv: string;
  full_name: string;
  state: string;
  city: string;
  street: string;
  unit: string;
  postalcode: string;
}

interface ChangePaymentProps {
  billingDetails: BillingDetails;
  onBillingDetailsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCancel: () => void;
}

const ChangePayment: React.FC<ChangePaymentProps> = ({ billingDetails, onBillingDetailsChange, onCancel }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [cardType, setCardType] = useState('Visa'); // New state for card type
  const [errors, setErrors] = useState<{ credit_card_no?: string; agreement?: string }>({});

  const validateForm = () => {
    const errors: { credit_card_no?: string; agreement?: string } = {};
    if (billingDetails.credit_card_no.length !== 16) {
      errors.credit_card_no = 'Card number must be 16 digits';
    }
    if (!isAgreementChecked) {
      errors.agreement = ' You must agree to the terms';
    }
    return errors;
  };

  const handlePaymentChangeSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await updateCardDetails(billingDetails); // Update payment information in Supabase

      // Handle success
      setIsSuccessModalOpen(true);
      setTimeout(() => {
        setIsSuccessModalOpen(false);
        onCancel(); // Close the form after success
      }, 3000);
    } catch (error) {
      // Handle error
      console.error('Failed to update card details:', error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full lg:w-3/4">
      <h2 className="bg-gray-100 rounded p-2 text-2xl font-semibold mb-4 text-accent">Enter Payment Details</h2>
      <form onSubmit={handlePaymentChangeSubmit} className="text-gray-700 space-y-4">
        <div className='border px-4 py-4 space-y-4'>
          <div className='flex space-x-4 mb-4'>
            <button type="button" onClick={() => setCardType('Visa')} className="focus:outline-none">
              <img
                className={`object-scale-down h-12 w-12 ${cardType === 'Visa' ? 'border-2 border-gray-300 rounded' : ''}`}
                src="/visa.png"
                alt="Visa"
              />
            </button>
            <button type="button" onClick={() => setCardType('MasterCard')} className="focus:outline-none">
              <img
                className={`object-scale-down h-12 w-12 ${cardType === 'MasterCard' ? 'border-2 border-gray-300 rounded' : ''}`}
                src="/mc.png"
                alt="MasterCard"
              />
            </button>
          </div>
          <div className="relative">
            <label htmlFor="credit_card_no" className="block text-sm font-medium text-gray-900 mb-1">
              Card Number
            </label>
            <input
              type="text"
              id="credit_card_no"
              name="credit_card_no"
              value={billingDetails.credit_card_no}
              onChange={onBillingDetailsChange}
              className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 pr-10"
              placeholder="Enter card number"
              required
            />
            <CreditCard className="absolute top-1/2 right-3 transform -translate-y-1/5 text-gray-400" />
            {errors.credit_card_no && <p className="text-red-500 text-sm">{errors.credit_card_no}</p>}
          </div>
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <label htmlFor="credit_card_expiry" className="block text-sm font-medium text-gray-900 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                id="credit_card_expiry"
                name="credit_card_expiry"
                value={billingDetails.credit_card_expiry}
                onChange={onBillingDetailsChange}
                className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 pr-6"
                placeholder="MM/YYYY"
                required
              />
            </div>
            <div className="relative flex-1">
              <label htmlFor="credit_card_cvv" className="block text-sm font-medium text-gray-900 mb-1">
                CVV
              </label>
              <input
                type="text"
                id="credit_card_cvv"
                name="credit_card_cvv"
                value={billingDetails.credit_card_cvv}
                onChange={onBillingDetailsChange}
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
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-900 mb-1">
              Name on Card
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={billingDetails.full_name}
              onChange={onBillingDetailsChange}
              className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 pr-10"
              placeholder="Enter name on card"
              required
            />
          </div>
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <label htmlFor="state" className="block text-sm font-medium text-gray-900 mb-1">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={billingDetails.state}
                onChange={onBillingDetailsChange}
                className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 pr-10"
                placeholder="Enter state"
                required
              />
            </div>
            <div className="relative flex-1">
              <label htmlFor="city" className="block text-sm font-medium text-gray-900 mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={billingDetails.city}
                onChange={onBillingDetailsChange}
                className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 pr-10"
                placeholder="Enter city"
                required
              />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="street" className="block text-sm font-medium text-gray-900 mb-1">
              Street
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={billingDetails.street}
              onChange={onBillingDetailsChange}
              className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 pr-10"
              placeholder="Enter street"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="unit" className="block text-sm font-medium text-gray-900 mb-1">
              Unit
            </label>
            <input
              type="text"
              id="unit"
              name="unit"
              value={billingDetails.unit}
              onChange={onBillingDetailsChange}
              className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 pr-10"
              placeholder="Enter unit"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="postalcode" className="block text-sm font-medium text-gray-900 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              id="postalcode"
              name="postalcode"
              value={billingDetails.postalcode}
              onChange={onBillingDetailsChange}
              className="bg-white border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 pr-10"
              placeholder="Enter postal code"
              required
            />
          </div>
          <p className="text-gray-600 mt-4">
            Your payments will be processed internationally. Additional bank fees may apply.
          </p>
          <p className="text-gray-600 mt-4">
            By ticking the tickbox below, you agree that EchoSphere will automatically continue your membership and charge the membership fee (currently $99/month) to your payment method until you cancel. You may cancel at any time to avoid future charges.
          </p>
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="agreement"
              name="agreement"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
              checked={isAgreementChecked}
              onChange={() => setIsAgreementChecked(!isAgreementChecked)}
            />
            <label htmlFor="agreement" className="ml-2 text-sm font-medium text-gray-900">
              I agree!
            </label>
            {errors.agreement && <p className="text-red-500 text-sm">{errors.agreement}</p>}
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
        onRequestClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
};

export default ChangePayment;
