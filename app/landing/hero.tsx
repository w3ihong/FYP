import React from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container mx-auto flex px-5 py-4 md:flex-row flex-col items-center">
        <div className="lg:w-1/2 lg:pr-16 md:pr-8 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center lg:order-last">
          <h1 className="title-font font-raleway sm:text-4xl text-3xl mb-4 font-bold text-accent">
            Expand your social reach
            <br className="hidden lg:inline-block"/> and beyond with our proven strategies
            <br className="hidden lg:inline-block"/> to grow your audience.
          </h1>
          <p className="mb-8 leading-relaxed font-medium">
            EchoSphere empowers you to cultivate your audience organically. As a values-centric company, we offer budget-friendly, user-friendly marketing solutions tailored for driven individuals and teams.
          </p>
          <div className="flex justify-center">

            {/* Get Started Button */}
            <Link href='/landing/register'>
              <button className="inline-flex font-mono text-white bg-accent border-2 border-gray-700 py-1 px-6 hover:bg-blue-800 rounded text-lg">Get Started</button>
            </Link>

            {/* Log in Button */}
            <Link href='/landing/login'>
            <button className="ml-4 inline-flex font-mono text-gray-700 bg-gray-100 border-2 border-gray-700 py-1 px-12 hover:bg-gray-200 rounded text-lg">Log in</button>
            </Link>

          </div>
        </div>
        <div className="lg:w-1/2 w-full lg:pl-16 md:pl-8">
          <img
            className="h-auto"
            src="/LandingPageGraphic.png"
            alt="graphics"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
