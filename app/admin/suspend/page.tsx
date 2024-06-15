"use client"

import React, { useState } from 'react';
import ModalContainer from '@/components/modalContainer';

export default function AdminSuspend() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [suspensionId, setSuspensionId] = useState('');
  const [suspensionReason, setSuspensionReason] = useState('');

  // Function to open the view modal
  const handleOpenViewModal = (suspensionId, suspensionReason) => {
    setSuspensionId(suspensionId);
    setSuspensionReason(suspensionReason);
    setIsViewModalOpen(true);
  };

  // Function to close the view modal
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSuspensionId('');
    setSuspensionReason('');
  };

  // Sample data for suspension reasons
  const suspensionData = [
    { id: '12345', reason: 'Repeated violation of community guidelines' },
    { id: '54321', reason: 'Harassment towards other users' },
    // Add more suspension data as needed
  ];

  return (
    <main className="flex-1 max-w-full p-8">
      <h1 className="text-2xl font-bold mb-6 -mt-4">Suspend Users</h1>
      <div className="bg-yellow-200 rounded-lg shadow-md p-8 max-h-[80vh] overflow-auto">
        <div className="mb-6">
          <input 
            type="text" 
            className="w-full p-3 pr-5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500" 
            placeholder="Search users..."
          />
        </div>
        
        <div className="space-y-4">
          {suspensionData.map((suspension, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
              <div>User {index + 1}</div>
              <div>
                <button 
                  className="bg-gray-400 text-roboto text-white px-10 py-1 mr-2 rounded-lg hover:bg-gray-500"
                  onClick={() => handleOpenViewModal(suspension.id, suspension.reason)}
                >
                  View
                </button>
                <button className="bg-accent text-white px-4 py-1 rounded-lg hover:bg-blue-900 mr-2">
                  Unsuspend
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Suspension Modal */}
      <ModalContainer isOpen={isViewModalOpen} onClose={handleCloseViewModal}>
        <h2 className="text-2xl font-bold mb-4 mt-24">Suspension ID: #{suspensionId}</h2>
        <textarea
          className="w-full h-60 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-6 resize-none"
          value={suspensionReason}
          readOnly
        />
      </ModalContainer>
    </main>
  );
}
