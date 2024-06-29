import React from 'react'

const FreeTrial = () => {
  return (
    <section id="freetrial">
      <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6 mb-10">
        <div className="max-w-screen-sm mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold font-raleway leading-tight tracking-tight text-accent">
            Start your free trial today
          </h2>
          <p className="mb-6 font-light text-gray-500 md:text-lg">
            Try EchoSphere for 14 days. No credit card required.
          </p>
          <a href="#" className="text-white bg-accent hover:bg-SBaccent border-2 border-gray-800 font-medium rounded-lg text-sm px-10 py-2.5 mr-2 mb-2">
            Free trial for 14 days
          </a>
        </div>
      </div>
    </section>
  )
}

export default FreeTrial
