'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  async function handleForgotPassword() {
    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the password reset link.');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
            Forgot Your Password?
          </h1>
          <div className="space-y-4 md:space-y-6">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
            />
            <button
              onClick={handleForgotPassword}
              className="w-full text-white bg-accent hover:bg-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Send Reset Link
            </button>
            {message && (
              <p className={`text-sm text-${message.includes('Check') ? 'green' : 'red'}-500`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}