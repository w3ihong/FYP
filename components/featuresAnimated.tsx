"use client"

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionTemplate, useMotionValue } from 'framer-motion';

const FeaturesAnimated = ({ title, description, icon }) => {
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);

  const maskImage = useMotionTemplate`radial-gradient(100px 100px at ${offsetX}px ${offsetY}px, black, transparent)`;

  const border = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (!border.current) return;
      const BorderRect = border.current.getBoundingClientRect();
      offsetX.set(e.x - BorderRect.x);
      offsetY.set(e.y - BorderRect.y);
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    }
  }, []);

  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="relative border border-[#F1F1F1] shadow-[0_7px_14px_#EAEAEA] px-5 py-10 text-center rounded-xl sm:flex-1"
      whileHover={{
        scale: 1.03,
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
        transition: { type: 'tween', duration: 0.3 }
      }}
    >
      <motion.div
        className="absolute inset-0 border-2 border-yellow-300 rounded-xl"
        style={{ WebkitMaskImage: maskImage, maskImage: maskImage }}
        ref={border}
      ></motion.div>
      <div className="inline-flex h-14 w-14 text-black justify-center items-center rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="mt-6 font-bold">{title}</h3>
        <p className="mt-2 text-gray-800">{description}</p>
      </div>
    </motion.div>
  );
};

export default FeaturesAnimated;
