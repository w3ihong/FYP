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

        alert(`User ${selectedUser.first_name} has been ${selectedUser.suspended ? 'unsuspended' : 'suspended'}.`);
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
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const suspendedUsers = filteredUsers.filter(user => user.suspended);

  console.log("Filtered Users:", filteredUsers);
  console.log("Suspended Users:", suspendedUsers);

  return (
    <main className="bg-gray-50 flex-1 max-w-full p-8 ">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Suspended Users</h1>
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 max-h-[80vh] overflow-auto">
        <div className="mb-6">
          <input 
            type="text" 
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400" 
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <table className="w-full bg-gray-50 border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-left text-sm font-semibold text-gray-700">
              <th className="p-3">Name</th>
              <th className="p-3">Account ID</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suspendedUsers.length > 0 ? (
              suspendedUsers.map((user, index) => {
                const suspension = suspensions.find(s => s.user_id === user.user_id);
                const suspensionReason = suspension ? suspension.reason : 'Reason not available';

                return (
                  <tr key={index} className="border-t">
                    <td className="p-3 text-gray-700">{user.first_name}</td>
                    <td className="p-3 text-gray-700">{user.user_id}</td>
                    <td className="p-3 text-gray-700">{user.suspended ? 'Suspended' : 'Active'}</td>
                    <td className="p-3 flex space-x-2">
                      <button 
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                        onClick={() => handleOpenViewModal(user.user_id, suspensionReason)}
                      >
                        View
                      </button>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                        onClick={() => handleOpenConfirmModal(user)}
                      >
                        Unsuspend
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="p-3 text-center text-gray-500">No users found</td>

              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Suspension Modal */}
      <ModalContainer isOpen={isViewModalOpen} onClose={handleCloseViewModal}>
        <div className=''>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-4 my-4 ">Suspension ID: #{viewSuspensionId}</h2>
        </div>
        <textarea
          className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4 resize-none"
          value={suspensionReason}
          readOnly
        />
      </ModalContainer>

      {/* Confirm Suspension Toggle Modal */}
      <ModalContainer isOpen={isConfirmModalOpen} onClose={handleCloseConfirmModal}>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-4 my-4">Confirm {selectedUser?.suspended ? 'Unsuspend' : 'Suspend'} User</h2>
        <h3 className="text-lg mb-2">Suspension ID: #{confirmSuspensionId}</h3>
        <label className="block text-lg font-medium text-gray-700 mb-2">Reason for {selectedUser?.suspended ? 'Unsuspending' : 'Suspending'}:</label>
        <textarea
          className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4 resize-none"
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
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
            onClick={handleConfirmSuspend}
          >
            Confirm
          </button>
        </div>
      </ModalContainer>
    </main>
  );
}
