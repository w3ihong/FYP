"use client";
import { fetchReports } from '@/app/actions';
import React, { useState, useEffect } from 'react';
import ModalContainer from '@/components/modalContainer';

export default function adminReports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReason, setSelectedReason] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      const usersData = await fetchReports();
      setUsers(usersData);
      setLoading(false);
    };
    loadUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.reporter_id.toLowerCase().includes(searchTerm.toLowerCase())
      
  );

  const handleOpenViewModal = (reason) => {
    setSelectedReason(reason);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedReason('');
  };

  return (
    <main className="flex-1 max-w-full p-8">
      <h1 className="text-2xl font-bold mb-6 -mt-4">Users Reports</h1>
      <div className="bg-yellow-200 rounded-lg shadow-md p-8 max-h-[80vh] overflow-auto">
        <div className="mb-6">
          <input
            type="text"
            className="w-full p-3 pr-5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-4">
          {loading ? (
            <div>Loading...</div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                <div>{user.reportee_id} , {user.reporter_id} , {user.last_name}  </div>
                <button
                  className="bg-gray-400 text-white px-10 py-1 rounded-lg hover:bg-gray-500"
                  onClick={() => handleOpenViewModal(user.reason)}
                >
                  View
                </button>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center">No users found</div>
          )}
        </div>
      </div>

      {/* View Suspension Modal */}
      <ModalContainer isOpen={isViewModalOpen} onClose={handleCloseViewModal}>
        <h2 className="text-2xl font-bold mb-4 mt-24">Reason</h2>
        <textarea
          className="w-full h-60 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-6 resize-none"
          value={selectedReason}
          readOnly
        />
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            onClick={handleCloseViewModal}
          >
            Close
          </button>
        </div>
      </ModalContainer>
    </main>
  );
}
