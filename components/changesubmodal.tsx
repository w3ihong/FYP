import React, { useState } from 'react';
import SuccessSubscription from './successSub';

const ChangeSubscription = ({ currentPlan, currentPlanCost, newPlanCost, onCancel, onConfirm }) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);


  const handleConfirm = () => {
    setIsSuccessModalOpen(false); // Close the modal
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full lg:w-1/2 mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Confirm Subscription Plan</h2>
        <button onClick={onCancel} className="text-gray-600 hover:text-gray-800">&times;</button>
      </div>
      <div className="mb-4">
        <p className='bg-yellow-100 px-2 py-2 mb-2'>Current Plan:<br/> {currentPlan} {currentPlanCost}</p>
        <p className='bg-yellow-200 px-2 py-2'>New Plan:<br/> Business Plan {newPlanCost}</p>
      </div>
      <p className="mb-4">Your new plan starts now. You'll pay {newPlanCost} starting 31/5/24.</p>
      <p className="mb-4">You agree that your EchoSphere membership will continue and that we will charge the updated monthly fee until you cancel. You may cancel at any time to avoid future charges.</p>
      <div className="text-right">
        <button onClick={onCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2">Cancel</button>
        <button onClick={handleConfirm} className="bg-cyan-950 text-white px-4 py-2 rounded">Confirm</button>
      </div>
      <SuccessSubscription isOpen={isSuccessModalOpen} onRequestClose={() => setIsSuccessModalOpen(false)} />
    </div>
  );
};

export default ChangeSubscription;
