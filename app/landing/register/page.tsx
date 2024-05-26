"use client"

import Link from "next/link";
import { useState } from "react";
import { signup } from "../../actions";
import Modal from "@/components/modalSuccess";
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    function validateEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Invalid email address');
            return false;
        } else {
            setEmailError('');
            return true;
        }
    };

    function validatePassword(password: string) {
        const passwordRegex = /^.{8,}$/;
        if (!passwordRegex.test(password)) {
            setPasswordError('Password must have at least 8 characters');
            return false;
        } else {
            setPasswordError('');
            return true;
        }
    };

    function validateConfirmPassword(password: string, confirmPassword: string) {
        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            return false;
        } else {
            setConfirmPasswordError('');
            return true;
        }
    };

    function handleEmailChange(e: any) {
        const newEmail = e.target.value;
        setEmail(newEmail);
        validateEmail(newEmail);
    };

    function handlePasswordChange(e: any) {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
        validateConfirmPassword(newPassword, confirmPassword);
    };

    function handleConfirmPasswordChange(e: any) {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        validateConfirmPassword(password, newConfirmPassword);
    };

    async function handleSignup(e: any) {
        e.preventDefault();
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);
        const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);

        if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
            // commented out as theres a limit to the email signup in supabase
            const success =  await signup( email, password );
            if (true) {
                setShowModal(true);
            }
        } else {
            console.log('Sign up failed');
        }
    };

    function handleModalClose() {
        setShowModal(false);
        router.push('/landing')
    };

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

        {/* Arrow icon */}
        <div className="absolute top-0 left-0 p-4">
          <Link href="/landing">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-900"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H6M12 5l-7 7 7 7" />
            </svg>
          </Link>
        </div>

        {/* Sign Up Form */}
        <div className="w-full md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold font-raleway leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSignup}>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 ${emailError ? 'border-red-500' : ''}`}
                  placeholder="name@company.com"
                  required
                />
                {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${passwordError ? 'border-red-500' : ''}`}
                  required
                />
                {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
              </div>

              <div>
                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="••••••••"
                  className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${confirmPasswordError ? 'border-red-500' : ''}`}
                  required
                />
                {confirmPasswordError && <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>}
              </div>
            
            {/* Checkbox */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50"
                    required
                  />
                </div>

            {/* Terms and Services */}
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-light text-gray-500">
                    I accept the <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Terms and Conditions</a>
                  </label>
                </div>

              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full text-white bg-accent hover:bg-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                Create an account
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                Already have an account?{' '}
                <Link href="/landing/login">
                  <span className="font-medium text-primary-600 hover:underline cursor-pointer">Login Here</span>
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Modal */}
        {showModal && createPortal(
        <Modal message="Sign up successful! Please check your email to continue." onClose={handleModalClose} />,
        document.body
      )}

      </div>
    );
}

