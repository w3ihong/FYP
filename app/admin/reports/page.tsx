import React from 'react';

export default function adminReports() {
  return (
    <main className="flex-1 max-w-full p-8">
      <h1 className="text-2xl font-bold mb-6 -mt-4">Users Reports</h1>
      <div className="bg-yellow-200 rounded-lg shadow-md p-8 max-h-[80vh] overflow-auto">
        <div className="mb-6">
          <input 
            type="text" 
            className="w-full p-3 pr-5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500" 
            placeholder="Search users..."
          />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
              <div>User {index + 1}</div>
              <button className="bg-gray-400 text-white px-10 py-1 rounded-lg hover:bg-gray-500">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
