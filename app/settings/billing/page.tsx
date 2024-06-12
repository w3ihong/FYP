"use client"
import React, { useState, FormEvent } from 'react';
import Sidebar from '@/components/sidebarSettings';
import ChangePayment from '@/components/change';
import Link from 'next/link';
import ChangeAddress from '@/components/changeAddress'; 

const Billing = () => {//can change the placeholder
  const [billingDetails, setBillingDetails] = useState({
    planType: 'Premium',
    billingCycle: 'March 12th',
    planCost: '$39',
    cardNumber: '**** **** **** 1234',
    expiryDate: '11/2027',
    billingAddress: '431 Clementi Rd, #05-12, 123123',
  });
  const [isChangingPayment, setIsChangingPayment] = useState(false);
  const [isChangingAddress, setIsChangingAddress] = useState(false); // this is the address part

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingDetails({
      ...billingDetails,
      [name]: value,
    });
  };

  return (
    <div className="flex flex-col min-h-screen ">
      <main className="flex-grow container mx-auto px-5 py-24">
        <section className="text-gray-600 body-font">
          <div className="container mx-auto flex flex-col items-center">
            {!isChangingPayment && !isChangingAddress ? (
              <>
                {/* Current Plan Summary */}
                <div className="bg-white p-8 rounded-lg shadow-lg mb-6 w-full lg:w-4/5">
                  <h2 className="bg-gray-100 rounded p-2 text-2xl font-semibold mb-4 text-accent ">Current Plan Summary</h2>
                  <div className="grid grid-cols-3 gap-0">
                    <div className="flex-1">
                      <label htmlFor="planType" className="text-xs">
                        PLAN TYPE:
                      </label>
                      <input
                        type="text"
                        id="planType"
                        name="planType"
                        value={billingDetails.planType}
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
                        value={billingDetails.billingCycle}
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
                        value={billingDetails.planCost}
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
                        <img className="object-scale-down h-10 w-10 object-top" src="/mc.png" />
                      </div>
                      <div>
                        <p className="font-semibold">Master Card</p>
                        <p>**** **** **** 1234</p>
                        <p>Billing Address</p>
                        <p>431 Clementi Rd, #05-12, 123123</p>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <button
                        className="bg-cyan-950 text-white px-6 py-1 text-xs rounded hover:bg-cyan-900 mb-2"
                        onClick={() => setIsChangingPayment(true)}
                      >
                        Change Payment
                      </button>
                      <button
                        className="bg-cyan-950 text-white px-6 py-1 text-xs rounded hover:bg-cyan-900"
                        onClick={() => setIsChangingAddress(true)}
                      >
                        Change Address
                      </button>
                    </div>
                  </div>
                </div>

                {/* Upgrade Plan */}
                <div className="bg-white p-8 rounded-lg shadow-lg w-full lg:w-4/5">
                  <div className='border px-3 py-3'>
                    {/* outer border */}
                    <h2 className="text-2xl font-semibold mb-4 text-accent">Upgrade Your Plan</h2>
                    <div className="flex items-center justify-between ">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <p className="bg-gray-100 px-9 py-9 text-2xl font-semibold">Business Plan</p>
                        </div>
                        <div>
                          <ul className="border px-4 py-4">
                            <li><span>✔️</span> Includes 2 additional members</li>
                            <li><span>✔️</span> Network Visualization</li>
                            <li><span>✔️</span> Custom Workflow</li>
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
              </>
            ) : isChangingPayment ? (
              <ChangePayment
                billingDetails={billingDetails}
                onBillingDetailsChange={handleInputChange}
                onCancel={() => setIsChangingPayment(false)}
              />
            ) : (
              <ChangeAddress
                billingDetails={billingDetails}
                onBillingDetailsChange={handleInputChange}
                onCancel={() => setIsChangingAddress(false)}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Billing;
