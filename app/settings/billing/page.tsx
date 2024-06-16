'use client'
import React, { useState, useEffect } from 'react';
import ChangePayment from '@/components/change';
import Link from 'next/link';
import ChangeAddress from '@/components/changeAddress';
import SuccessSubscription from '@/components/successSub';
import { billingDetails } from '@/app/actions';
import { planType } from '@/app/actions';
import { downgradeSubscription } from '@/app/actions';

const CheckmarkIcon = () => (
  <svg className="h-5 w-5 text-cyan-950 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

// to match with the plan type/user_type    
const planCosts = {
  business: '$99/month',
  premium: '$39/month',
  basic: 'Free'
};

const Billing = () => {
  const [billingDetailsState, setBillingDetailsState] = useState({
    full_name: '',
    planType: '',
    billingCycle: '',
    planCost: '',
    credit_card_no: '',
    credit_card_expiry: '',
    credit_card_cvv: '',
    state: '',
    city: '',
    street: '',
    unit: '',
    postalcode: ''
  });

  const [isChangingPayment, setIsChangingPayment] = useState(false);
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    async function fetchBillingDetails() {
      const billingInfo = await billingDetails();
      if (billingInfo) {
        setBillingDetailsState(prevState => ({
          ...prevState,
          ...billingInfo
        }));
      }
    }

    async function fetchPlanType() {
      const userType = await planType();
      if (userType) {
        setBillingDetailsState(prevState => ({
          ...prevState,
          planType: userType,
          planCost: planCosts[userType.toLowerCase()] || ''
        }));
      }
    }

    fetchBillingDetails();
    fetchPlanType(); // Fetch the user type and set it in the state
  }, []);

  const handleDowngrade = async () => {
    try {
      await downgradeSubscription('premium'); // Downgrade the subscription to premium
      setBillingDetailsState(prevState => ({
        ...prevState,
        planType: 'Premium',
        planCost: planCosts.premium
      }));
      setIsSuccessModalOpen(true); // Open the success modal
    } catch (error) {
      console.error('Error downgrading subscription:', error);
      // Optionally, handle errors or display error messages
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetailsState({
      ...billingDetailsState,
      [name]: value,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-5 py-24">
        <section className="text-gray-600 body-font">
          <div className="container mx-auto flex flex-col items-center">
            {!isChangingPayment && !isChangingAddress ? (
              <>
                {/* Current Plan Summary */}
                <div className="bg-white p-8 rounded-lg shadow-lg mb-6 w-full lg:w-4/5">
                  <h2 className="bg-gray-100 rounded p-2 text-2xl font-semibold mb-4 text-accent">Current Plan Summary</h2>
                  <div className="grid grid-cols-3 gap-0">
                    <div className="flex-1">
                      <label htmlFor="planType" className="text-xs">
                        PLAN TYPE:
                      </label>
                      <input
                        type="text"
                        id="planType"
                        name="planType"
                        value={billingDetailsState.planType}
                        onChange={handleInputChange}
                        className="border-none font-bold"
                        readOnly
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="billingCycle" className="text-xs">
                        BILLING CYCLE:
                      </label>
                      <input
                        type="text"
                        id="billingCycle"
                        name="billingCycle"
                        value={billingDetailsState.billingCycle}
                        onChange={handleInputChange}
                        className="border-none font-bold"
                        readOnly
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="planCost" className="text-xs">
                        PLAN COST:
                      </label>
                      <input
                        type="text"
                        id="planCost"
                        name="planCost"
                        value={billingDetailsState.planCost}
                        onChange={handleInputChange}
                        className="border-0 font-bold"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white p-8 rounded-lg shadow-lg mb-6 w-full lg:w-4/5">
                  <h2 className="bg-gray-100 rounded p-2 text-2xl font-semibold mb-4 text-accent">Payment Method</h2>
                  <div className="border px-6 py-6 flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <img className="object-scale-down h-10 w-10 object-top" src="/mc.png" alt="Master Card" />
                      </div>
                      <div>
                        <p className="font-semibold">Master Card</p>
                        <p>{billingDetailsState.credit_card_no}</p>
                        <p>{billingDetailsState.full_name}</p>
                        <p>Billing Address</p>
                        <p>{billingDetailsState.unit}, {billingDetailsState.street}, {billingDetailsState.postalcode}</p>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <button
                        className="bg-cyan-950 text-white px-6 py-1 text-xs rounded hover:bg-cyan-900 mb-2"
                        onClick={() => setIsChangingPayment(true)}
                      >
                        Change Payment
                      </button>
                    </div>
                  </div>
                </div>

                {/* Upgrade or Downgrade Plan */}
                {billingDetailsState.planType.toLowerCase() !== 'business' ? (
                  <div className="bg-white p-8 rounded-lg shadow-lg w-full lg:w-4/5">
                    <div className='border px-3 py-3'>
                      {/* outer border */}
                      <h2 className="text-2xl font-semibold mb-4 text-accent">Upgrade Your Plan</h2>
                      <div className="flex items-center justify-between ">
                        <div className="space-x-40 flex items-center">
                          <div className="mr-4">
                            <p className="bg-gray-100 px-9 py-9 text-2xl font-semibold">Business Plan</p>
                          </div>
                          <div>
                            <ul className="border px-4 py-4">
                              <li className="flex items-center">
                                <CheckmarkIcon />
                                <span>Includes 2 additional members</span>
                              </li>
                              <li className="flex items-center">
                                <CheckmarkIcon />
                                <span>Network Visualization</span>
                              </li>
                              <li className="flex items-center">
                                <CheckmarkIcon />
                                <span>Custom Workflow</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-semibold">$99/month</p>
                          <p className="text-xs text-bg-gray-100">*Additional member at $30/month</p>
                          <Link href="/settings/billing/upgrade" passHref>
                            <button className="bg-cyan-950 text-white px-6 py-1 rounded hover:bg-cyan-900 mt-2">Upgrade</button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-lg shadow-lg w-full lg:w-4/5">
                    <div className='border px-3 py-3'>
                      {/* outer border */}
                      <h2 className="text-2xl font-semibold mb-4 text-accent">You are on the Business Plan</h2>
                      <div className="flex items-center justify-between ">
                        <div className="space-x-40 flex items-center">
                          <div className="mr-4">
                            <p className="bg-gray-100 px-9 py-9 text-2xl font-semibold">Business Plan</p>
                          </div>
                          <div>
                            <ul className="border px-4 py-4">
                              <li className="flex items-center">
                                <CheckmarkIcon />
                                <span>Includes 2 additional members</span>
                              </li>
                              <li className="flex items-center">
                                <CheckmarkIcon />
                                <span>Network Visualization</span>
                              </li>
                              <li className="flex items-center">
                                <CheckmarkIcon />
                                <span>Custom Workflow</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-semibold">$99/month</p>
                          <p className="text-xs text-bg-gray-100">*Additional member at $30/month</p>
                          <button
                            className="bg-red-500 text-white px-6 py-1 rounded hover:bg-red-600 mt-2"
                            onClick={handleDowngrade}
                          >
                            Downgrade to Premium
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : isChangingPayment ? (
              <ChangePayment
                billingDetails={billingDetailsState}
                onBillingDetailsChange={handleInputChange}
                onCancel={() => setIsChangingPayment(false)}
              />
            ) : (
              <ChangeAddress
                billingDetails={billingDetailsState}
                onBillingDetailsChange={handleInputChange}
                onCancel={() => setIsChangingAddress(false)}
              />
            )}
          </div>
        </section>
      </main>
      <SuccessSubscription isOpen={isSuccessModalOpen} onRequestClose={() => setIsSuccessModalOpen(false)} />
    </div>
  );
};

export default Billing;
