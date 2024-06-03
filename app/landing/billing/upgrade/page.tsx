'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import ChangeSubscription from '@/components/changesubmodal'; 

const Upgrade = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentPlan = 'Premium Plan';
  const currentPlanDetails = ['SMMT Functionalities', 'Posting Recommendations', 'Sentiment & Competition Analysis'];
  const newPlanDetails = ['Everything Premium member has', 'Includes 2 additional members', 'Network Visualization', 'Custom Workflow'];
  const currentPlanCost = '$39/month';
  const newPlanCost = '$99/month';

  const handleUpgradeClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    console.log('Confirmed');
    // Add logic for upgrading plan
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    console.log('Cancelled');
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-yellow-100">
      <main className="flex-grow container mx-auto px-5 py-24">
        <section className="text-gray-600 body-font">
          <div className="container mx-auto flex flex-col items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full lg:w-3/4 mx-auto relative">
              {/* Back Button */}
              <Link href="/landing/billing" className="absolute top-2 left-2 text-cyan-950 hover:text-cyan-900 mr-2">
                <svg className="h-8 w-8 text-neutral-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z"/>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <line x1="5" y1="12" x2="11" y2="18" />
                  <line x1="5" y1="12" x2="11" y2="6" />
                </svg>
              </Link>

              <h2 className="bg-gray-100 rounded px-2 py-2 text-3xl font-semibold mb-4 text-center">Upgrade Your Plan</h2>
              <div className="border p-6 rounded-lg mb-6">
                <h3 className="text-sm font-grey-100 mb-2">Current Plan:</h3>
                <div className="flex justify-between items-start">
                  <div className='flex-1 mr-4'>
                    <p className="text-2xl font-semibold">{currentPlan}</p>
                    <ul className="list-disc ml-4">
                      {currentPlanDetails.map((detail, index) => (
                        <li key={index} className="mb-1">{detail}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-2xl font-semibold">{currentPlanCost}</p>
                </div>
              </div>
              <div className="border p-6 rounded-lg mb-6">
                <h3 className="text-2xl font-semibold mb-2">Business Plan</h3>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <ul className="list-disc ml-4">
                      {newPlanDetails.map((detail, index) => (
                        <li key={index} className="mb-1">{detail}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold">{newPlanCost}</p>
                    <p className="text-xs text-gray-500">*Additional member at $30/month</p>
                    <button
                      onClick={handleUpgradeClick}
                      className="bg-cyan-950 text-white px-6 py-2 rounded hover:bg-cyan-900 mt-4"
                    >
                      Upgrade
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <ChangeSubscription
            currentPlan={currentPlan}
            currentPlanCost={currentPlanCost}
            newPlanCost={newPlanCost}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
          />
        </div>
      )}
    </div>
  );
};

export default Upgrade;
