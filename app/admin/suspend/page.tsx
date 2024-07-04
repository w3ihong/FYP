"use client";
import React, { useState, useEffect } from 'react';
import ModalContainer from '@/components/modalContainer';
import { fetchUsers, disableUsers, enableUsers, fetchSuspension } from '@/app/actions'; // Adjust the import path accordingly

export default function AdminSuspend() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [viewSuspensionId, setViewSuspensionId] = useState('');
  const [confirmSuspensionId, setConfirmSuspensionId] = useState('');
  const [suspensionReason, setSuspensionReason] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [reason, setReason] = useState('');
  const [users, setUsers] = useState([]);
  const [suspensions, setSuspensions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        console.log('Fetched users:', usersData); // Debugging line

        const formattedUsers = usersData.map((user) => ({
          ...user,
          suspended: user.suspended ? true : false, // Default to false if not provided
        }));

      

        setUsers(formattedUsers);
        localStorage.setItem('users', JSON.stringify(formattedUsers));
        setLoading(false);
      } catch (error) {
        console.error('Error loading users:', error);
        setLoading(false);
      }
    };

    const loadSuspensions = async () => {
      try {
        const suspensionData = await fetchSuspension();
        setSuspensions(suspensionData);
      } catch (error) {
        console.error('Error loading suspensions:', error);
      }
    };

    loadUsers();
    loadSuspensions();
  }, []);

  const handleOpenViewModal = (userId, suspensionReason) => {
    setViewSuspensionId(userId);
    setSuspensionReason(suspensionReason);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewSuspensionId('');
    setSuspensionReason('');
  };

  const handleOpenConfirmModal = (user) => {
    setSelectedUser(user);
    setConfirmSuspensionId(user.user_id);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedUser(null);
    setConfirmSuspensionId('');
    setReason('');
  };

  const handleConfirmSuspend = async () => {
    if (selectedUser) {
      const result = selectedUser.suspended
        ? await enableUsers(selectedUser.user_id)
        : await disableUsers(selectedUser.user_id);

      if (result.success) {
        const updatedUsers = users.map((u) =>
          u.user_id === selectedUser.user_id ? { ...u, suspended: !u.suspended } : u
        );
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        alert(`User ${selectedUser.name} has been ${selectedUser.suspended ? 'unsuspended' : 'suspended'}.`);
      } else {
        alert(`Failed to ${selectedUser.suspended ? 'unsuspend' : 'suspend'} user.`);
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

  const suspendedUsers = filteredUsers.filter(user => user.suspended);

  console.log("Filtered Users:", filteredUsers);
  console.log("Suspended Users:", suspendedUsers);

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
            suspendedUsers.map((user, index) => {
              const suspension = suspensions.find(s => s.user_id === user.user_id);
              const suspensionReason = suspension ? suspension.reason : 'Reason not available';

              return (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                  <div>{user.name} , {user.user_id}</div>
                  <div>
                    <button 
                      className="bg-gray-400 text-roboto text-white px-10 py-1 mr-2 rounded-lg hover:bg-gray-500"
                      onClick={() => handleOpenViewModal(user.user_id, suspensionReason)}
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
              );
            })
          ) : (
            <div className="text-center text-gray-500">No users found</div>
          )}
        </div>
      </div>

      {/* View Suspension Modal */}
      <ModalContainer isOpen={isViewModalOpen} onClose={handleCloseViewModal}>
        <h2 className="text-2xl font-bold mb-4 mt-24">Suspension ID: #{viewSuspensionId}</h2>
        <textarea
          className="w-full h-60 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-6 resize-none"
          value={suspensionReason}
          readOnly
        />
      </ModalContainer>

      {/* Confirm Suspension Toggle Modal */}
      <ModalContainer isOpen={isConfirmModalOpen} onClose={handleCloseConfirmModal}>
        <h2 className="text-2xl font-bold mb-4 mt-20">Confirm {selectedUser?.suspended ? 'Unsuspend' : 'Suspend'} User</h2>
        <h3 className="text-lg mb-2">Suspension ID: #{confirmSuspensionId}</h3>
        <label className="block text-lg mb-2">Reason for {selectedUser?.suspended ? 'Unsuspending' : 'Suspending'}:</label>
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
