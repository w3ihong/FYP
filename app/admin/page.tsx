"use client";
import React, { useState, useEffect } from 'react';
import ModalContainer from '@/components/modalContainer';
import { disableUsers, fetchUsers, enableUsers } from '../actions'; // Adjust the import path accordingly
import { insertSuspensionData } from '@/app/actions';

export default function AdminHome() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ user_id: string, name: string, suspended: boolean } | null>(null);
  const [reason, setReason] = useState('');
  const [users, setUsers] = useState<any[]>([]); // Adjust type as per your actual user structure
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        console.log('Fetched users:', usersData); // Debugging line
  
        const formattedUsers = usersData.map((user) => ({
          ...user,
          suspended: user.suspended ? user.suspended : false, // Default to false if not provided
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
    setSelectedUser({ user_id: user.user_id, name: user.name, suspended: user.suspended });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setReason('');
  };

  const handleConfirmSuspend = async () => {
    if (selectedUser) {
      console.log(`User: ${selectedUser.name}, ID: ${selectedUser.user_id}, Reason: ${reason}`); // Debugging line
      let result;
      if (selectedUser.suspended) {
        result = await enableUsers(selectedUser.user_id); // Call enableUsers if the user is suspended
      } else {
        result = await disableUsers(selectedUser.user_id); // Call disableUsers if the user is not suspended
      }
  
      if (result.success) {
        alert(`User ${selectedUser.name} has been ${selectedUser.suspended ? 'unsuspended' : 'suspended'}.`);
        
        // Re-fetch the latest users data
        const usersData = await fetchUsers();
        const formattedUsers = usersData.map((user) => ({
          ...user,
          suspended: user.suspended ? user.suspended : false, // Default to false if not provided
        }));
        setUsers(formattedUsers);
        localStorage.setItem('users', JSON.stringify(formattedUsers));
  
        // Insert suspension data with the reason
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
    return <div>Loading...</div>;
  }

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex-1 max-w-full p-8">
      <h1 className="text-2xl font-bold mb-6 -mt-4">Users</h1>
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
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                <div>{user.name}, {user.user_id}, {user.suspended ? 'Suspended' : 'Active'}</div>
                <button
                  className={`text-white px-8 py-1 rounded-lg ${user.suspended ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
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
        <h2 className="text-2xl font-raleway font-bold mb-2 mt-20">{selectedUser?.suspended ? 'Unsuspend' : 'Suspend'} User</h2>
        <label className="block text-lg mb-2">Reason for {selectedUser?.suspended ? 'Unsuspending' : 'Suspending'}:</label>
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
