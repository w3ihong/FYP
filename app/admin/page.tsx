"use client"

import React, { useState } from 'react';
import ModalContainer from '@/components/modalContainer';

export default function AdminHome() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  const handleOpenModal = (user: string) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setReason('');
  };

  const handleConfirmSuspend = () => {
    console.log(`User: ${selectedUser}, Reason: ${reason}`);
    // Add your logic for suspending the user with the given reason
    handleCloseModal();
  };

  return (
    <main className="flex-1 max-w-full p-8">
      <h1 className="text-2xl font-bold mb-6 -mt-4">Users</h1>
      <div className="bg-yellow-200 rounded-lg shadow-md p-8 max-h-[80vh] overflow-auto">
        <div className="mb-6">
          <input 
            type="text" 
            className="w-full p-3 pr-5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500" 
            placeholder="Search users..."
          />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
              <div>User {index + 1}</div>
              <button
                className="bg-red-500 text-white px-8 py-1 rounded-lg hover:bg-red-600"
                onClick={() => handleOpenModal(`User ${index + 1}`)}
              >
                Suspend
              </button>
            </div>
          ))}
        </div>
      </div>
      <ModalContainer isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-2xl font-raleway font-bold mb-2 mt-20">Suspend User</h2>
        <label className="block text-lg mb-2">Reason for Suspending:</label>
        <textarea
          className="w-full h-60 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-6 resize-none"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            onClick={handleCloseModal}
          >
            Cancel
          </button>
          <button
            className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-blue-900"
            onClick={handleConfirmSuspend}
          >
            Confirm
          </button>
        </div>
      </ModalContainer>
    </main>
  );
}
