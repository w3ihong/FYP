'use client';
import React, { ReactNode, createContext, useContext, useState } from 'react';
import { ArrowLeft, LogOut, User, CreditCard, Contact } from 'lucide-react';
import Link from "next/link";
import { logout } from '@/app/actions';

// Sidebar context to manage the expanded state
const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

// Props for SidebarItem component
interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  link?: string;
  onClick?: () => void;
}

// SidebarItem component
export function SidebarItem({ icon, text, link, onClick }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);

  const content = (
    <div
      className={`relative flex items-center p-2 my-1 font-medium rounded-md cursor-pointer transition-colors hover:bg-blue-700 text-gray-699`}
      onClick={onClick}
    >
      <span className="text-white">{icon}</span>
      <span
        className={`ml-3 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
          expanded ? 'w-auto opacity-100 text-white' : 'w-0 opacity-0'
        }`}
      >
        {text}
      </span>
    </div>
  );

  return link ? <Link href={link}>{content}</Link> : content;
}

// SettingsSidebar component
export default function SettingsSidebar() {
  const [expanded, setExpanded] = useState(false);

  // Logout function
  const handleLogout = () => {
    logout();
  };

  return (
    <aside
      className={`fixed top-0 h-screen bg-accent transition-all duration-300 ease-in-out ${expanded ? 'w-60' : 'w-16'}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{ zIndex: 1000 }}
    >
      <nav className="flex flex-col justify-between h-full border-r shadow-sm">
        <div className="flex-col">
          <Link href="/protected">
            <div className="flex items-center p-3 pb-2 cursor-pointer mb-4 ml-1 mt-2">
              <span className="text-white"><ArrowLeft size={24} /></span>
              <span
                className={`ml-3 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
                  expanded ? 'w-auto opacity-100 text-white' : 'w-0 opacity-0'
                }`}
              >
                Settings
              </span>
            </div>
          </Link>

          <SidebarContext.Provider value={{ expanded }}>
            <div className="flex flex-col px-3 overflow-y-auto">
              <SidebarItem icon={<User size={20} />} text="Account" link="/settings" />
              <SidebarItem icon={<Contact size={20} />} text="Profile" link="/settings/profile" />
              <SidebarItem icon={<CreditCard size={20} />} text="Billing" link="/settings/billing" />
              <div className='my-4' />  {/* Spacer Div */}
            </div>
          </SidebarContext.Provider>
        </div>

        <div className='flex flex-col px-3 py-2'>
          <SidebarContext.Provider value={{ expanded }}>
            <SidebarItem
              icon={<LogOut size={20} />}
              text="Log out"
              link="/landing"
              onClick={handleLogout}
            />
          </SidebarContext.Provider>
        </div>
      </nav>
    </aside>
  );
}
