"use client"

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import FeaturesAnimated from '@/components/featuresAnimated';

const Features = () => {
  const featuresArray = [
    {
      title: 'Analysis Dashboard',
      description: 'Visualize and monitor key metrics such as engagement rates, reach, and profile views in a single, comprehensive dashboard. Gain actionable insights to optimize your social media strategy.',
      icon: (
        <svg 
          className="w-10 h-10"
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" viewBox="0 0 24 24" 
          strokeWidth="1.5" 
          stroke="currentColor">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      ),
      inverse: false
    },
    {
      title: 'Sentiment Analysis',
      description: 'Understand the sentiment behind your audience\'s interactions with your brand. Analyze comments, reviews, and mentions to gauge positive, negative, or neutral sentiments.',
      icon: (
        <svg 
          className="w-10 h-10"
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth="1.5" 
          stroke="currentColor">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
        </svg>
      ),
      inverse: true,
    },
    {
      title: 'Comparative Analysis',
      description: 'Benchmark your performance against competitors in your industry. Identify strengths and weaknesses in your marketing efforts to capitalize on opportunities and stay ahead.',
      icon: (
        <svg 
          className="w-10 h-10"
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" viewBox="0 0 24 24" 
          strokeWidth="1.5" stroke="currentColor">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
        </svg>
      ),
      inverse: false
    }
  ];

  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true });

  return (
    <section id="features"> 
      <div className="py-[72px] sm:py-24">
        <div className="container">
          <motion.h2
            ref={headingRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="section-title"
          >
            Everything you need
          </motion.h2>

          <div className="max-w-xl mx-auto">
            <motion.p 
              ref={headingRef}
              initial={{ opacity: 0, y: 20 }}
              animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="section-description">
              Gain valuable insights into market trends and audience sentiment with our powerful tools. 
              Make informed decisions and stay ahead of the curve. 
            </motion.p>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row gap-4">
            {featuresArray.map(({ title, description, icon }) => (
              <FeaturesAnimated title={title} description={description} icon={icon} key={title} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
