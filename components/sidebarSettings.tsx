'use client';
import React, { ReactNode, createContext, useContext, useState } from 'react';
import { ChevronFirst, ChevronLast, LogOut, User, CreditCard } from 'lucide-react';
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
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className={`h-screen fixed top-0 ${expanded ? 'w-64' : 'w-20'} transition-all`} style={{ backgroundColor: '#133048' }}>
      <nav className="h-full flex flex-col border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <div className="flex items-center">
            {/* EchoSphere logo removed */}
            <span className={`ml-3 text-white font-semibold transition-all ${expanded ? 'block' : 'hidden'}`}>
              EchoSphere
            </span>
          </div>
          <button
            onClick={() => setExpanded(curr => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            <hr className="border-t border-gray-200 my-2" />
            <div style={{ height: '50px' }} />
            <SidebarItem icon={<User size={20} />} text="Account" link="/protected/team" />
            <SidebarItem icon={<CreditCard size={20} />} text="Billing" link="/protected/settings" />
            <div style={{ height: '620px' }} />
            <SidebarItem icon={<LogOut size={20} />} text="Logout" link="/app/logout/page.tsx" />
          </ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3 items-center">
          {/* John Doe details removed */}
        </div>
      </nav>
    </aside>
  );
}
