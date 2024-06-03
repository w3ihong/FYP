import React from 'react';

const ConnectSocialMedia = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-lg p-8" style={{ width: '500px', height: '400px' }}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 text-xl">&times;</button>
        <h2 className="text-center text-2xl font-bold mb-8">Connect To More Social Media Platform</h2>
        <div className="flex flex-col items-center space-y-4">
          <button className="w-full px-4 py-2 bg-blue-900 text-white text-base font-medium rounded-md shadow-sm flex items-center justify-center hover:bg-blue-700">
            <img src="/Instagram.jpeg" alt="Instagram" className="w-6 h-6 mr-2" /> Instagram
          </button>
          <button className="w-full px-4 py-2 bg-blue-900 text-white text-base font-medium rounded-md shadow-sm flex items-center justify-center hover:bg-blue-700">
            <img src="Twitter.png" alt="Twitter" className="w-6 h-6 mr-2" /> Twitter
          </button>
          <button className="w-full px-4 py-2 bg-blue-900 text-white text-base font-medium rounded-md shadow-sm flex items-center justify-center hover:bg-blue-700">
            <img src="Facebook.jpeg" alt="Facebook" className="w-6 h-6 mr-2" /> Facebook
          </button>
        </div>
        <div className="w-full mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectSocialMedia;
