"use client";
import React, { useState, useEffect } from 'react';
import ModalContainer from '@/components/modalContainer';
import { fetchReports } from '@/app/actions';

export default function AdminReports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReason, setSelectedReason] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchReports();
        console.log('Fetched Reports:', usersData); // Debugging line
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.reporter_id?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8">User Reports</h1>
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 max-h-[80vh] overflow-auto">
        <div className="mb-6">
          <input
            type="text"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <table className="w-full bg-gray-50 border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-left text-sm font-semibold text-gray-700">
              <th className="p-3">Reporter ID</th>
              <th className="p-3">Reportee ID</th>
              <th className="p-3">Last Name</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-3 text-center text-gray-500">Loading...</td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3 text-gray-700">{user.reporter_id}</td>
                  <td className="p-3 text-gray-700">{user.reportee_id}</td>
                  <td className="p-3 text-gray-700">{user.last_name}</td>
                  <td className="p-3 flex space-x-2">
                    <button
                      className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                      onClick={() => handleOpenViewModal(user.reason)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-3 text-center text-gray-500">No reports found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Report Modal */}
      <ModalContainer isOpen={isViewModalOpen} onClose={handleCloseViewModal}>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-4">Report Reason</h2>
        <textarea
          className="w-full h-60 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4 resize-none"
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
