"use client";
import React, { FormEvent, useState } from 'react';
import { submitReport } from '../../actions';
import ModalSuccess from '@/components/modalSuccess';

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);

    try {
      const reportId = await submitReport(formData); // Get the report ID from the backend
      setSuccess(`Case ID ${reportId} created!`); // Display the report ID
      setModalOpen(true);
    } catch (err) {
      setError('Failed to submit your amessage. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Contact Customer Support</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="name">
              Name:
            </label>
            <input style={styles.input} type="text" id="name" name="name" required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="email">
              Email:
            </label>
            <input style={styles.input} type="email" id="email" name="email" required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="subject">
              Subject:
            </label>
            <input style={styles.input} type="text" id="subject" name="subject" required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="message">
              Message:
            </label>
            <textarea style={styles.textarea} id="message" name="message" required></textarea>
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
      <ModalSuccess isOpen={modalOpen} message={success ?? ''} onClose={handleCloseModal} />
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#FFF3DC',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFAF0',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '500px',
    border: '1px solid #E6E6E6',
  },
  title: {
    marginBottom: '1rem',
    color: '#1D2D64',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
  inputGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '16px',
    color: '#1D2D64',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '0.5rem',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  button: {
    backgroundColor: '#1D2D64',
    color: 'white',
    padding: '0.75rem',
    fontSize: '16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '1rem',
    width: '100px',
    alignSelf: 'flex-end',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  error: {
    color: 'red',
    marginTop: '1rem',
    textAlign: 'center' as 'center',
  },
};

export default Contact;
