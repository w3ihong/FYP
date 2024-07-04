import { billingDetails } from '@/app/actions';
import React from 'react';

interface ChangeAddressProps {
  billingDetails: {
    full_name: string;
    planType: string;
    billingCycle: string;
    planCost: string;
    credit_card_no: string;
    credit_card_expiry: string;
    state: string;
    city : string;
    street: string;
    unit: string;
    postalcode : string;
  };
  onBillingDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}
const billingAddr : string  = '${billingDetails.street}, ${billingDetails.city}, ${billingDetails.state}, ${billingDetails.postalcode'
const ChangeAddress: React.FC<ChangeAddressProps> = ({ billingDetails, onBillingDetailsChange, onCancel }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full lg:w-4/5">
      <h2 className="text-2xl font-semibold mb-4 text-accent ">Change Billing Address</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700">
            New Billing Address
          </label>
          <input
            type="text"
            id="billingAddress"
            name="billingAddress"
            value={billingAddr}
            onChange={onBillingDetailsChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className="bg-cyan-950 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangeAddress;
