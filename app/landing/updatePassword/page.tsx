'use client'
import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleUpdatePassword() {
    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password updated successfully!');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
            Update Your Password
          </h1>
          <div className="space-y-4 md:space-y-6">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
            />
            <button
              onClick={handleUpdatePassword}
              className="w-full text-white bg-accent hover:bg-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Update Password
            </button>
            {message && (
              <p className={`text-sm text-${message.includes('successfully') ? 'green' : 'red'}-500`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
