"use server";

import React from 'react'

const Features = () => {
  return (
    <section id="features">
      <div className="max-w-screen-xl px-4 py-52 mx-auto space-y-14">
        {/* Row */}
        <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
          <div className="text-gray-600 sm:text-lg">
            <h2 className="mb-4 text-3xl font-bold font-raleway text-accent">
              Empower Your Strategy with Actionable Insights
            </h2>
            <p className="mb-8 leading-relaxed font-medium">
            Gain valuable insights into market trends and audience sentiment with our powerful tools. 
            Make informed decisions and stay ahead of the curve. Perfect for optimizing your social media strategies 
            and maximizing engagement.
            </p>
            {/* List */}
            <ul role="list" className="space-y-5  my-7">
              <li className="flex space-x-3">
                {/* Icon */}
                <svg
                  className="flex-shrink-0 w-5 h-5 text-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="text-base font-medium leading-tight text-gray-900">
                  Sentiment Analysis
                </span>
              </li>
              <li className="flex space-x-3">
                {/* Icon */}
                <svg
                  className="flex-shrink-0 w-5 h-5 text-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="text-base font-medium leading-tight text-gray-900">
                  Trend Indicator
                </span>
              </li>
              <li className="flex space-x-3">
                {/* Icon */}
                <svg
                  className="flex-shrink-0 w-5 h-5 text-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="text-base font-sans font-medium leading-tight text-gray-900">
                  Competitive Analysis
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
