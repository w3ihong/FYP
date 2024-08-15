"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { twMerge } from "tailwind-merge";

const pricingTiers = [
  {
    
    title: "Free",
    monthlyPrice: 0,
    buttonText: "Get started for free",
    inverse: false,
    features: [
      "Small-scale metrics",
      "Basic Support",
    ],
  },
  {
    title: "Pro",
    monthlyPrice: 39,
    buttonText: "Sign up now",
    inverse: true,
    features: [
      "Visual Analytics",
      "Sentiment Analysis",
      "Trend Analysis",
      "Comparative Analysis",
    ]
  }
]

const Pricing = () => {
  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true });
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true });

  return (
    <section id="pricing" className="py-24">
      <div className="container">
        <motion.h2 
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="section-title"
        >
          Pricing
        </motion.h2>

        <motion.p 
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="section-description"
        >
          Free forever. Upgrade for exclusive features.
        </motion.p>

        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-end lg:justify-center"
        >
          {pricingTiers.map(({ title, monthlyPrice, buttonText, inverse, features }) => (
            <motion.div
              key={title}
              className={twMerge(
                "card",
                inverse && 'border-accent bg-accent text-white'
              )}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)' 
              }}
              transition={{ 
                type: 'tween', 
                duration: 0.3 
              }}
            >
              <h3 className={twMerge(
                "text-lg font-bold text-accent",
                inverse && 'text-white'
              )}>
                {title}
              </h3>
              <div className="flex items-baseline gap-1 mt-[30px]">
                <span className="text-4xl font-bold tracking-tighter leading-none">
                  ${monthlyPrice}
                </span>
                <span className={twMerge(
                  'tracking-light font-bold text-black/50',
                  inverse && 'text-white/50'
                )}>
                  SGD/month
                </span>
              </div>

              <button className={twMerge(
                "text-white bg-accent hover:bg-blue-800 font-bold font-raleway rounded-lg text-sm w-full py-2.5 me-2 mb-2 mt-[30px]",
                inverse && 'text-accent bg-white hover:bg-gray-400'
              )}>
                {buttonText}
              </button>

              <ul className="flex flex-col gap-5 mt-8">
                {features.map(feature => (
                  <li key={feature} className="text-sm flex items-center gap-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" viewBox="0 0 24 24" 
                      strokeWidth="1.5" stroke="currentColor" 
                      className="size-6"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="m4.5 12.75 6 6 9-13.5" 
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Pricing;
