'use client'
import React, { useState } from 'react';

const SocialMediaConnect: React.FC = () => {
  const [navigate, setNavigate] = useState<string | null>(null);

  if (navigate) {
    if (navigate === 'homepage') {
      // Replace this with the actual route to your homepage
      window.location.href = '/protected';
    } else {
      // Handle other navigations if necessary
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-90 font-raleway">
      <div className="absolute top-4 left-4">
        <button onClick={() => window.history.back()} className="text-xl">
          ←
        </button>
      </div>
      <h1 className="mb-8 text-2xl font-semibold">Choose A Social Media To Connect To</h1>
      <div className="flex space-x-8">
        <button className="flex flex-col items-center space-y-2 bg-white p-4 rounded-lg shadow-md font-bold">
          <img src="/instagram.png" alt="Instagram" className="w-20 h-20 rounded-lg" />
          <span>Instagram</span>
        </button>
        <button className="flex flex-col items-center space-y-2 bg-white p-4 rounded-lg shadow-md font-bold">
          <img src="/x.png" alt="X" className="w-20 h-20 rounded-lg" />
          <span>X</span>
        </button>
        <button className="flex flex-col items-center space-y-2 bg-white p-4 rounded-lg shadow-md font-bold">
          <img src="/facebook.png" alt="Facebook" className="w-20 h-20 rounded-lg" />
          <span>Facebook</span>
        </button>
      </div>
      <div className="mt-8">
        <button onClick={() => setNavigate('homepage')} className="text-gray-600 font-bold underline">
          Skip to Homepage. Connect Later.
        </button>
      </div>
    </div>
  );
};

export default SocialMediaConnect;
