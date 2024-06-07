'use client';
"use client";

import React, { ReactNode, createContext, useContext, useState } from 'react';
import { ArrowLeft, LogOut, User, CreditCard } from 'lucide-react';
import Link from "next/link";

// Sidebar context to manage the expanded state
const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

// Props for SidebarItem component
interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  link: string;
}

// SidebarItem component
export function SidebarItem({ icon, text, active, alert, link }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);

  const item = (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
        active
          ? 'bg-gradient-to-tr from-purple-500 to-purple-500 text-indigo-800'
          : 'hover:bg-purple-500 text-gray-699'
      }`}
    >
      <span className="text-white">{icon}</span>
      <span className={`overflow-hidden transition-all ${expanded ? 'w-52 ml-3 text-white' : 'w-0 text-white'}`}>
        {text}
      </span>
      {alert && (
        <div className={`absolute right-2 w-2 h-2 rounded-full bg-indigo-400 ${expanded ? 'top-2' : ''}`}></div>
      )}
      {active && <span className="ml-auto text-green-500"></span>}
    </li>
  );

  return (
    <Link href={link}>
      {item}
    </Link>
  );
}

// Sidebar component
export default function Sidebar() {
  const [expanded, setExpanded] = useState(false); // State to manage sidebar expansion

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-accent transition-all duration-300 ease-in-out ${expanded ? 'w-60' : 'w-16'}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{ zIndex: 1000 }}
    >
      <nav className="h-full flex flex-col justify-between shadow-sm">
        <div className="flex-col h-full">
          <Link href="/protected">
            <div className="flex items-center p-3 pb-2 cursor-pointer mb-4 ml-1 mt-2">
              <span className="text-white"><ArrowLeft size={24} /></span>
              <span className={`ml-3 text-white font-semibold transition-opacity duration-300 ease-in-out ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                Settings
              </span>
            </div>
          </Link>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3 overflow-y-auto">
              <hr className="border-t border-gray-200 my-2" />
              <SidebarItem icon={<User size={20} />} text="Account" active link="/settings/account" />
              <SidebarItem icon={<CreditCard size={20} />} text="Billing" link="/settings/billing" />
            </ul>
          </SidebarContext.Provider>
        </div>

        <div className="p-3">
          <SidebarContext.Provider value={{ expanded }}>
            <SidebarItem icon={<LogOut size={20} />} text="Log out" link="/landing" />
          </SidebarContext.Provider>
        </div>
      </nav>
    </aside>
  );
}
