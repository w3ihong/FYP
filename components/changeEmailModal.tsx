import { useState } from 'react';
import { updateEmail } from '@/app/actions';

const ChangeEmailModal = ({ onClose }) => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEmail(currentEmail, newEmail);
    } catch (error) {
      console.error('Error updating email:', error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Change Email</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Current Email:
            <input
              type="email"
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
              placeholder="Enter your current email"
              required
            />
          </label>
          <label>
            New Email:
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter your new email"
              required
            />
          </label>
          <button type="submit" className="change-email-btn">Change Email</button>
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
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          position: relative;
          max-width: 500px;
          width: 100%;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: transparent;
          border: none;
          font-size: 18px;
          cursor: pointer;
        }
        h2 {
          color: #333;
          margin-bottom: 20px;
        }
        form {
          display: flex;
          flex-direction: column;
        }
        label {
          margin-bottom: 10px;
        }
        input {
          margin-top: 5px;
          padding: 10px;
          border: 1px solid lightgrey;
          border-radius: 4px;
        }
        .change-email-btn {
          background-color: blue;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          margin-top: 20px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ChangeEmailModal;
