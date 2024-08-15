'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import ChangeSubscription from '@/components/changesubmodal';

const CheckmarkIcon = () => (
  <svg className="h-5 w-5 text-cyan-950 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
  </svg>
);

const Upgrade = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentPlan = 'Free Plan';
  const currentPlanDetails = ['Small scale metrics'];
  const newPlan = 'Premium Plan';
  const newPlanDetails = ["In-depth Visual Insights", "Competitive Analysis", "Sentiment Analysis", "Trend Indicator"];
  const currentPlanCost = '$0';
  const newPlanCost = '$39';

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
    <div className="flex flex-col min-h-screen bg-yellow-150">
      <main className="flex-grow container mx-auto px-5 py-24">
        <section className="text-gray-600">
          <div className="container mx-auto flex flex-col items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full lg:w-3/4 mx-auto relative">
              {/* Back Button */}
              <Link href="/settings/billing" className="absolute top-2 left-2 text-cyan-950 hover:text-cyan-900 mr-2">
                <svg className="h-8 w-8 text-neutral-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z"/>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <line x1="5" y1="12" x2="11" y2="18" />
                  <line x1="5" y1="12" x2="11" y2="6" />
                </svg>
              </Link>

              <h2 className="bg-gray-100 rounded px-2 py-2 text-3xl font-semibold mb-4 text-center">Upgrade Your Plan</h2>
              <div className="flex flex-col lg:flex-row justify-around items-start lg:items-stretch space-y-6 lg:space-y-0 lg:space-x-6">
                <div className="border p-6 rounded-lg w-full lg:w-1/2 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-grey-100 mb-2">Current Plan:</h3>
                    <div className="flex flex-col items-center">
                      <p className="text-2xl font-semibold mb-2">{currentPlan}</p>
                      <p className="text-gray-500 mb-4">Best option for personal use</p>
                      <p className="text-4xl font-bold mb-4">{currentPlanCost}/month</p>
                      <ul className="mb-4">
                        {currentPlanDetails.map((detail, index) => (
                          <li key={index} className="mb-1 flex items-center">
                            <CheckmarkIcon/>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button className="border border-accent text-accent px-6 py-2 rounded mt-4">
                    Current plan
                  </button>
                </div>
                <div className="border p-6 rounded-lg w-full lg:w-1/2 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-grey-100 mb-2">New Plan:</h3>
                    <div className="flex flex-col items-center">
                      <p className="text-2xl font-semibold mb-2">{newPlan}</p>
                      <p className="text-gray-500 mb-4">Relevant for social media managers, small businesses</p>
                      <p className="text-4xl font-bold mb-4">{newPlanCost}/month</p>
                      <ul className="mb-4">
                        {newPlanDetails.map((detail, index) => (
                          <li key={index} className="mb-1 flex items-center">
                            <CheckmarkIcon/>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button
                    onClick={handleUpgradeClick}
                    className="bg-cyan-950 text-white px-6 py-2 rounded mt-4 hover:bg-cyan-900"
                  >
                    Upgrade
                  </button>
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
