"use client";

import React, { useRef } from 'react';
import { AnimatePresence, motion, useAnimation, useInView } from 'framer-motion';

const items = [
  {
    question: "Can I change my plan later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes to your plan will be prorated and reflected on your next billing cycle.",
  },
  {
    question: "Is my data secure?",
    answer: "Security is our top priority. We use state-of-the-art encryption and comply with the best industry practices to ensure your data is stored securely and accessed only by authorized users.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and various other payment methods depending on your location.",
  },
];

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <section id="FAQs">
      <div
        className="py-7 border-b border-accent"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <span className="flex-1 font-sans text-xl font-bold">{question}</span>
          {isOpen ? (
            // Minus Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14"
              />
            </svg>
          ) : (
            // Plus Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          )}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
                marginTop: 0,
              }}
              animate={{
                opacity: 1,
                height: 'auto',
                marginTop: '16px',
              }}
              exit={{
                opacity: 0,
                height: 0,
                marginTop: 0,
              }}
            >
              {answer}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const FAQs = () => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });
  const controls = useAnimation();
  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true });

  React.useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    } else {
      controls.start({ opacity: 0, y: 50 });
    }
  }, [inView, controls]);

  return (
    <div className="py-[72px] sm:py-24">
      <div className="container">
        <motion.h2
           ref={headingRef}
           initial={{ opacity: 0, y: 20 }}
           animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
           transition={{ duration: 0.8 }}
           className="section-title"
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.div 
        ref={headingRef}
        initial={{ opacity: 0, y: 20 }}
        animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="mt-12 max-w-[648px] mx-auto">
          {items.map(({ question, answer }) => (
            <AccordionItem
              question={question}
              answer={answer}
              key={question}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FAQs;
