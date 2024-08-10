import React from 'react'
import Link from 'next/link';

const FreeTrial = () => {
  return (
    <section id="freetrial" className="bg-gradient-to-b from-white to-secondary py-36 overflow-x-clip">
      <div className="container text-center">
        <div className="relative">
          <h2 className="section-title mb-4"> 
            Try out our 14 days trial! 
          </h2>
          <p className="section-description mb-6">
            Have a hands-on experience with our analytical tools! No credit card required.
          </p>
          <img
            className="absolute -left-[137px] -top-[137px]"
            width={360}
            src="/bluechart.png"
            alt="Blue Chart"
          />
          <div className="flex mt-10 justify-center">
            <button className="text-white bg-accent hover:bg-blue-800 font-bold font-raleway rounded-lg text-sm py-2.5 px-10 me-2 mb-2">
              Try It Out!
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FreeTrial
