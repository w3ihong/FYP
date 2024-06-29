"use client"

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Testimonial {
  id: string;
  testimonial: string;
  name: string;
}

const Testimonials = () => {
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('testimonials')
        .select('*');

      if (error) {
        console.error('Error fetching testimonials:', error);
      } else if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setTestimonial(data[randomIndex] as Testimonial);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div>
      <section id="testimonials">
        <div className="max-w-screen-md px-2 py-4 mx-auto text-center lg:py-8 lg:px-4">
          <svg className="h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" fill="currentColor"/>
          </svg>
          {testimonial && (
            <figure className="max-w-screen-sm mx-auto mb-4">
              <blockquote>
                <p className="text-2xl font-medium font-raleway text-gray-900 md:text-3xl">
                  "{testimonial.testimonial}"
                </p>
              </blockquote>
              <figcaption className="flex items-center justify-center mt-4 space-x-2">
                <div className="flex items-center divide-x-2 divide-gray-500">
                  <div className="pr-2 text-xl font-bold font-sans text-gray-900">{testimonial.name}</div>
                </div>
              </figcaption>
            </figure>
          )}
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
