"use client";
import React, { ReactNode, createContext, useContext, useState } from 'react';
import { BarChart3, Calendar, LogOut, Users, SquarePlus, LayoutDashboard, Settings, Brain } from 'lucide-react';
import Link from "next/link";

// Sidebar context to manage the expanded state
const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

// Props for SidebarItem component
interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  link: string;
}

// SidebarItem component
export function SidebarItem({ icon, text, link }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);

  return (
    <Link href={link}>
      <div
        className={`relative flex items-center p-2 my-1 font-medium rounded-md cursor-pointer transition-colors hover:bg-purple-500 text-gray-699 `}
      >
        <span className="text-white">{icon}</span>
        <span className={`overflow-hidden transition-all ${expanded ? 'w-52 ml-3 text-white' : 'w-0 text-white'}`}>
          {text}
        </span>
      </div>
    </Link>
  );
}

// Sidebar component
export default function Sidebar() {
  const [expanded, setExpanded] = useState(false); // State to manage sidebar expansion

  return (
    <aside
      className={`fixed top-0 h-screen bg-accent transition-all ${expanded ? 'w-64' : 'w-16'}`}
      
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <nav className="h-screen flex flex-col justify-between border-r shadow-sm">
        <div className='flex-col h-full '>

          <div className="flex items-center p-3 pb-2">
            <img
              src="/ESlogo.png"
              className=' w-9 h-9'
              alt="Logo"
            />
            <span className={`ml-3 text-white font-semibold transition-all ${expanded ? 'block' : 'hidden'}`}>
              EchoSphere
            </span>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <div className=" flex flex-col px-3 h-full ">
              <SidebarItem icon={<SquarePlus size={20} />} text="Create" link="/protected/reports/create" />
              <hr className="border-t border-gray-200 my-2" />
              <SidebarItem
                icon={<LayoutDashboard size={20} />}
                text="Dashboard"
                link="/protected/dashboard"
                />
              <SidebarItem
                icon={<BarChart3 size={20} />}
                text="Analytics"
                link="/protected/analytics"
                />
              <SidebarItem
                icon={<Calendar size={20} />}
                text="Calendar"
                link="/protected/calendar"
                />
              <SidebarItem
                icon={<Brain size={20} />}
                text="Visualize"
                link="/protected/Visualize"
                />
              <SidebarItem
                icon={<Users size={20} />}
                text="Team"
                link="/protected/team"
                />
              <div className=' grow '/>
              <div className='pb-[63px]'>

                <SidebarItem
                  icon={<Settings size={20} />}
                  text="Settings"
                  link="/protected/settings"
                  />
                <SidebarItem
                  icon={<LogOut size={20} />}
                  text="Logout"
                  link="/landing"
                  />
              </div>
              
            </div>
          </SidebarContext.Provider>
        </div>

        <div className="border-t flex p-3 items-center ">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt="User Avatar"
            className="w-10 h-10 rounded-md"
            />
          <div className={`flex items-center overflow-hidden ${expanded ? "w-52 ml-3" : "w-0"}`}>
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
