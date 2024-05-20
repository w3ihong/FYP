"use client"
import Link from "next/link";
import { useState } from "react";
import { signup } from "../actions";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    function validateEmail (email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Invalid email address');
        } else {
            setEmailError('');
        }
    };

    function validatePassword (password : string){
        const passwordRegex = /^.{8,}$/;
        if (!passwordRegex.test(password)) {
            setPasswordError('Password must have at least 8 characters');
        } else {
            setPasswordError('');
        }
    };

    function validateConfirmPassword (password : string, confirmPassword :string) {
        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
        } else {
            setConfirmPasswordError('');
        }
    };

    function handleEmailChange (e : any) {
        const newEmail = e.target.value;
        setEmail(newEmail);
        validateEmail(newEmail);
    };

    function handlePasswordChange (e : any) {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
        validateConfirmPassword(newPassword, confirmPassword);
    };

    function handleConfirmPasswordChange (e : any) {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        validateConfirmPassword(password, newConfirmPassword);
    };

    function signup (e : any) {
        e.preventDefault();
        if (emailError === '' && passwordError === '' && confirmPasswordError === '') {
            signup({email, password});
        }
    }

  return (
    <div>
        {/* header */}
        <div className="bg-accent min-h-14 w-full p-4">
            <Link href="/landing">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 stroke-background fill-background">
                    <path fill-rule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                </svg>
            </Link>
        </div>
        {/* main */}
        <div className="flex flex-col items-center justify-center ">
            <h1 className="text-2xl font-bold text-accent m-10">Set up your account</h1>
            <form className="flex flex-col items-center justify-center">

                <p className="font-bold self-left w-80">Email Address</p>
                <input type="text" placeholder="Email" 
                value={email} onChange={handleEmailChange}
                className="w-80 h-10 p-2 border border-accent color-primary rectangle-generic" />
                <p className="text-red-500 text-xs mb-3 h-2 w-80">{emailError}</p>

                <p className="font-bold w-80">Password</p>
                <input type="password" placeholder="Password" 
                value={password} onChange={handlePasswordChange}
                className="w-80 h-10 p-2 border border-accent rectangle-generic" />
                <p className="text-red-500 text-xs mb-3 h-2 w-80">{passwordError}</p>

                <p className="font-bold w-80">Confirm Password</p>
                <input type="password" placeholder="Confirm Password" 
                value={confirmPassword} onChange={handleConfirmPasswordChange}
                className="w-80 h-10 p-2 border border-accent rectangle-generic" />
                <p className="text-red-500 text-xs mb-3 h-2 w-80">{confirmPasswordError}</p>

                <button className="w-80 h-10 p-2 mt-16 bg-accent text-primary rectangle-generic" formAction={signup}>Sign up</button>
            </form>
            <p className="mt-2 text-xs">Already have an account? <Link href="/landing" className="underline">Log in</Link></p>
        </div>
    </div>
  );
}