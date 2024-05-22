import React from 'react';
import Link from 'next/link';
import Sidebar, { SidebarItem } from '@/components/sidebar';
import { BarChart3, LifeBuoy, Calendar, LogOut, Users, SquarePlus, LayoutDashboard, Settings, Brain } from 'lucide-react';

export default function Home() {

  return (
    <div>

      <div className="flex-1 w-full flex flex-col gap-6 p-6">
        <h1 className="text-2xl font-bold text-blue-900">Welcome Back, Username!</h1>
        <p className="text-sm text-gray-600">Feel free to explore around</p>
        <div className="bg-yellow-200 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-blue-900">Account Overview</h2>
        </div>
        <div className="flex flex-row gap-6 mt-4">
          <div className="flex-1 bg-yellow-200 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-blue-900">Your Drafts</h3>
              <button className="bg-white text-blue-600 px-3 py-1 rounded-md border border-blue-600">Manage Your Drafts</button>
            </div>
            <p className="text-sm text-gray-600 mt-2">Recently Edited</p>
            <div className="bg-white p-3 mt-3 rounded-md shadow-md">
              <img src="/path/to/image.jpg" alt="Draft" className="w-full h-24 object-cover rounded-md" />
              <p className="mt-2 text-sm text-gray-700">John Doe: This is a draft post</p>
            </div>
            <div className="bg-white p-3 mt-3 rounded-md shadow-md">Draft 2</div>
            <div className="bg-white p-3 mt-3 rounded-md shadow-md">Draft 3</div>
            <div className="bg-white p-3 mt-3 rounded-md shadow-md">Draft 4</div>
          </div>
          <div className="flex-1 bg-yellow-200 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-blue-900">Social Accounts</h3>
              <button className="bg-white text-blue-600 px-3 py-1 rounded-md border border-blue-600">Manage Accounts</button>
            </div>
            <p className="text-sm text-gray-600 mt-2">Recently Added</p>
            <div className="bg-white p-3 mt-3 rounded-md shadow-md">John Doe</div>
            <div className="bg-white p-3 mt-3 rounded-md shadow-md">Account 2</div>
            <div className="bg-white p-3 mt-3 rounded-md shadow-md">Account 3</div>
            <div className="bg-white p-3 mt-3 rounded-md shadow-md">Account 4</div>
          </div>
        </div>
      </div>
    </div>
  );
}
