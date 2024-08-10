'use client';

import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '@/app/actions';
import { useRouter } from 'next/navigation';
import ModalSuccess from '@/components/modalSuccess';

const ProfileSetForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    country: '',
    gender: '',
    preference: ''
  });
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();  // Initialize the useRouter hook

  useEffect(() => {
    // Fetch user profile data when component mounts
    const fetchUserProfile = async () => {
      const profileData = await getUserProfile();
      if (profileData) {
        setFormData({
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          dateOfBirth: profileData.DOB || '',
          country: profileData.country || '',
          gender: profileData.gender || '',
          preference: profileData.main_category || ''
        });
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateUserProfile(formData);
    if (success) {
      setShowModal(true);
    } else {
      console.error('Error updating profile');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    router.push('/landing/register/UserCategory');  
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex justify-center items-center font-raleway font-accent">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full">
        <div className='justify-center font-bold text-xl'>
          <h1>Fill in your details</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col mt-8">
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              placeholder="DD/MM/YYYY"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <br />
          <div className="flex justify-end">
            <button type="submit" className="px-6 p-2 text-white bg-cyan-950 hover:bg-cyan-900 rounded cursor-pointer">
              Next
            </button>
          </div>
        </form>
      </div>

      {showModal && (
        <ModalSuccess
          message="Profile information saved!"
          onClose={handleModalClose}
          isOpen={showModal}
        />
      )}
    </div>
  );
};

export default ProfileSetForm;
