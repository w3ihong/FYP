import React, { useState } from 'react';
import { sendOTP } from '@/app/actions'; // Import your OTP sending function

const VerificationCodeModal = ({ onClose }) => {
  const [email, setEmail] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call your OTP sending function here
      await sendOTP(email);
      // You might want to add some UI feedback here to inform the user that OTP is sent successfully
      console.log('OTP sent successfully to:', email);
    } catch (error) {
      console.error('Error sending OTP:', error.message);
      // You might want to add some UI feedback here to inform the user about the error
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Enter your Email Address</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit" className="confirm-btn">Send OTP</button>
        </form>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          position: relative;
          max-width: 400px;
          width: 100%;
          text-align: center;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          left: 10px;
          background: transparent;
          border: none;
          font-size: 18px;
          cursor: pointer;
        }
        h2 {
          color: #333;
          margin-bottom: 20px;
        }
        .input-wrapper {
          margin-bottom: 20px;
        }
        input[type='email'] {
          width: calc(100% - 40px);
          height: 40px;
          padding: 0 10px;
          font-size: 16px;
          border: 1px solid lightgrey;
          border-radius: 5px;
          outline: none;
        }
        .confirm-btn {
          background-color: #002244;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default VerificationCodeModal;
