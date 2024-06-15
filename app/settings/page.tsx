"use client"

import React, { useEffect, useState } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline'; 
import ModalBackdrop from '@/components/modalBackdrop';
import { deleteUser, disableUser, getEmail, sendOTP, updateEmail, updatePassword, verifyOTP } from '../actions';
import { redirect } from 'next/dist/server/api-utils';
import router from 'next/router';
import { login } from '../actions';



// Mock user data
const user = {
  
  email: '',
};




export default function Settings() {
  const [email, setEmail] = useState(user.email);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [isDisableAccountModalOpen, setIsDisableAccountModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [modalEmail, setModalEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));

  useEffect(() => {
    async function fetchEmail() {
      const fetchedEmail = await getEmail();
      setEmail(fetchedEmail);
      if (fetchedEmail !== email) {
        setModalEmail(fetchedEmail);
      }
    }
    fetchEmail();
  }, []);
  
  
  

  const toggleEmailModal = () => {
    setIsEmailModalOpen(!isEmailModalOpen);
    setModalEmail(email); 
  };

  const togglePasswordModal = () => {
    setIsPasswordModalOpen(!isPasswordModalOpen);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const toggle2FAModal = () => {
    setIs2FAModalOpen(!is2FAModalOpen);
    setOtp(Array(6).fill(''));
  };

  const toggleDisableAccountModal = () => {
    setIsDisableAccountModalOpen(!isDisableAccountModalOpen);
  };

  const toggleDeleteAccountModal = () => {
    setIsDeleteAccountModalOpen(!isDeleteAccountModalOpen);
  };

  const saveEmail = async () => {
    try {
      await updateEmail(email, modalEmail);  // Call the updateEmail function
      setEmail(modalEmail); 
      setIsEmailModalOpen(false);
      router.push('/settings?message=Email updated successfully');  // Redirect on success
    } catch (error) {
      console.error('Error updating email:', error);
      router.push('/settings/change-email?message=Error updating email');  // Redirect on error
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      console.error('New passwords do not match');
      return;
    }
    try {
      await updatePassword(currentPassword , newPassword);
      console.log('Password changed');
      setIsPasswordModalOpen(false);
    } catch (error) {
      console.error('Error changing password:', error.message);
    }
  };


  const enable2FA = async () => {
    try {
      // Assuming you have the email available in the component state
      const userEmail = email;
      if (!userEmail) {
        console.error('Email not found.');
        return;
      }
  
      // Call the sendOTP function with the user's email
      const otp = await sendOTP(userEmail);
      if (otp) {
        console.log('2FA enabled with OTP:', otp);
        setIs2FAModalOpen(true);
        // Optionally, show an input field to the user to enter the OTP for verification
      } else {
        console.error('Failed to enable 2FA.');
        // Handle the failure case appropriately
      }
    } catch (error) {
      console.error('Error enabling 2FA:', error.message);
      // Handle the error appropriately
    }
  };

  const handleVerifyOTP = async () => {
    const enteredOtp = otp.join('');
    const userEmail = email;

    if (!userEmail) {
      console.error('Email not found.');
      return;
    }

    try {
      const isValidOtp = await verifyOTP(userEmail, enteredOtp);
      if (isValidOtp) {
        console.log('OTP verified successfully');
        router.push('/protected');
        setIs2FAModalOpen(false);
      } else {
        console.error('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
    }
  };


 
  

  const handleDisableAccount = async () => {
    try {
      // Call the disableUser function with the user's email
      const isDisabled = await disableUser();
      
      if (isDisabled) {
        console.log('Account disabled successfully');
        // Optionally, you can redirect the user or show a success message
        
        
        
      } else {
        console.log('Failed to disable account');
        // Handle the failure case
      }
      
      setIsDisableAccountModalOpen(false); // Close the modal
      
    } catch (error) {
      console.error('Error disabling account:', error.message);
      // Handle the error appropriately
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const isDeleted = await deleteUser();
  
      if (isDeleted) {
        console.log('Account deleted successfully');
        router.push('/goodbye'); // Redirect the user to a goodbye page or home page
      } else {
        console.error('Failed to delete account');
        // Optionally, handle the failure case (e.g., show an error message)
      }
  
      setIsDeleteAccountModalOpen(false); // Close the modal
    } catch (error) {
      console.error('Error deleting account:', error.message);
      // Optionally, handle the error appropriately (e.g., show an error message)
    }
  };

  return (
    <div className="flex w-full">
      <main className="flex-1 p-8"> 
        <div className="mx-auto">
          <h1 className="text-2xl font-bold mb-6 mx-8">Settings</h1> 
          
          <section className="mb-6 mx-8">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="bg-white p-6 rounded-lg shadow-md w-full"> 
              <div className="mb-4">
                
                {/* Email Address */}
                <p className="text-sm mb-3 font-semibold text-accent">Email Address</p>
                <div className="flex items-center">
                  <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 ml-0.3 mr-3" aria-hidden="true" />
                    </span>
                    <input 
                      type="text" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="text-sm text-gray-900 font-inter border border-gray-300 rounded-md p-2 pl-16 w-full"
                      readOnly 
                      style={{ pointerEvents: 'none', paddingLeft: '2.5rem' }} 
                    />
                  </div>
                  <button className="bg-accent font-roboto text-white px-6 py-2 rounded-md ml-4" onClick={toggleEmailModal}>Edit</button>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mb-6 mx-8">
            <h2 className="text-xl font-semibold mb-4">Password and Authentication</h2>
            
            {/* Change Password */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Change Your Password</h3>
              <p className="text-sm text-gray-700 mb-6">
                Regularly change your password to avoid getting compromised! 
                After clicking the button below, a link will be sent to your Email. 
                Follow the full directions from there.
              </p>
              <div className="flex justify-end">
                <button className="bg-accent font-roboto text-white px-4 py-2 rounded-md w-64" onClick={togglePasswordModal}>Change Password</button>
              </div>
            </div>
            
            {/* Enable 2 Factor Authentication */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enable 2-Factor Authentication</h3>
              <p className="text-sm text-gray-700 mb-6">
                Protect your account with an extra layer of security. 
                Once configured, you’ll be required to enter your password 
                and complete one additional step in order to sign in.
              </p>
              <div className="flex justify-end">
                <button className="bg-accent font-roboto text-white px-4 py-2 rounded-md w-64" onClick={toggle2FAModal}>Enable 2-Factor Authentication</button>
              </div>
            </div>
            
            {/* Deactivate / Delete Account */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Removal</h3>
              <p className="text-sm text-gray-700 mb-6">
                Disabling your account means you can recover 
                it any time after taking this action. 
                Deleting your account will permanently delete your data from our database.
              </p>
              <div className="flex justify-end space-x-4">
                <button className="bg-cred font-roboto text-white px-4 py-2 rounded-md w-52" onClick={toggleDisableAccountModal}>Disable Account</button>
                <button className="bg-accent font-roboto text-white px-4 py-2 rounded-md w-52" onClick={toggleDeleteAccountModal}>Delete Account</button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {isEmailModalOpen && (
        <ModalBackdrop onClick={toggleEmailModal}>
          <div className="bg-white p-8 rounded-md shadow-lg w-[40rem] h-[20rem] relative" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 left-2 text-gray-500" onClick={toggleEmailModal}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <h2 className="text-lg font-semibold mb-4">Edit Email</h2>
              <div className="mb-4">
                <p className="text-sm mb-2">Old Email:</p>
                <input 
                  type="text" 
                  value={email} 
                  readOnly
                  className="text-sm text-gray-900 font-inter border border-gray-300 rounded-md p-2 w-[30rem] bg-gray-100 no-focus-outline"
                />
              </div>
              <div className="mb-4">
                <p className="text-sm mb-2">New Email:</p>
                <input 
                  type="text" 
                  value={modalEmail} 
                  onChange={(e) => setModalEmail(e.target.value)} 
                  className="text-sm text-gray-900 font-inter border border-gray-300 rounded-md p-2 w-[30rem]"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button className="bg-accent font-roboto text-white px-6 py-2 rounded-md w-52" onClick={saveEmail}>Change Email</button>
              </div>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {isPasswordModalOpen && (
        <ModalBackdrop onClick={togglePasswordModal}>
          <div className="bg-white p-8 rounded-md shadow-lg w-[40rem] h-[25rem] relative" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 left-2 text-gray-500" onClick={togglePasswordModal}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <h2 className="text-lg font-semibold mb-4">Change Password</h2>
              <div className="mb-4">
                <p className="text-sm mb-2">Current Password:</p>
                <input 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  className="text-sm text-gray-900 font-inter border border-gray-300 rounded-md p-2 w-[30rem]"
                />
              </div>
              <div className="mb-4">
                <p className="text-sm mb-2">New Password:</p>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="text-sm text-gray-900 font-inter border border-gray-300 rounded-md p-2 w-[30rem]"
                />
              </div>
              <div className="mb-4">
                <p className="text-sm mb-2">Confirm New Password:</p>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="text-sm text-gray-900 font-inter border border-gray-300 rounded-md p-2 w-[30rem]"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button className="bg-accent font-roboto text-white px-6 py-2 rounded-md w-52" onClick={changePassword}>Change Password</button>
              </div>
            </div>
          </div>
        </ModalBackdrop>
      )}

{is2FAModalOpen && (
  <ModalBackdrop onClick={toggle2FAModal}>
    <div className="bg-white p-8 rounded-md shadow-lg w-[40rem] h-[20rem] relative" onClick={(e) => e.stopPropagation()}>
      <button className="absolute top-2 left-2 text-gray-500" onClick={toggle2FAModal}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h2 className="text-lg font-semibold mb-4">Enable 2-Factor Authentication</h2>
        <div className="flex justify-center mb-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <input 
              key={index}
              type="text" 
              maxLength={1}
              pattern="[0-9]*"
              className="text-sm text-gray-900 font-inter border border-gray-300 rounded-md p-2 w-12 h-12 mx-1 text-center"
              value={otp[index] || ''}
              onChange={(e) => {
                const newOtp = [...otp];
                newOtp[index] = e.target.value;
                setOtp(newOtp);
              }}
            />
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button className="bg-accent font-roboto text-white px-6 py-2 rounded-md w-52" onClick={enable2FA}>Enable 2FA</button>
          <button className="bg-accent font-roboto text-white px-6 py-2 rounded-md w-52" onClick={handleVerifyOTP}>Confirm</button>
        </div>
      </div>
    </div>
  </ModalBackdrop>
)}

      

    {/* Disable Account Modal */}
    {isDisableAccountModalOpen && (
      <ModalBackdrop onClick={toggleDisableAccountModal}>
        <div className="bg-white p-8 rounded-md shadow-lg w-[40rem] h-[25rem] relative flex flex-col justify-center" onClick={(e) => e.stopPropagation()}>
          <button className="absolute top-2 left-2 text-gray-500" onClick={toggleDisableAccountModal}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-xl text-accent font-bold mb-0 text-center">Are you sure you want to disable your account?</h2>

          <p className="text-sm text-gray-600 mb-4 text-center">
            You can come back anytime by logging in with your credentials.
          </p>

          <div className="mb-4 text-center">
            <p className="text-sm font-semibold mb-2">Reason for disabling your account:</p>
            <select className="text-sm text-gray-900 font-inter border border-gray-300 rounded-md p-2 w-[30rem] mb-4">
              <option value="personal">Personal reasons</option>
              <option value="security">Security concerns</option>
              <option value="no-longer-needed">No longer needed</option>
            </select>
          </div>
          <div className="flex justify-center space-x-4">
            <button className="bg-accent font-roboto text-white px-4 py-2 rounded-md w-44" onClick={handleDisableAccount}>Disable Account</button>
            <button className="bg-gray-400 font-roboto text-white px-4 py-2 rounded-md w-52" onClick={toggleDisableAccountModal}>Cancel</button>
          </div>
        </div>
      </ModalBackdrop>
    )}

      {/* Delete Account Modal */}
      {isDeleteAccountModalOpen && (
        <ModalBackdrop onClick={toggleDeleteAccountModal}>
          <div className="bg-white p-8 rounded-md shadow-lg w-[40rem] h-[25rem] relative flex flex-col justify-center" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 left-2 text-gray-500" onClick={toggleDeleteAccountModal}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl text-accent font-bold mb-0 text-center">Are you sure you want to delete your account?</h2>

            <p className="text-sm text-gray-600 mb-4 text-center">
              This action cannot be undone.
            </p>

            <div className="mb-4 text-center">
              <p className="text-sm font-semibold mb-2">Reason for deleting your account:</p>
              <select className="text-sm text-gray-900 font-inter border border-gray-300 rounded-md p-2 w-[30rem] mb-4">
                <option value="personal">Personal reasons</option>
                <option value="security">Security concerns</option>
                <option value="no-longer-needed">No longer needed</option>
              </select>
            </div>
            <div className="flex justify-center space-x-4">
              <button className="bg-cred font-roboto text-white px-4 py-2 rounded-md w-52" onClick={handleDeleteAccount}>Delete Account</button>
              <button className="bg-gray-400 font-roboto text-white px-4 py-2 rounded-md w-52" onClick={toggleDeleteAccountModal}>Cancel</button>
            </div>
          </div>
        </ModalBackdrop>
        )}

      </div>
  );
}