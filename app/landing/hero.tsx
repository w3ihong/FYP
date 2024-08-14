"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';


const Hero: React.FC = () => {
  return (
    <motion.section
      className="text-gray-600 sm:text-lg body-font"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <div className="container mx-auto flex px-5 py-6 md:flex-row flex-col items-center">
        <div className="lg:w-1/2 lg:pr-16 md:pr-8 flex flex-col md:items-start md:text-left mb-12 md:mb-0 items-center text-center lg:order-last">
          <h1 className="title-font font-raleway text-5xl mb-4 font-bold text-accent">
            Expand your social reach
            <br className="hidden lg:inline-block" /> and beyond with our proven strategies
            <br className="hidden lg:inline-block" /> to grow your audience.
          </h1>
          <p className="mb-8 leading-relaxed font-medium">
            EchoSphere empowers you to cultivate your audience organically. As a values-centric company, we offer budget-friendly, user-friendly marketing solutions tailored for driven individuals and teams.
          </p>
          <div className="flex justify-center">
            {/* Get Started Button */}
            <Link href='/landing/register'>
              <button type="button" className="text-white bg-accent hover:bg-blue-800 font-bold font-raleway rounded-lg text-sm px-8 py-2.5 me-2 mb-2">
                Get Started
              </button>
            </Link>

            {/* Log in Button */}
            <Link href='/landing/login'>
              <button type="button" className="text-accent bg-white border border-accent hover:bg-gray-100 font-bold font-raleway rounded-lg text-sm px-10 py-2.5 me-2 mb-2">
                Log In
              </button>
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
    </motion.section>
  );
};

export default Hero;
