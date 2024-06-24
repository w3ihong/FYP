"use client";

import React, { useState } from "react";
import ModalContainer from "@/components/modalContainer";
import ModalRemoveConfirmation from "@/components/modalRemoveConfirmation";
import FacebookSDK from './facebook/FacebookSDK';

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
    testAPI: () => void;
  }
}

export default function Index() {
  const [isDraftModalOpen, setDraftModalOpen] = useState(false);
  const [isAccountModalOpen, setAccountModalOpen] = useState(false);
  const [deleteDraftIndex, setDeleteDraftIndex] = useState<number | null>(null);
  const [disconnectAccountIndex, setDisconnectAccountIndex] = useState<number | null>(null);
  const [isConnectSocialModalOpen, setConnectSocialModalOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const handleFBLogin = () => {
    if (window.FB) {
      window.FB.login((response: any) => {
        if (response.authResponse) {
          console.log('Welcome!  Fetching your information.... ');
          window.testAPI();
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      }, { scope: 'public_profile,email' });
    } else {
      console.log('Facebook SDK not loaded yet.');
    }
  };

  const handleLoginSuccess = (response: any) => {
    setUserName(response.name);
  };

  const drafts = [
    { id: 1, name: "John Doe", caption: "hello", lastEdited: "21 October 2023" },
    { id: 2, name: "Draft 2" },
    { id: 3, name: "Draft 3" },
    { id: 4, name: "Draft 4" },
    { id: 5, name: "Draft 5" },
  ];

  const accounts = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Account 2" },
    { id: 3, name: "Account 3" },
    { id: 4, name: "Account 4" },
    { id: 5, name: "Account 5" },
  ];

  const handleDeleteDraft = () => {
    if (deleteDraftIndex !== null) {
      console.log("Deleting draft:", deleteDraftIndex + 1);
      setDeleteDraftIndex(null);
      setDraftModalOpen(false);
    }
  };

  const handleDisconnectAccount = () => {
    if (disconnectAccountIndex !== null) {
      console.log("Disconnecting account:", disconnectAccountIndex + 1);
      setDisconnectAccountIndex(null);
      setAccountModalOpen(false);
    }
  };

  return (
    <div className="flex">
      {/* Include the FacebookSDK component */}
      <FacebookSDK onLoginSuccess={handleLoginSuccess} />

      <div className="flex-1 ml-1">
        <div className="p-6 -mt-4">
          <h1 className="text-2xl font-bold text-accent">Welcome Back, {userName || "Username"}!</h1>
          <p className="text-sm text-gray-600">Feel free to explore around</p>
          <div className="bg-yellow-200 p-4 rounded-lg shadow-md mt-4">
            <h2 className="text-xl font-bold text-accent">Account Overview</h2>
          </div>
          <div className="flex flex-row gap-6 mt-4">
            <div className="flex-1 bg-yellow-200 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-accent">Your Drafts</h3>
                <button
                  className="bg-white text-accent px-3 py-1 rounded-md border border-accent"
                  onClick={() => setDraftModalOpen(true)}
                >
                  Manage Your Drafts
                </button>
              </div>
              <p className="text-sm text-gray-600">Recently Edited</p>
              <div className="overflow-y-auto max-h-[400px] mt-3 space-y-3 pb-2">
                {drafts.map((draft) => (
                  <div key={draft.id} className="bg-white p-3 rounded-md shadow-md flex items-center">
                    <img src="/sky.jpeg" alt="Draft" className="w-16 h-16 object-cover rounded-md mr-4" />
                    <div>
                      <div className="text-sm font-bold">{draft.name}</div>
                      <div className="text-sm text-gray-600">{draft.caption}</div>
                      <div className="text-sm text-gray-400">Last edited: {draft.lastEdited}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-yellow-200 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-accent">Social Accounts</h3>
                <button
                  className="bg-white text-accent px-3 py-1 rounded-md border border-accent"
                  onClick={() => setAccountModalOpen(true)}
                >
                  Manage Accounts
                </button>
              </div>
              <p className="text-sm text-gray-600">Recently Added</p>
              <div className="overflow-y-auto max-h-[400px] mt-3 space-y-3 pb-2">
                {accounts.map((account) => (
                  <div key={account.id} className="bg-white rounded-md shadow-md p-3 mb-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-bold">{account.name}</div>
                      <button
                        className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700"
                        onClick={() => setDisconnectAccountIndex(account.id)}
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add a status element */}
      <div id="status" className="hidden"></div>

      {/* Manage Draft Modal */}
      <ModalContainer isOpen={isDraftModalOpen} onClose={() => setDraftModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-2 mt-8">Manage Your Drafts</h2>
        <div className="mb-6">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
            placeholder="Search drafts..."
          />
        </div>

        <div className="space-y-4 max-h-[320px] overflow-y-auto pb-4">
          {drafts.map((draft, index) => (
            <div key={draft.id} className="bg-white p-3 rounded-md shadow-md flex justify-between items-center">
              <div className="flex items-center">
                <img src="/sky.jpeg" alt="Draft" className="w-16 h-16 object-cover rounded-md mr-4" />
                <div>
                  <div className="text-sm font-bold">{draft.name}</div>
                  <div className="text-sm text-gray-600">{draft.caption}</div>
                  <div className="text-sm text-gray-400">Last edited: {draft.lastEdited}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  className="bg-gray-400 text-white px-6 py-1 rounded-lg hover:bg-gray-500"
                  onClick={() => console.log("Edit draft", index + 1)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700"
                  onClick={() => setDeleteDraftIndex(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button className="bg-accent text-white px-20 py-2 rounded-lg hover:bg-blue-900">
            Make a Draft
          </button>
        </div>

        <ModalRemoveConfirmation
          isOpen={deleteDraftIndex !== null}
          onClose={() => setDeleteDraftIndex(null)}
          message="Are you sure you want to delete this draft?"
          onConfirm={handleDeleteDraft}
        />
      </ModalContainer>

      {/* Manage Account Modal */}
      <ModalContainer isOpen={isAccountModalOpen} onClose={() => setAccountModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-2 mt-8">Manage Your Accounts</h2>
        <div className="mb-6">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
            placeholder="Search accounts..."
          />
        </div>

        <div className="space-y-4 max-h-[320px] overflow-y-auto pb-4">
          {accounts.map((account) => (
            <div key={account.id} className="bg-white rounded-md shadow-md p-3 mb-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-bold">{account.name}</div>
                <button
                  className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700"
                  onClick={() => setDisconnectAccountIndex(account.id)}
                >
                  Disconnect
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-blue-900"
            onClick={() => setConnectSocialModalOpen(true)}
          >
            Connect To More Social Media Accounts
          </button>
        </div>
      </ModalContainer>

      <ModalRemoveConfirmation
        isOpen={disconnectAccountIndex !== null}
        onClose={() => setDisconnectAccountIndex(null)}
        message="Are you sure you want to disconnect this social media account?"
        onConfirm={handleDisconnectAccount}
      />

      {/* Modal for Connect Social Media Account */}
      <ModalContainer isOpen={isConnectSocialModalOpen} onClose={() => setConnectSocialModalOpen(false)}>
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <h2 className="text-2xl font-bold mb-2">Connect To More Social Media Accounts</h2>
          <button className="w-80 px-2 py-2 bg-accent text-white text-base font-medium rounded-md shadow-sm flex items-center justify-center hover:bg-blue-900">
            <img src="/Instagram.png" alt="Instagram" className="w-6 h-6 mr-2" /> Instagram
          </button>
          <button className="w-80 px-2 py-2 bg-accent text-white text-base font-medium rounded-md shadow-sm flex items-center justify-center hover:bg-blue-900">
            <img src="/Twitter.png" alt="Twitter" className="w-6 h-6 mr-2" /> X
          </button>
          <button
            onClick={handleFBLogin}
            className="w-80 px-2 py-2 bg-accent text-white text-base font-medium rounded-md shadow-sm flex items-center justify-center hover:bg-blue-900"
          >
            <img src="/Facebook.png" alt="Facebook" className="w-6 h-6 mr-2" /> Facebook
          </button>
        </div>
      </ModalContainer>
    </div>
  );
}