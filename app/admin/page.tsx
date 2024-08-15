"use client";
import React, { useState, useEffect } from 'react';
import ModalContainer from '@/components/modalContainer';
import { disableUsers, fetchUsers, enableUsers } from '../actions'; // Adjust the import path accordingly
import { insertSuspensionData } from '@/app/actions';

export default function AdminHome() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ user_id: string, name: string, suspended: boolean } | null>(null);
  const [reason, setReason] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        console.log('Fetched users:', usersData);

        const formattedUsers = usersData.map((user) => ({
          ...user,
          suspended: user.suspended ? user.suspended : false,
        }));

        setUsers(formattedUsers);
        localStorage.setItem('users', JSON.stringify(formattedUsers));
        setLoading(false);
      } catch (error) {
        console.error('Error loading users:', error);
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleOpenModal = (user: any) => {
    setSelectedUser({ user_id: user.user_id, name: user.first_name, suspended: user.suspended });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setReason('');
  };

  const handleConfirmSuspend = async () => {
    if (selectedUser) {
      console.log(`User: ${selectedUser.name}, ID: ${selectedUser.user_id}, Reason: ${reason}`);
      let result;
      if (selectedUser.suspended) {
        result = await enableUsers(selectedUser.user_id);
      } else {
        result = await disableUsers(selectedUser.user_id);
      }

      if (result.success) {
        alert(`User ${selectedUser.name} has been ${selectedUser.suspended ? 'unsuspended' : 'suspended'}.`);

        const usersData = await fetchUsers();
        const formattedUsers = usersData.map((user) => ({
          ...user,
          suspended: user.suspended ? user.suspended : false,
        }));
        setUsers(formattedUsers);
        localStorage.setItem('users', JSON.stringify(formattedUsers));

        await insertSuspensionData(selectedUser.user_id, reason);
      } else {
        alert(`Failed to ${selectedUser.suspended ? 'unsuspend' : 'suspend'} user: ${result.error.message}`);
      }
    } else {
      alert('No user selected');
    }
    handleCloseModal();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg font-semibold text-gray-600">Loading...</div>;
  }

  const filteredUsers = users.filter((user) =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='bg-gray-50'>
    <main className="flex-1 p-8 ">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8">User Management</h1>
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
        
        {/* Label Row */}
        <div className="bg-gray-200 rounded-lg shadow-sm p-4 flex justify-between items-center font-bold text-gray-700 mb-4">
          <span className="w-1/3 text-center">Name</span>
          <span className="w-1/3 text-center">Account ID</span>
          <span className="w-1/2 text-center">Status</span>
        </div>

        <div className="space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div key={index} className="bg-gray-50 rounded-lg shadow-sm p-4 flex justify-between items-center">
                <div className="w-1/3 text-lg font-medium text-gray-700 text-center">{user.first_name}</div>
                <div className="w-1/3 text-lg font-medium text-gray-700 text-center">{user.user_id}</div>
                <div className="w-1/3 text-lg font-medium text-gray-700 text-center">{user.suspended ? 'Suspended' : 'Active'}</div>
                <button
                  className={`text-white px-6 py-2 rounded-lg font-semibold ${user.suspended ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                  onClick={() => handleOpenModal(user)}
                >
                  {user.suspended ? 'Unsuspend' : 'Suspend'}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No users found</div>
          )}
        </div>
      </div>
      <ModalContainer isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="my-6 text-2xl font-extrabold text-gray-800 mb-4">{selectedUser?.suspended ? 'Unsuspend' : 'Suspend'} User</h2>
        <label className="block text-lg font-medium text-gray-700 mb-2">Reason for {selectedUser?.suspended ? 'Unsuspending' : 'Suspending'}:</label>
        <textarea
          className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4 resize-none"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter the reason here..."
        />
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600"
            onClick={handleCloseModal}
          >
            Cancel
          </button>
          <button
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600"
            onClick={handleConfirmSuspend}
          >
            Confirm
          </button>
        </div>
      </ModalContainer>
    </main>
    </div>
  );
}
