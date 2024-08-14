'use client';

import React, { useState } from 'react';
import { instagramOAuth } from '@/app/auth/socials/instagram';

const SocialMediaConnect: React.FC = () => {
  const [navigate, setNavigate] = useState<string | null>(null);

  if (navigate) {
    if (navigate === 'homepage') {
      // Replace this with the actual route to your homepage
      window.location.href = '/protected';
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-raleway">
      <div className="absolute top-4 left-4">
        <button onClick={() => window.history.back()} className="text-xl">
          ←
        </button>
      </div>
      <h1 className="mb-8 text-2xl font-semibold">Choose A Social Media To Connect To</h1>
      <div className="flex space-x-8">
        <button 
          onClick={instagramOAuth} 
          className="flex flex-col items-center space-y-2 bg-white p-4 rounded-lg shadow-md font-bold"
        >
          <img src="/instagram.png" alt="Instagram" className="w-20 h-20 rounded-lg" />
          <span>Instagram</span>
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
