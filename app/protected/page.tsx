"use client";
import React, { useState } from 'react';
import Modal from '@/components/Modal';
import ModalSocial from '@/components/ModalSocial';

export default function Index() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAccountModalOpen, setAccountModalOpen] = useState(false);

  const canInitSupabaseClient = () => {
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex">
      <div className="flex-1 ml-20 transition-all">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-900">Welcome Back, Username!</h1>
          <p className="text-sm text-gray-600">Feel free to explore around</p>
          <div className="bg-yellow-200 p-4 rounded-lg shadow-md mt-4">
            <h2 className="text-xl font-bold text-blue-900">Account Overview</h2>
          </div>
          <div className="flex flex-row gap-6 mt-4">
            <div className="flex-1 bg-yellow-200 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-blue-900">Your Drafts</h3>
                <button
                  className="bg-white text-blue-600 px-3 py-1 rounded-md border border-blue-600"
                  onClick={() => setModalOpen(true)}
                >
                  Manage Your Drafts
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">Recently Edited</p>
              <div className="bg-white p-3 mt-3 rounded-md shadow-md">
                <img src="/sky.jpeg" alt="Draft" className="w-full h-24 object-cover rounded-md" />
                <p className="mt-2 text-sm text-gray-700">John Doe: This is a draft post</p>
              </div>
              <div className="bg-white p-3 mt-3 rounded-md shadow-md">Draft 2</div>
              <div className="bg-white p-3 mt-3 rounded-md shadow-md">Draft 3</div>
              <div className="bg-white p-3 mt-3 rounded-md shadow-md">Draft 4</div>
            </div>
            <div className="flex-1 bg-yellow-200 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-blue-900">Social Accounts</h3>
                <button
                  className="bg-white text-blue-600 px-3 py-1 rounded-md border border-blue-600"
                  onClick={() => setAccountModalOpen(true)}
                >
                  Manage Accounts
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">Recently Added</p>
              <div className="bg-white p-3 mt-3 rounded-md shadow-md">John Doe</div>
              <div className="bg-white p-3 mt-3 rounded-md shadow-md">Account 2</div>
              <div className="bg-white p-3 mt-3 rounded-md shadow-md">Account 3</div>
              <div className="bg-white p-3 mt-3 rounded-md shadow-md">Account 4</div>
            </div>
          </div>
          <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs mt-4">
            <p>
              Powered by{' '}
              <a
                href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                target="_blank"
                className="font-bold hover:underline"
                rel="noreferrer"
              >
                Supabase
              </a>
            </p>
          </footer>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      <ModalSocial isOpen={isAccountModalOpen} onClose={() => setAccountModalOpen(false)} />

    </div>
  );
}