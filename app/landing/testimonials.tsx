"use client"

import React, { useEffect, useState, useRef} from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/utils/supabase/client';

type Testimonial = {
  text: string;
  name: string;
};

type TestimonialsColumnProps = {
  testimonials: Testimonial[];
  className?: string;
  duration?: number;
};

const fetchTestimonials = async () => {
  const { data, error } = await supabase.from('testimonials').select('*');
  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
  return data.map((item: any) => ({
    text: item.text,  // Correcting the key to match the table structure
    name: item.name,
  }));
};

const shuffleArray = (array: Testimonial[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const TestimonialsColumn: React.FC<TestimonialsColumnProps> = ({ testimonials, className, duration = 10 }) => (
  <div className={className}>
    <motion.div 
      animate={{
        translateY: "-50%",
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: 'linear',
        repeatType: "loop",
      }}
      className="flex flex-col gap-6 pb-6"
    >
      {[...new Array(2)].fill(0).map((_, index) => (
        <React.Fragment key={index}>
          {testimonials.map(({ text, name }, i) => (
            <div key={i} className="card">
              <div>{text}</div>
              <div className="flex flex-col items-center gap-2 mt-5">
                <div className="flex items-center flex-col font-lg font-bold tracking-tight">
                  {name}
                </div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </motion.div>
  </div>
);

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const getTestimonials = async () => {
      const data = await fetchTestimonials();
      const shuffledData = shuffleArray(data);
      setTestimonials(shuffledData);
    };

    getTestimonials();
  }, []);

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);
  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true });
  
  return (
    <section id="testimonials">
      <div className="container">
        <motion.h2 
        ref={headingRef}
        initial={{ opacity: 0, y: 20 }}
        animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="section-title">
          What our users say
        </motion.h2>
        <motion.p 
        ref={headingRef}
        initial={{ opacity: 0, y: 20 }}
        animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="section-description">
          With our powerful features, our app has become an essential tool for users around the World.
        </motion.p>
        <div className="flex justify-center gap-6 mt-10 max-h-[738px] overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)' }}>
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
