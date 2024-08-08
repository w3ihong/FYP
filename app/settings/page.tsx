"use client";

import React, { useEffect, useState } from 'react';
import { EnvelopeIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; 
import SmallModalContainer from '@/components/smallModalContainer';
import ModalBackdrop from '@/components/modalBackdrop';
import { checkOTP, deleteUser, disableUser, getEmail, sendOTP, updateEmail, updatePassword, verifyOTP } from '../actions';
import { enableUser } from '../actions';
import router from 'next/router';
import ModalSuccess from '@/components/modalSuccess';
import { motion } from 'framer-motion';

const user = {
  email: '',
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
  type: "tween",
  ease: "anticipate",
  duration: 0.5
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
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isAccountDisabled, setIsAccountDisabled] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [emailValidationMessage, setEmailValidationMessage] = useState('');
  const [otpError, setOtpError] = useState(false);

  // Function for password visibility 
  const togglePasswordVisibility = (setter) => {
    setter((prev) => !prev);
  };

  // Function to fetch Email
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

  const handleToggleAccountStatus = async () => {
    if (isAccountDisabled) {
      // If account is disabled, enable it
      try {
        await enableUser();
        setIsSuccessModalOpen(true);
        setSuccessMessage('Account has been enabled successfully.');
        setIsAccountDisabled(false); // Update account status
      } catch (error) {
        console.error('Error enabling account:', error.message);
        // Handle error
      }
    } else {
      // If account is enabled, disable it
      try {
        await disableUser();
        setIsSuccessModalOpen(true);
        setSuccessMessage('Account has been disabled successfully.');
        setIsAccountDisabled(true); // Update account status
      } catch (error) {
        console.error('Error disabling account:', error.message);
        // Handle error
      }
    }
    setIsDisableAccountModalOpen(false); // Close the modal
  };

  const showSuccessModal = (message) => {
    setSuccessMessage(message);
    setIsSuccessModalOpen(true);
  };

  const toggleEmailModal = () => {
    setIsEmailModalOpen(!isEmailModalOpen);
    setModalEmail(email); 
    setEmailValidationMessage('');
  };

  const toggle2FAModal = () => {
    setIs2FAModalOpen(!is2FAModalOpen);
    setOtp(Array(6).fill(''));
    setOtpError(false);
  };

  const toggleDisableAccountModal = () => {
    setIsDisableAccountModalOpen(!isDisableAccountModalOpen);
  };

  const toggleDeleteAccountModal = () => {
    setIsDeleteAccountModalOpen(!isDeleteAccountModalOpen);
  };

  const saveEmail = async () => {
    if (!modalEmail) {
      setEmailValidationMessage('This field cannot be empty.');
      return;
    }

    if (modalEmail === email) {
      setEmailValidationMessage("This is the email you're using right now.");
      return;
    }

    try {
      await updateEmail(email, modalEmail);  // Call the updateEmail function
      setEmail(modalEmail); 
      setIsEmailModalOpen(false);
      showSuccessModal('An email has been sent to your new email.');
    } catch (error) {
      console.error('Error updating email:', error);
      router.push('/settings/change-email?message=Error updating email');  // Redirect on error
    }
  };

  const changePassword = async () => {
    setShowValidation(true);
    if (!currentPassword || !newPassword || !confirmPassword) {
      return;
    }
    if (newPassword !== confirmPassword) {
      console.error('New passwords do not match');
      return;
    }
    try {
      await updatePassword(currentPassword , newPassword);
      console.log('Password changed');
      setIsPasswordModalOpen(false);
<<<<<<< HEAD
      showSuccessModal('Password has been changed successfully.');
      setShowValidation(false);
=======
      showSuccessModal('Password has been changed succesfully');
      setShowValidation(true);
>>>>>>> 4f98c2675baec31c4bf8fe7c52a06a25c26ce3ec
    } catch (error) {
      console.error('Error changing password:', error.message);
    }
  };

  const enable2FA = async () => {
    try {
      const userEmail = email;
      if (!userEmail) {
        console.error('Email not found.');
        return;
      }
  
      const otp = await sendOTP(userEmail);
      if (otp) {
        console.log('2FA enabled with OTP:', otp);
        setIs2FAModalOpen(true);
      } else {
        console.error('Failed to enable 2FA.');
      }
    } catch (error) {
      console.error('Error enabling 2FA:', error.message);
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
      const isValidOtp = await checkOTP(userEmail, enteredOtp);
      if (isValidOtp) {
        console.log('OTP verified successfully');
        setIs2FAModalOpen(false);
        showSuccessModal('2FA enabled.');
        setOtpError(false);
      } else {
        console.error('Invalid OTP');
        setOtpError(true);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
      setOtpError(true);
    }
  };

  const handleDisableAccount = async () => {
    try {
      const isDisabled = await disableUser();
      if (isDisabled) {
        console.log('Account disabled successfully');
      } else {
        console.log('Failed to disable account');
      }
      
      setIsDisableAccountModalOpen(false);
      showSuccessModal('Disabled account successfully.');
    } catch (error) {
      console.error('Error disabling account:', error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const isDeleted = await deleteUser();
  
      if (isDeleted) {
        console.log('Account deleted successfully');
        router.push('/goodbye'); // Redirect the user to a goodbye page or home page
        showSuccessModal("hello");
      } else {
        console.error('Failed to delete account');
      }
  
      setIsDeleteAccountModalOpen(false);
      showSuccessModal('Deleted account successfully.');
    } catch (error) {
      console.error('Error deleting account:', error.message);
    }
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
        <div className="mx-auto">
          <h1 className="text-2xl font-bold mb-6 mx-8">Account</h1> 
          <section className="mb-6 mx-8">
            <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
            <div className="bg-white p-6 rounded-lg shadow-md w-full"> 
              <div className="mb-4">
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
            <h2 className="text-xl font-semibold mb-2">Password and Authentication</h2>
            
            <div className="bg-white p-6 w-full mb-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Change Your Password</h3>
              <div className="mb-4 relative">
                <p className="text-medium font-bold mb-2">Current Password:</p>
                <div className="relative">
                  <input 
                    type={showCurrentPassword ? 'text' : 'password'} 
                    placeholder="••••••••••"
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    className={`text-sm ${showValidation && !currentPassword ? 'bg-red-50 border-red-500 text-red-900 placeholder-red-700' : 'text-gray-900 border-gray-300'} font-inter border rounded-md p-2 w-full pr-10`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    {showCurrentPassword ? (
                      <EyeSlashIcon 
                        className="h-5 w-5 text-gray-500 cursor-pointer"
                        onClick={() => togglePasswordVisibility(setShowCurrentPassword)}
                      />
                    ) : (
                      <EyeIcon 
                        className="h-5 w-5 text-gray-500 cursor-pointer"
                        onClick={() => togglePasswordVisibility(setShowCurrentPassword)}
                      />
                    )}
                  </div>
                </div>
                {showValidation && !currentPassword && (
                  <p className="mt-2 text-sm text-red-600">This field cannot be empty.</p>
                )}
              </div>
              <div className="mb-4 relative">
                <p className="text-medium font-bold mb-2">New Password:</p>
                <div className="relative">
                  <input 
                    type={showNewPassword ? 'text' : 'password'} 
                    placeholder="••••••••••"
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className={`text-sm ${showValidation && !newPassword ? 'bg-red-50 border-red-500 text-red-900 placeholder-red-700' : 'text-gray-900 border-gray-300'} font-inter border rounded-md p-2 w-full pr-10`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    {showNewPassword ? (
                      <EyeSlashIcon 
                        className="h-5 w-5 text-gray-500 cursor-pointer"
                        onClick={() => togglePasswordVisibility(setShowNewPassword)}
                      />
                    ) : (
                      <EyeIcon 
                        className="h-5 w-5 text-gray-500 cursor-pointer"
                        onClick={() => togglePasswordVisibility(setShowNewPassword)}
                      />
                    )}
                  </div>
                </div>
                {showValidation && !newPassword && (
                  <p className="mt-2 text-sm text-red-600"><span className="font-medium">Oh, snap!</span> This field cannot be empty.</p>
                )}
              </div>
              <div className="mb-4 relative">
                <p className="text-medium font-bold mb-2">Confirm New Password:</p>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    placeholder="••••••••••"
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className={`text-sm ${showValidation && !confirmPassword ? 'bg-red-50 border-red-500 text-red-900 placeholder-red-700' : 'text-gray-900 border-gray-300'} font-inter border rounded-md p-2 w-full pr-10`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    {showConfirmPassword ? (
                      <EyeSlashIcon 
                        className="h-5 w-5 text-gray-500 cursor-pointer"
                        onClick={() => togglePasswordVisibility(setShowConfirmPassword)}
                      />
                    ) : (
                      <EyeIcon 
                        className="h-5 w-5 text-gray-500 cursor-pointer"
                        onClick={() => togglePasswordVisibility(setShowConfirmPassword)}
                      />
                    )}
                  </div>
                </div>
                {showValidation && !confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500"><span className="font-medium">Oh, snap!</span> This field cannot be empty.</p>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <button className="bg-accent font-roboto text-white w-64 py-2 rounded-md" onClick={changePassword}>Change Password</button>
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

      {/* Email Modal */}
      {isEmailModalOpen && (
        <SmallModalContainer isOpen={isEmailModalOpen} onClose={toggleEmailModal}>
          <div className="flex flex-col items-center justify-center text-left w-full">
            <h2 className="text-lg font-semibold mb-4">Change Your Email</h2>
            <div className="mb-4 w-full">
              <p className="text-medium font-bold mb-2">Old Email:</p>
              <input 
                type="text" 
                value={email} 
                readOnly
                className="text-sm text-gray-900 font-inter border border-gray-300 rounded-md p-2 w-full bg-gray-100 no-focus-outline"
              />
            </div>
            <div className="mb-4 w-full">
              <p className="text-medium font-bold mb-2">New Email:</p>
              <input 
                type="text" 
                value={modalEmail} 
                onChange={(e) => setModalEmail(e.target.value)} 
                className={`text-sm ${emailValidationMessage ? 'bg-red-50 border-red-500 text-red-900 placeholder-red-700' : 'text-gray-900 border-gray-300'} font-inter border rounded-md p-2 w-full`}
              />
              {emailValidationMessage && (
                <p className="mt-2 text-sm text-red-600"> {emailValidationMessage}
                </p>
              )}
            </div>
            <div className="flex justify-end mt-4 w-full">
              <button className="bg-accent font-roboto text-white px-6 py-2 rounded-md w-52" onClick={saveEmail}>Change Email</button>
            </div>
          </div>
        </SmallModalContainer>
      )}

      {is2FAModalOpen && (
        <SmallModalContainer isOpen={is2FAModalOpen} onClose={toggle2FAModal}>
          <div className="flex flex-col items-center justify-center text-center w-full">
            <h2 className="text-lg font-semibold mb-4">Enable 2-Factor Authentication</h2>
            <div className="flex justify-center mb-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <input 
                  key={index}
                  type="text" 
                  maxLength={1}
                  pattern="[0-9]*"
                  className={`text-sm font-inter border rounded-md p-2 w-12 h-12 mx-1 text-center ${
                    otpError ? 'bg-red-50 border-red-500 text-red-900 placeholder-red-700' : 'text-gray-900 border-gray-300'
                  }`}
                  value={otp[index] || ''}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[index] = e.target.value.replace(/[^0-9]/g, '');
                    setOtp(newOtp);
                  }}
                />
              ))}
            </div>
            {otpError && (
              <p className="mt-2 text-sm text-red-600">Invalid OTP. Please try again.</p>
            )}
            <div className="flex justify-center space-x-4 mt-4">
              <button className="bg-accent font-roboto text-white px-6 py-2 rounded-md w-52" onClick={enable2FA}>Send OTP</button>
              <button className="bg-accent font-roboto text-white px-6 py-2 rounded-md w-52" onClick={handleVerifyOTP}>Confirm</button>
            </div>
          </div>
        </SmallModalContainer>
      )}

      {/* Disable Account Modal */}
      {isDisableAccountModalOpen && (
        <SmallModalContainer isOpen={isDisableAccountModalOpen} onClose={toggleDisableAccountModal}>
          <div className="flex flex-col items-center justify-center text-center w-full">
            <h2 className="text-xl text-accent font-bold mb-4">
              {isAccountDisabled ? 'Enable Your Account' : 'Disable Your Account'}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {isAccountDisabled
                ? 'You can enable your account anytime by clicking the button below.'
                : 'You can come back anytime by logging in with your credentials.'}
            </p>
            {!isAccountDisabled && (
              <div className="mb-4 w-full">
                <p className="text-sm font-semibold mb-2">Reason for disabling your account:</p>
                <select className="text-sm text-gray-900 font-inter border border-gray-300 rounded-md p-2 w-full mb-4">
                  <option value="personal">Personal reasons</option>
                  <option value="security">Security concerns</option>
                  <option value="no-longer-needed">No longer needed</option>
                </select>
              </div>
            )}
            <div className="flex justify-center space-x-4 w-full">
              <button className={isAccountDisabled ? "bg-accent font-roboto text-white px-4 py-2 rounded-md w-44" : "bg-cred font-roboto text-white px-4 py-2 rounded-md w-44"} onClick={handleToggleAccountStatus}>
                {isAccountDisabled ? 'Enable Account' : 'Disable Account'}
              </button>
              <button className="bg-gray-400 font-roboto text-white px-4 py-2 rounded-md w-52" onClick={toggleDisableAccountModal}>Cancel</button>
            </div>
          </div>
        </SmallModalContainer>
      )}

      {/* Delete Account Modal */}
      {isDeleteAccountModalOpen && (
        <SmallModalContainer isOpen={isDeleteAccountModalOpen} onClose={toggleDeleteAccountModal}>
          <div className="flex flex-col items-center justify-center text-center w-full">
            <h2 className="text-xl text-accent font-bold mb-4">Are you sure you want to delete your account?</h2>
            <p className="text-sm text-gray-600 mb-4">
              This action cannot be undone.
            </p>
            <div className="mb-4 w-full">
              <p className="text-sm font-semibold mb-2">Reason for deleting your account:</p>
              <select className="text-sm text-gray-900 font-inter border border-gray-300 rounded-md p-2 w-full mb-4">
                <option value="personal">Personal reasons</option>
                <option value="security">Security concerns</option>
                <option value="no-longer-needed">No longer needed</option>
              </select>
            </div>
            <div className="flex justify-center space-x-4 w-full">
              <button className="bg-cred font-roboto text-white px-4 py-2 rounded-md w-52" onClick={handleDeleteAccount}>Delete Account</button>
              <button className="bg-gray-400 font-roboto text-white px-4 py-2 rounded-md w-52" onClick={toggleDeleteAccountModal}>Cancel</button>
            </div>
          </div>
        </SmallModalContainer>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <ModalSuccess message={successMessage} onClose={() => setIsSuccessModalOpen(false)} isOpen={isSuccessModalOpen} />
      )}

    </motion.div>
  );
}
