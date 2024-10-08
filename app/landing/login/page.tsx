"use client"

import Link from "next/link";
import { useState, FormEvent } from "react";
import { login } from "../../actions";
import { motion } from 'framer-motion';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message: string };
}) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    async function handleLogin(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        try {
            await login(formData);
        } catch (error) {
            console.error('Login failed', error);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0 }}
            className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
        >
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
                                className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 `}
                                placeholder="name@company.com"
                                required
                            />
                        </div>

                        <div className="relative">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                                Password
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pr-10`} // Adjust padding-right
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-2 flex items-center"
                                >
                                    {isPasswordVisible ? (
                                        <EyeOffIcon className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="h-4 w-full">
                            {searchParams.message && (
                                <p className="text-sm text-red-500">{searchParams.message}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-start">
                                <div className="flex items-center h-5"></div>
                            </div>
                            <a href="/landing/forgetPassword" className="text-sm font-medium text-primary-600 hover:underline">Forgot password?</a>
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
        </motion.div>
    );
}
