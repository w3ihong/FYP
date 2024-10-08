"use client";
import React, { ReactNode, createContext, useContext, useState } from 'react';
import { Users, FileText, ShieldAlert, LogOut, Settings } from 'lucide-react';
import Link from "next/link";
import Image from 'next/image';
import logo from "@/public/ESLogo.png";

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
        className={`relative flex items-center p-2 my-1 font-medium rounded-md cursor-pointer transition-colors hover:bg-SBaccent text-gray-699 `}
      >
        <span className="text-white">{icon}</span>
        <span className={`overflow-hidden transition-all ${expanded ? 'w-52 ml-3 text-white' : 'w-0 text-white'}`}>
          {text}
        </span>
      </div>
    </Link>
  );
}

// AdminSidebar component
export default function AdminSidebar({email, userType }: {email: string , userType: number}) {
  const [expanded, setExpanded] = useState(false); // State to manage sidebar expansion

  return (
    <aside
      className={`fixed top-0 h-screen bg-accent transition-all ${expanded ? 'w-60' : 'w-16'}`}
      
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <nav className="h-screen flex flex-col justify-between border-r shadow-sm">
        <div className='flex-col h-full '>

          <div className="flex items-center p-3 pb-2">
            <Image src={logo} className="w-9 h-9" alt="Logo" />
            
            <span className={`ml-3 text-white font-semibold transition-all ${expanded ? 'block' : 'hidden'}`}>
              EchoSphere
            </span>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <div className=" flex flex-col px-3 h-full ">
              <SidebarItem icon={<Users size={20} />} text="Users" link="/admin" />
              <SidebarItem icon={<FileText size={20} />} text="Reports" link="/admin/reports" />
              <SidebarItem icon={<ShieldAlert size={20} />} text="Suspend" link="/admin/suspend" />
              <div className=' grow '/>
              <div className='pb-[63px]'>

                <SidebarItem
                  icon={<Settings size={20} />}
                  text="Settings"
                  link="/settings"
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
          <div className={`flex items-center overflow-hidden ${expanded ? "w-52 ml-3" : "w-0"}`}>
            <div className="leading-4">
              <span className="text-xs text-gray-300 overflow-clip">{email}</span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}