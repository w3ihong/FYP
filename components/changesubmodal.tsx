import React, { useState, useEffect } from 'react';
import SuccessSubscription from './successSub';
import { upgradeSubscription, billingDetails } from '@/app/actions';

interface ChangeSubscriptionProps {
  currentPlan: string;
  currentPlanCost: string;
  newPlanCost: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ChangeSubscription: React.FC<ChangeSubscriptionProps> = ({ currentPlan, currentPlanCost, newPlanCost, onCancel }) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [billingCycleDate, setBillingCycleDate] = useState('');
  const [checkBillingDetails, setBillingDetails] = useState({ credit_card_no: '' });
  const [upgradeError, setUpgradeError] = useState('');

  useEffect(() => {
    // Calculate the billing cycle date (1st of the next month)
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const formattedBillingCycle = nextMonth.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    setBillingCycleDate(formattedBillingCycle);

    // Fetch the billing details to check if payment method is set
    async function fetchBillingDetails() {
      const details = await billingDetails();
      setBillingDetails(details || { credit_card_no: '' });
    }

    fetchBillingDetails();
  }, []);

  const handleConfirm = async () => {
    // Check if the payment method is set
    if (!checkBillingDetails.credit_card_no) {
      setUpgradeError('Please set up your payment method before upgrading.');
      return;
    }

    try {
      await upgradeSubscription('premium'); // Pass the new plan type here
      setIsSuccessModalOpen(true); // Open the success modal
      setUpgradeError(''); // Clear any previous errors
    } catch (error) {
      console.error('Failed to upgrade subscription:', error);
      setUpgradeError('Failed to upgrade subscription. Please try again.');
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full lg:w-1/2 mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Confirm Subscription Plan</h2>
        <button onClick={onCancel} className="text-gray-600 hover:text-gray-800">&times;</button>
      </div>
      <div className="mb-4">
        <p className='bg-yellow-100 px-2 py-2 mb-2'>Current Plan:<br /> {currentPlan} {currentPlanCost}</p>
        <p className='bg-yellow-200 px-2 py-2'>New Plan:<br /> Premium Plan {newPlanCost}</p>
      </div>
      <p className="mb-4">
        Your new plan starts now. You'll pay {newPlanCost} starting {billingCycleDate}.
      </p>
      <p className="mb-4">
        You agree that your EchoSphere membership will continue and that we will charge the updated monthly fee until you cancel. You may cancel at any time to avoid future charges.
      </p>
      {upgradeError && (
        <p className="text-red-500 mb-4">{upgradeError}</p>
      )}
      <div className="text-right">
        <button onClick={onCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2">Cancel</button>
        <button onClick={handleConfirm} className="bg-cyan-950 text-white px-4 py-2 rounded">Confirm</button>
      </div>
      <SuccessSubscription isOpen={isSuccessModalOpen} onRequestClose={handleCloseSuccessModal} />
    </div>
  );
};

export default ChangeSubscription;
