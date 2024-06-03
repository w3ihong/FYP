import React, { useState } from 'react';
import ModalRemove from './ModalRemove';
import RemoveConfirmationModal from './RemoveConfirmationModal';

const Modal = ({ isOpen, onClose }) => {
  const [isRemoveModalOpen, setRemoveModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
        <div className="relative bg-white rounded-lg shadow-lg" style={{ width: '973px', height: '724px' }}>
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 text-xl">&times;</button>
          <div className="p-6">
            <input 
              type="text" 
              placeholder="Type to search..." 
              className="w-full px-3 py-2 border rounded-md mb-4"
              style={{ width: '844px', height: '50px' }}
            />
            <div className="bg-gray-100 p-4 rounded-md shadow-sm flex items-center mb-4">
              <img src="/sky.jpeg" alt="Draft" className="w-15 h-12 object-cover rounded-md mr-4" />
              <div className="flex-1">  
                <p className="text-sm font-bold">John Doe</p>
                <p className="text-xs text-gray-600">The Blue Sky: What a beautiful view! #sky #blue #pretty</p>
              </div>
              <button className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2">Edit</button>
              <button 
                className="bg-red-500 text-white px-3 py-1 rounded-md" 
                onClick={() => setRemoveModalOpen(true)}
              >
                Remove
              </button>
            </div>
            {/* Add more account containers as needed */}
            <div className="bg-gray-100 p-4 rounded-md shadow-sm flex items-center mb-4">
              <div className="w-15 h-12 mr-4"></div> {/* Placeholder for image */}
              <div className="flex-1">
                <p className="text-sm font-bold">Jane Doe</p>
                <p className="text-xs text-gray-600">Sample text for another account</p>
              </div>
              <button className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2">Edit</button>
              <button 
                className="bg-red-500 text-white px-3 py-1 rounded-md" 
                onClick={() => setRemoveModalOpen(true)}
              >
                Remove
              </button>
            </div>
            {/* Add more containers if needed */}
            <div className="w-full mt-4">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Make a Draft
              </button>
            </div>
          </div>
        </div>
      </div>
      <ModalRemove isOpen={isRemoveModalOpen} onClose={() => setRemoveModalOpen(false)} />

    </>
  );
};

export default Modal;
