"use server";

import React from 'react';

const Pricing = () => {
  return (
    <section id="pricing" className="body-font overflow-hidden ">

      {/* Text */}
      <div className="container border-blue-400 px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-10">
          <h1 className="sm:text-4xl text-3xl font-bold font-mono title-font mb-2 text-accent text-shadow-custom">Pricing</h1>
          <p className="lg:w-2/3 mx-auto font-mono leading-relaxed text-base text-accent">Manage all your social medias in one place.</p>
        </div>

        {/* Pricing Boxes */}
        <div className="flex flex-wrap -m-4 justify-center">
          {/* First Box */}
          <div className="p-4 xl:w-1/4 md:w-1/2 w-full">
            <div className="h-full p-6 rounded-xl border-2 border-accent flex flex-col relative overflow-hidden bg-primary shadow-lg">
              <h2 className="text-sm tracking-widest title-font mb-1 font-mono font-medium">BASIC</h2>
              <h1 className="text-5xl text-accent pb-4 mb-4 border-b border-accent leading-none">Free</h1>
              <p className="flex items-center mb-2">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-green text-cgreen rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>Cross-platform Posting
              </p>
              <p className="flex items-center mb-2">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-green text-cgreen rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>Analysis Dashboard
              </p>
              <p className="flex items-center mb-6">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-green text-cgreen rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>Mixtape chillwave tumeric
              </p>
              <button className="flex items-center mt-auto text-white bg-accent border-0 py-2 px-4 w-full focus:outline-none hover:bg-blue-900 rounded">Register Now
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-auto" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </button>
              
            </div>
          </div>

          {/* Second Box */}
          <div className="p-4 xl:w-1/4 md:w-1/2 w-full">
            <div className="h-full p-6 rounded-xl border-2 border-yellow-400 flex flex-col relative overflow-hidden bg-primary shadow-lg">
              <span className="bg-yellow-400 text-white px-3 py-1 tracking-widest text-xs absolute right-0 top-0 rounded-bl">POPULAR</span>
              <h2 className="text-sm tracking-widest title-font mb-1 font-mono font-medium">PREMIUM</h2>
              <h1 className="text-5xl text-accent-900 leading-none flex items-center pb-4 mb-4 border-b border-accent">
                <span>$38</span>
                <span className="text-lg ml-1 font-normal text-accent-500">/mo</span>
              </h1>
              <p className="flex items-center text-accent-600 mb-2">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-green text-cgreen rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>Vexillologist pitchfork
              </p>
              <p className="flex items-center text-accent-600 mb-2">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-green text-cgreen rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>Tumeric plaid portland
              </p>
              <p className="flex items-center text-accent-600 mb-2">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-green text-cgreen rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>Hexagon neutra unicorn
              </p>
              <p className="flex items-center text-accent-600 mb-6">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-green text-cgreen rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>Mixtape chillwave tumeric
              </p>
              <button className="flex items-center mt-auto text-white bg-yellow-400 border-0 py-2 px-4 w-full focus:outline-none hover:bg-yellow-500 rounded">Register Now
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-auto" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </button>

            </div>
          </div>

          {/* Third Box */}
          <div className="p-4 xl:w-1/4 md:w-1/2 w-full">
            <div className="h-full p-6 rounded-xl border-2 border-accent flex flex-col relative overflow-hidden bg-primary shadow-lg">
              <h2 className="text-sm tracking-widest title-font mb-1 font-mono font-medium">BUSINESS</h2>
              <h1 className="text-5xl text-accent-900 leading-none flex items-center pb-4 mb-4 border-b border-accent">
                <span>$56</span>
                <span className="text-lg ml-1 font-normal text-accent-500">/mo</span>
              </h1>
              <p className="flex items-center text-accent-600 mb-2">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-green text-cgreen rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>Vexillologist pitchfork
              </p>
              <p className="flex items-center text-accent-600 mb-2">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-green text-cgreen rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>Tumeric plaid portland
              </p>
              <p className="flex items-center text-accent-600 mb-2">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-green text-cgreen rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>Hexagon neutra unicorn
              </p>
              <p className="flex items-center text-accent-600 mb-6">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-green text-cgreen rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>Mixtape chillwave tumeric
              </p>
              <button className="flex items-center mt-auto text-white bg-accent border-0 py-2 px-4 w-full focus:outline-none hover:bg-blue-900 rounded">Register Now
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-auto" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing;
