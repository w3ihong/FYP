"use server"

import React from 'react';

const Pricing = () => {
  return (
    <section id="pricing">
      <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-28 lg:px-6">
        <div className="max-w-screen-md mx-auto mb-8 text-center lg:mb-12">
          <h2 className="mb-4 text-3xl font-raleway font-bold tracking-tight text-accent">
            Designed for individuals like you
          </h2>
          <p className="mb-5 font-light text-gray-600 sm:text-xl">
            Here at EchoSphere, we analyze your data to produce maximum results.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center lg:space-x-6 sm:gap-6 xl:gap-10">
          {/* Pricing Card - Free */}
          <div className="flex flex-col p-6 mx-auto mb-8 text-center text-gray-900 bg-white border border-gray-100 rounded-lg shadow h-[490px] lg:w-1/2 w-full">
            <div>
              <h3 className="mt-2 mb-2 text-2xl font-raleway font-semibold">Free</h3>
              <p className="font-light text-gray-500 sm:text-lg">
                Best option for personal use
              </p>
              <div className="flex items-baseline justify-center my-8 mb-10">
                <span className="mr-2 text-5xl font-extrabold">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
            </div>
            <div className="flex-grow">
              {/* List */}
              <ul role="list" className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  {/* Icon */}
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>Small-scale Metrics</span>
                </li>
              </ul>
            </div>
            <div>
              <a href="#" className="text-white bg-accent hover:bg-SBaccent font-raleway font-medium rounded-lg border-2 border-gray-700 text-sm px-20 py-2.5 mb-10 text-center">Get started</a>
            </div>
          </div>
          {/* Pricing Card - Premium */}
          <div className="flex flex-col p-6 mx-auto text-center text-gray-900 bg-white border border-gray-100 rounded-lg shadow h-[490px] lg:w-1/2 w-full">
            <div>
              <h3 className="mb-2 mt-2 text-2xl font-raleway font-semibold">Premium</h3>
              <p className="font-light text-gray-500 sm:text-lg">
                Relevant for social media managers, small businesses
              </p>
              <div className="flex items-baseline justify-center my-8 mb-10">
                <span className="mr-2 text-5xl font-extrabold">$99</span>
                <span className="text-gray-500">/month</span>
              </div>
            </div>
            <div className="flex-grow">
              {/* List */}
              <ul role="list" className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  {/* Icon */}
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>In-depth Visual Insights</span>
                </li>
                <li className="flex items-center space-x-3">
                  {/* Icon */}
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>Competitive Analysis</span>
                </li>
                <li className="flex items-center space-x-3">
                  {/* Icon */}
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>Sentiment Analysis</span>
                </li>
                <li className="flex items-center space-x-3">
                  {/* Icon */}
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>Trend Indicator</span>
                </li>
              </ul>
            </div>
            <div>
              <a href="#" className="text-white bg-accent hover:bg-SBaccent font-raleway font-medium rounded-lg border-2 border-gray-700 text-sm px-20 py-2.5 mb-10 text-center">Get started</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
