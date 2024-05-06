
'use client'
import React, { ReactNode } from 'react';

interface Buttons {
    children: ReactNode;
    onClick?: () => void; 
    isLoading?: boolean; 
}

const Button: React.FC<Buttons> = ({ children, onClick, isLoading = false }) => {
    const handleClick = () => {
      if (onClick) onClick(); 
  };

  return (
    <button
        className={`bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleClick}
        disabled={isLoading} >
        {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
