'use client';
import React, { ReactNode, createContext, useContext, useState } from 'react';
import { LogOut, User, CreditCard, ArrowLeft } from 'lucide-react';
import Link from "next/link";

const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  link?: string;
}

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

  return link ? (
    <Link href={link}>
      {item}
    </Link>
  ) : (
    <>{item}</>
  );
}

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={`fixed top-0 h-screen transition-all ${expanded ? 'w-64' : 'w-20'}`}
      style={{ backgroundColor: '#133048' }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <nav className="h-full flex flex-col justify-between border-r shadow-sm">
        <div>
          <div className="p-4 pb-2 flex items-center">
            <div className="flex items-center">
              <Link href="/landing">
                <button className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
                  <ArrowLeft className="text-gray-800" />
                </button>
              </Link>
              <span className={`ml-3 text-white font-semibold transition-all ${expanded ? 'block' : 'hidden'}`}>
                {/* EchoSphere */}
              </span>
            </div>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3 overflow-y-auto">
              <hr className="border-t border-gray-200 my-2" />
              <SidebarItem icon={<User size={20} />} text="Account" active link="/protected/settings" />
              <SidebarItem icon={<CreditCard size={20} />} text="Billing" link="/landing/billing" />
            </ul>
          </SidebarContext.Provider>
        </div>

        <div className="p-3">
          <SidebarItem icon={<LogOut size={20} />} text="Logout" link="/landing/register" />
        </div>
      </nav>
    </aside>
  );
}
