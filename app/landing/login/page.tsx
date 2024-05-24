"use client"

import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { login } from "../actions";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const router = useRouter();

  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email address');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  }

  function validatePassword(password: string): boolean {
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>): void {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>): void {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  }

  async function handleLogin(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      const formData = new FormData(e.currentTarget);

      try {
        await login(formData);
      } catch (error) {
        console.error('Login failed', error);
      }
    } else {
      console.log('Login validation failed');
    }
  }

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

      {/* Log In Form */}
      <div className="w-full md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold font-raleway leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
            Log in to your account
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
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
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 ${passwordError ? 'border-red-500' : ''}`}
                required
              />
              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="remember" className="text-gray-500">Remember me</label>
                </div>
              </div>
              <a href="#" className="text-sm font-medium text-primary-600 hover:underline">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-accent hover:bg-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Sign In
            </button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
              Don't have an account?{' '}
              <Link href="/landing/register">
                <span className="font-medium text-primary-600 hover:underline cursor-pointer">Register Here</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
