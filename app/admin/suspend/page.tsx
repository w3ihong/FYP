"use client";

import React, { useState, useEffect } from 'react';
import ModalContainer from '@/components/modalContainer';
import { fetchUsers, disableUsers, enableUsers } from '@/app/actions';

export default function AdminSuspend() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [suspensionId, setSuspensionId] = useState('');
  const [suspensionReason, setSuspensionReason] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [reason, setReason] = useState('');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      const usersData = await fetchUsers();
      setUsers(usersData);
      setLoading(false);
    };
    loadUsers();
  }, []);

  const handleOpenViewModal = (suspensionId : string, suspensionReason : string) => {
    setSuspensionId(suspensionId);
    setSuspensionReason(suspensionReason);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSuspensionId('');
    setSuspensionReason('');
  };

  

  const handleOpenConfirmModal = (user: React.SetStateAction<null>) => {
    setSelectedUser(user);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedUser(null);
    setReason('');
  };

  const handleConfirmSuspend = async () => {
    if (selectedUser) {
      const result = selectedUser.disabled
        ? await enableUsers(selectedUser.user_id)
        : await disableUsers(selectedUser.user_id);
        

      if (result.success) {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.user_id === selectedUser.user_id ? { ...u, disabled: !u.disabled } : u
          )
        );
        alert(`User ${selectedUser.name} has been ${selectedUser.disabled ? 'unsuspended' : 'suspended'}.`);
      } else {
        alert(`Failed to ${selectedUser.disabled ? 'unsuspend' : 'suspend'} user.`);
      }
      handleCloseConfirmModal();
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const suspendedUsers = filteredUsers.filter(user => user.disabled);

  return (
    <main className="flex-1 max-w-full p-8">
      <h1 className="text-2xl font-bold mb-6 -mt-4">Suspended Users</h1>
      <div className="bg-yellow-200 rounded-lg shadow-md p-8 max-h-[80vh] overflow-auto">
        <div className="mb-6">
          <input 
            type="text" 
            className="w-full p-3 pr-5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500" 
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="space-y-4">
          {suspendedUsers.length > 0 ? (
            suspendedUsers.map((user, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                <div>{user.name} , {user.user_id}</div>
                <div>
                  <button 
                    className="bg-gray-400 text-roboto text-white px-10 py-1 mr-2 rounded-lg hover:bg-gray-500"
                    onClick={() => handleOpenViewModal(user.user_id, 'User is suspended')}
                  >
                    View
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg"
                    onClick={() => handleOpenConfirmModal(user)}
                  >
                    Unsuspend
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No users found</div>
          )}
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

      {/* Confirm Suspension Toggle Modal */}
      <ModalContainer isOpen={isConfirmModalOpen} onClose={handleCloseConfirmModal}>
        <h2 className="text-2xl font-bold mb-4 mt-20">{selectedUser ? 'Unsuspend' : 'Suspend'} User</h2>
        <label className="block text-lg mb-2">Reason for {selectedUser? 'Unsuspending' : 'Suspending'}:</label>
        <textarea
          className="w-full h-60 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-6 resize-none"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            onClick={handleCloseConfirmModal}
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
