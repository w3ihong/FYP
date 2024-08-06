'use client';
import React, { useState, useEffect } from 'react';
import ChangePayment from '@/components/change';
import Link from 'next/link';
import ChangeAddress from '@/components/changeAddress';
import SuccessSubscription from '@/components/successSub';
import { billingDetails, planType, downgradeSubscription } from '@/app/actions';

const CheckmarkIcon = () => (
  <svg className="h-5 w-5 text-cyan-950 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const planCosts = {
  premium: '$99/month',
  basic: 'Free'
};

const Billing = () => {
  const [billingDetailsState, setBillingDetailsState] = useState({
    full_name: '',
    planType: '',
    billingCycle: '12 March', // set to the 1st day of the coming month
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
    fetchPlanType(); 
  }, []);

  const handleDowngrade = async () => {
    try {
      await downgradeSubscription('basic'); 
      setBillingDetailsState(prevState => ({
        ...prevState,
        planType: 'basic',
        planCost: planCosts.basic
      }));
      setIsSuccessModalOpen(true); 
    } catch (error) {
      console.error('Error downgrading subscription:', error);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setBillingDetailsState({
      ...billingDetailsState,
      [name]: value,
    });
  };

  // Mask the card number
  const maskCardNumber = (cardNumber: string) => {
    const cardStr = String(cardNumber);
    return cardStr.slice(0, -4).replace(/\d/g, '*') + cardStr.slice(-4);
  };

  const renderPlanDetails = () => (
    <div className="flex flex-col space-y-3 justify-center pl-20">
      <div className="flex items-center">
        <CheckmarkIcon />
        <span>In-depth Visual Insights</span>
      </div>
      <div className="flex items-center">
        <CheckmarkIcon />
        <span>Competitive Analysis</span>
      </div>
      <div className="flex items-center">
        <CheckmarkIcon />
        <span>Sentiment Analysis</span>
      </div>
      <div className="flex items-center">
        <CheckmarkIcon />
        <span>Trend Indicator</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen font-raleway">
      <main className="flex-grow container mx-auto px-5 py-24">
        <section className="body-font">
          <div className="container mx-auto flex flex-col items-center">
            <h1 className="w-full mb-1 text-4xl font-bold text-left lg:w-4/5">Billing</h1>
            <p className="w-full mb-6 font-bold text-left lg:w-4/5">Manage your billing and payment details</p>
            {!isChangingPayment && !isChangingAddress ? (
              <>
                {/* Current Plan Summary */}
                <div className="bg-white p-8 rounded-lg shadow-lg mb-6 w-full lg:w-4/5">
                  <h2 className=" rounded p-2 text-2xl font-semibold mb-4 text-cyan-950 text-left">Current Plan Summary</h2>
                  <div className="flex justify-center items-center space-x-4 text-center">
                    <div className="flex flex-col items-center">
                      <label htmlFor="planType" className="text-xs font-semibold">PLAN TYPE:</label>
                      <input
                        type="text"
                        id="planType"
                        name="planType"
                        value={billingDetailsState.planType}
                        onChange={handleInputChange}
                        className="border-none font-bold text-center"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <label htmlFor="billingCycle" className="text-xs font-semibold">BILLING CYCLE:</label>
                      <input
                        type="text"
                        id="billingCycle"
                        name="billingCycle"
                        value={billingDetailsState.billingCycle}
                        onChange={handleInputChange}
                        className="border-none font-bold text-center"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <label htmlFor="planCost" className="text-xs font-semibold">PLAN COST:</label>
                      <input
                        type="text"
                        id="planCost"
                        name="planCost"
                        value={billingDetailsState.planCost}
                        onChange={handleInputChange}
                        className="border-none font-bold text-center"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white p-8 rounded-lg shadow-lg mb-6 w-full lg:w-4/5">
                  <h2 className=" rounded p-2 text-2xl font-semibold mb-4 text-cyan-950 text-left">Payment Method</h2>
                  <div className="border px-6 py-6 flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <img className="object-scale-down h-10 w-10 object-top" src="/mc.png" alt="Master Card" />
                      </div>
                      <div>
                        <p className="font-semibold">Master Card</p>
                        <p>{maskCardNumber(billingDetailsState.credit_card_no)}</p>
                        <p>{billingDetailsState.full_name}</p>
                        <p>Billing Address</p>
                        <p>{billingDetailsState.unit}, {billingDetailsState.street}, {billingDetailsState.postalcode}</p>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <button
                        className="bg-cyan-950 text-white px-6 py-1 text-s rounded hover:bg-cyan-900 mb-2"
                        onClick={() => setIsChangingPayment(true)}
                      >
                        {billingDetailsState.credit_card_no ? 'Change Payment' : 'Add Payment Method'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Upgrade or Downgrade Plan */}
                <div className="bg-white p-8 rounded-lg shadow-lg mb-6 w-full lg:w-4/5">
                  {billingDetailsState.planType.toLowerCase() !== 'premium' ? (
                    <div className='border px-6 py-6 flex flex-col items-center lg:items-start'>
                      <h2 className="text-2xl font-semibold mb-4 text-cyan-950 text-left w-full">Upgrade Your Plan</h2>
                      <div className="flex flex-col lg:flex-row justify-between items-center w-full">
                        <div className="flex items-center">
                          <div className="mr-4">
                            <p className=" px-8 py-10 text-2xl font-semibold">Premium Plan</p>
                          </div>
                          <div className=''>
                            {renderPlanDetails()}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-semibold">$99/month</p>
                          <Link href="/settings/billing/upgrade" passHref>
                            <button className="bg-cyan-950 text-white px-6 py-1 rounded hover:bg-cyan-900 mt-2">Upgrade</button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='border px-6 py-6 flex flex-col items-center lg:items-start'>
                      <h2 className="text-2xl font-semibold mb-4 text-cyan-950 text-left w-full">You are on the Premium Plan</h2>
                      <div className="flex flex-col lg:flex-row justify-between items-center w-full">
                        <div className="flex items-center">
                          <div className="mr-4">
                            <p className=" px-8 py-10 text-2xl font-semibold">Premium Plan</p>
                          </div>
                          <div className=''>
                            {renderPlanDetails()}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-semibold">$99/month</p>
                          <button
                            className="bg-red-700 text-white px-6 py-1 rounded-2xl hover:bg-red-600 mt-2"
                            onClick={handleDowngrade}
                          >
                            Downgrade
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
