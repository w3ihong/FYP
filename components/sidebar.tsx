'use client';
import React, { ReactNode, createContext, useContext, useState } from 'react';
import { ChevronFirst, ChevronLast } from 'lucide-react';

const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

interface SidebarProps {
  children: React.ReactNode;
}

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
          ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
          : 'hover:bg-indigo-50 text-gray-699'
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

  return link ? <a href={link}>{item}</a> : item;
}

export default function Sidebar({ children }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col border-r shadow-sm bg-accent" >
        <div className="p-4 pb-2 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/ESLogo.png"
              className={`overflow-hidden transition-all ${expanded ? "w-8 h-8" : "w-0"}`}
              alt="Logo"
            />
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
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3 items-center">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt="User Avatar"
            className="w-10 h-10 rounded-md"
          />
          <div className={`flex items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
            <div className="leading-4">
              <h4 className="font-semibold text-white">John Doe</h4>
              <span className="text-xs text-gray-300">johndoe@gmail.com</span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}
