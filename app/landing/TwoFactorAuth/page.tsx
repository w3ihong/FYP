"use client";
import React, { useState, useRef, useEffect } from 'react';
import { sendOTP, verifyOTP } from '@/app/actions';
import { getEmail } from '@/app/actions';
import { redirect } from 'next/navigation';

const TwoFactorAuth: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [email, setEmail] = useState<string>('');
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    async function fetchEmail() {
      try {
        const fetchedEmail = await getEmail(); // Assuming getEmail is a function to fetch email
        setEmail(fetchedEmail!);
      } catch (error) {
        console.error('Error fetching email:', error);
      }
    }
    fetchEmail();
  }, []);

  useEffect(() => {
    // Send OTP only when email changes and it's not empty
    if (email && email !== '') {
      sendOTP(email);
    }
  }, [email]);

  const handleChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input field if field isn't empty
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const otpCode = otp.join('');
    console.log('Entered OTP:', otpCode);

    // Verify OTP
    const verificationResult = await verifyOTP(email, otpCode);

    if (verificationResult == true) {
      console.log('OTP Verified Successfully');
      // Redirect to protected page if OTP is correct
    } else {
      console.log('OTP Verification Failed:', verificationResult);
      // Handle OTP verification failure (e.g., show error message)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-12 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 font-raleway">Enter the 6 digit OTP sent to your verified email :</h2>
        <div className="flex justify-between mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-16 h-16 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          ))}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-blue-800"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

export default TwoFactorAuth;

