import React, { useState } from 'react';
import ModalSuccess from './modalSuccess';
import ModalBackdrop from './modalBackdrop';

const RemoveConfirmationModal = ({ isOpen, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-96" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 text-2xl">&times;</button>
        <div className="flex items-center justify-center text-6xl text-red-500 mb-6">
          <span>&#10060;</span>
        </div>
        <h2 className="text-2xl font-bold mb-4">Remove This Draft?</h2>
        <p className="text-center text-gray-600 mb-8">If you remove this draft, you cannot retrieve it back later.</p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Remove
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
};

const ModalRemove = ({ isOpen, onClose }) => {
  const [isRemoveModalOpen, setRemoveModalOpen] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);

  const handleConfirmRemove = () => {
    setRemoveModalOpen(false);
    setSuccessModalOpen(true);
  };

  const closeModals = () => {
    setRemoveModalOpen(false);
    setSuccessModalOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-96">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 text-2xl">&times;</button>
        <div className="flex items-center justify-center text-6xl text-red-500 mb-6">
          <span>&#10060;</span>
        </div>
        <h2 className="text-2xl font-bold mb-4">Remove This Draft?</h2>
        <p className="text-center text-gray-600 mb-8">If you remove this draft, you cannot retrieve it back later.</p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={() => setRemoveModalOpen(true)}
            className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Remove
          </button>
        </div>
      </div>
      <RemoveConfirmationModal 
        isOpen={isRemoveModalOpen} 
        onConfirm={handleConfirmRemove} 
        onClose={() => setRemoveModalOpen(false)} 
      />
      <ModalSuccess 
        isOpen={isSuccessModalOpen} 
        message="Draft removed successfully!" 
        onClose={closeModals} 
      />
    </div>
  );
};

export default ModalRemove;
