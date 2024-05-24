import React from 'react';

export default function settings() {
  return (
    <div className="flex">
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Email Address</p>
                  <p className="text-lg text-gray-900">johndoe10@gmail.com</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Edit</button>
              </div>
            </div>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Password and Authentication</h2>
            
            <div className="bg-yellow-100 p-4 rounded-lg shadow-md mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Change Your Password</h3>
              <p className="text-sm text-gray-700 mb-4">
                Regularly change your password to avoid getting compromised! After clicking the button below, a link will be sent to either your SMS or Email. Follow the full directions from there.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Change Password</button>
            </div>
            
            <div className="bg-yellow-100 p-4 rounded-lg shadow-md mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enable 2-Factor Authentication</h3>
              <p className="text-sm text-gray-700 mb-4">
                Protect your account with an extra layer of security. Once configured, you’ll be required to enter your password and complete one additional step (according to your preference: SMS or Email) in order to sign in.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Enable 2-Factor Authentication</button>
            </div>
            
            <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Removal</h3>
              <p className="text-sm text-gray-700 mb-4">
                Disabling your account means you can recover it any time after taking this action. Deleting your account will permanently delete your data from our database.
              </p>
              <div className="flex space-x-4">
                <button className="bg-red-600 text-white px-4 py-2 rounded-md">Disable Account</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Delete Account</button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

