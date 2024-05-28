import React, { useState } from 'react';
import ModalRemoveAccount from './ModalRemoveAccount';
import ConnectSocialMedia from './ConnectSocialMedia'; // New modal component for connecting to more social media platforms

const ModalSocial = ({ isOpen, onClose }) => {
  const [isRemoveModalOpen, setRemoveModalOpen] = useState(false);
  const [isConnectModalOpen, setConnectModalOpen] = useState(false); // State for new modal

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="relative bg-white rounded-lg shadow-lg p-6" style={{ width: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 text-2xl font-bold">&times;</button>
          <input 
            type="text" 
            placeholder="Type to search..." 
            className="w-full px-4 py-3 mb-4 border rounded-md"
          />
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-md shadow-sm flex items-center">
              <img src="/sky.jpeg" alt="Profile" className="w-12 h-12 object-cover rounded-full mr-4" />
              <div className="flex-1">
                <p className="text-sm font-bold">John Doe</p>
                <p className="text-xs text-gray-600">The Blue Sky: What a beautiful view! #sky #blue #pretty</p>
              </div>
              <button className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2">Edit</button>
              <button 
                className="bg-red-500 text-white px-3 py-1 rounded-md" 
                onClick={() => setRemoveModalOpen(true)}
              >
                Remove
              </button>
            </div>
            {/* Repeat the above div for more social accounts as needed */}
            <div className="bg-gray-100 p-4 rounded-md shadow-sm flex items-center">
              <img src="/path/to/image.jpg" alt="Profile" className="w-12 h-12 object-cover rounded-full mr-4" />
              <div className="flex-1">
                <p className="text-sm font-bold">Account 2</p>
                <p className="text-xs text-gray-600">Details about Account 2</p>
              </div>
              <button className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2">Edit</button>
              <button 
                className="bg-red-500 text-white px-3 py-1 rounded-md" 
                onClick={() => setRemoveModalOpen(true)}
              >
                Remove
              </button>
            </div>
            <div className="bg-gray-100 p-4 rounded-md shadow-sm flex items-center">
              <img src="/path/to/image.jpg" alt="Profile" className="w-12 h-12 object-cover rounded-full mr-4" />
              <div className="flex-1">
                <p className="text-sm font-bold">Account 3</p>
                <p className="text-xs text-gray-600">Details about Account 3</p>
              </div>
              <button className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2">Edit</button>
              <button 
                className="bg-red-500 text-white px-3 py-1 rounded-md" 
                onClick={() => setRemoveModalOpen(true)}
              >
                Remove
              </button>
            </div>
            {/* Add more user entries as needed */}
          </div>
          <button
            onClick={() => setConnectModalOpen(true)}
            className="w-full px-4 py-2 mt-6 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Connect To More Social Media Platform
          </button>
        </div>
      </div>
      <ModalRemoveAccount isOpen={isRemoveModalOpen} onClose={() => setRemoveModalOpen(false)} />
      <ConnectSocialMedia isOpen={isConnectModalOpen} onClose={() => setConnectModalOpen(false)} />

      
    </>
  );
};

export default ModalSocial;
