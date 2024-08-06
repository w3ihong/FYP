'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserProfile, updateUserProfile } from '@/app/actions';
import ModalSuccess from '@/components/modalSuccess';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';
import { registerLocale } from 'react-datepicker';
import enUS from 'date-fns/locale/en-US';


import { Locale } from 'date-fns';
registerLocale('en-US', enUS as unknown as Locale);

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
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    country: '',
    gender: '',
    preference: ''
  });

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

  const handleDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      dateOfBirth: date ? date.toISOString().split('T')[0] : ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { ...errors };
    let hasError = false;

    // Check for empty fields and update error messages
    Object.keys(formData).forEach((key) => {
      if (!formData[key] || (key === 'gender' && formData[key] === '')) {
        newErrors[key] = 'This field cannot be empty.';
        hasError = true;
      } else {
        newErrors[key] = '';
      }
    });

    // Special validation for gender field
    if (formData.gender === '') {
      newErrors.gender = 'Please select a gender.';
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    const success = await updateUserProfile(formData);
    if (success) {
      setShowModal(true);
      console.log('Profile updated successfully');
    } else {
      console.error('Error updating profile');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 50
    },
    in: {
      opacity: 1,
      y: 0
    },
    out: {
      opacity: 0,
      y: -50
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="flex w-full"
    >
      <main className="flex-1 p-6 ml-10 bg-gray-50">
        <div className="mx-auto w-full">
          <h1 className="text-2xl font-bold mx-8 mb-4">Profile</h1>
          <section className="mb-6 mx-8">
            <div className="bg-white p-6 rounded-lg shadow-md w-full">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="text-sm font-bold text-accent block mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`text-sm ${errors.firstName ? 'bg-red-50 border-red-500 text-red-900' : 'text-gray-900'} font-inter border rounded-md p-2 w-full mt-1`}
                  />
                  {errors.firstName && <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>}
                </div>
                <div className="mb-4">
                  <label className="text-sm font-bold text-accent block mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`text-sm ${errors.lastName ? 'bg-red-50 border-red-500 text-red-900' : 'text-gray-900'} font-inter border rounded-md p-2 w-full mt-1`}
                  />
                  {errors.lastName && <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>}
                </div>
                <div className="mb-4 relative">
                  <label className="text-sm font-bold text-accent block mb-1">Date of Birth</label>
                  <div className="relative">
                    <DatePicker
                      selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                      onChange={handleDateChange}
                      placeholderText="DD/MM/YYYY"
                      className={`text-sm ${errors.dateOfBirth ? 'bg-red-50 border-red-500 text-red-900' : 'text-gray-900'} font-inter border rounded-md p-2 w-full mt-1 pl-10`}
                      dateFormat="dd/MM/yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      locale="en-US"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                  {errors.dateOfBirth && <p className="mt-2 text-sm text-red-600">{errors.dateOfBirth}</p>}
                </div>
                <div className="mb-4">
                  <label className="text-sm font-bold text-accent block mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`text-sm ${errors.country ? 'bg-red-50 border-red-500 text-red-900' : 'text-gray-900'} font-inter border rounded-md p-2 w-full mt-1`}
                  />
                  {errors.country && <p className="mt-2 text-sm text-red-600">{errors.country}</p>}
                </div>
                <div className="mb-4">
                  <label className="text-sm font-bold text-accent block mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`text-sm ${errors.gender ? 'bg-red-50 border-red-500 text-red-900' : 'text-gray-900'} font-inter border rounded-md p-2 w-full mt-1`}
                  >
                    <option value="">Select Your Gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer Not To Say">Prefer Not To Say</option>
                  </select>
                  {errors.gender && <p className="mt-2 text-sm text-red-600">{errors.gender}</p>}
                </div>
                <div className="mb-4">
                  <label className="text-sm font-bold text-accent block mb-1">Interests</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      name="preference"
                      value={formData.preference}
                      onChange={handleChange}
                      className={`flex-grow text-sm ${errors.preference ? 'bg-red-50 border-red-500 text-red-900' : 'text-gray-900'} font-inter border rounded-md p-2 mr-2 mt-1`}
                      readOnly
                    />
                    <Link href="/settings/profileEdit">
                      <button
                        type="button"
                        className="px-6 py-2 text-white bg-cyan-950 hover:bg-cyan-900 rounded cursor-pointer"
                      >
                        Edit
                      </button>
                    </Link>
                  </div>
                  {errors.preference && <p className="mt-2 text-sm text-red-600">{errors.preference}</p>}
                </div>
                <div className="flex mt-6 justify-end">
                  <button
                    type="submit"
                    className="bg-accent font-roboto text-white w-64 py-2 rounded-md"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>
      {showModal && (
        <ModalSuccess
          message="Successfully Saved Profile Information!"
          onClose={handleModalClose}
          isOpen={showModal}
        />
      )}
    </motion.div>
  );
};

export default ProfileUpdateForm;
