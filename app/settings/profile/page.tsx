'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserProfile, updateUserProfile } from '@/app/actions';
import ModalSuccess from '@/components/modalSuccess';

const ProfileUpdateForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    country: '',
    gender: '',
    preference: ''
  });
  const [showModal, setShowModal] = useState(false);
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
          preference: profileData.main_category|| ''
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
      console.log('Profile updated successfully');
    } else {
      // Handle update error (e.g., show an error message)
      console.error('Error updating profile');
    }
  };
  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center font-raleway">
      <div className="p-6 w-2/3">
        <div className="flex justify-center mb-6">
          <h1 className="text-center font-bold text-2xl">Update profile information</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-4 mb-4 items-center">
            <label className="text-sm font-bold text-accent ">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="col-span-2 p-2 border border-accent shadow rounded"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4 items-center">
            <label className="text-sm font-bold text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="col-span-2 p-2 border border-accent shadow rounded"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4 items-center">
            <label className="text-sm font-bold text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              placeholder="DD/MM/YYYY"
              className="col-span-2 p-2 border border-accent shadow rounded"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4 items-center">
            <label className="text-sm font-bold text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="col-span-2 p-2 border border-accent shadow rounded"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4 items-center">
            <label className="text-sm font-bold text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="col-span-2 p-2 border border-accent shadow rounded"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4 items-center">
            <label className="text-sm font-bold text-gray-700">Interests</label>
            <div className="col-span-2 flex items-center">
              <input
                type="text"
                name="preference"
                value={formData.preference}
                onChange={handleChange}
                className="flex-grow p-2 border border-accent shadow rounded mr-2"
                readOnly
              />
              <Link href="/settings/profileEdit">
                <button type="button" className="px-6 py-2 text-white bg-cyan-950 hover:bg-cyan-900 rounded cursor-pointer">
                  Edit
                </button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button type="submit" className="px-6 py-2 text-white bg-cyan-950 hover:bg-cyan-900 rounded cursor-pointer">
              Save
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

export default ProfileUpdateForm;
