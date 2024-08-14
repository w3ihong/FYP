'use client'
import { FormEvent, useState } from 'react';
import { forgotPassword } from '@/app/actions';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Forgot Your Password?
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                Enter your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                placeholder="name@company.com"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-accent hover:bg-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Reset Password
            </button>
            {message && <p className="text-sm text-red-500">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
