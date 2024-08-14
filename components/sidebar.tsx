'use client'
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { BarChart3, TrendingUp, LineChart, PieChart, LogOut, Calendar, Settings, User, Map } from 'lucide-react';
import Link from "next/link";
import { logout, fetchUserName } from '@/app/actions';
import Image from 'next/image';
import logo from "@/public/ESLogo.png";
import { createClient } from '@/utils/supabase/client';

// Sidebar context to manage the expanded state
const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

// Props for SidebarItem component
interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  link?: string;
  onClick?: () => void;
  clickable?: boolean;
}

// SidebarItem component
export function SidebarItem({ icon, text, link, onClick, clickable = true }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);

  const content = (
    <div
      className={`relative flex items-center p-2 my-1 font-medium rounded-md cursor-pointer transition-colors ${clickable ? 'hover:bg-blue-700 text-gray-699' : 'text-gray-500'}`}
      onClick={clickable ? onClick : undefined}
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

// Sidebar component
export default function Sidebar({ email, userType }: { email: string, userType: number }) {
  const [expanded, setExpanded] = useState(false);
  const [userName, setUserName] = useState<{ user_id: string; first_name: string; last_name: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await fetchUserName();
      if (userData) {
        setUserName(userData);
      }
    };

    fetchUserData();
  }, [email, supabase]);

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 h-full bg-accent transition-all duration-300 ease-in-out z-10 ${
        expanded ? 'w-[13rem]' : 'w-16'
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <nav className="flex flex-col justify-between h-full shadow-sm">
        <div>
          <Link href="/protected">
            <div className="flex items-center justify-start p-3" >
              <Image src={logo} width={36} height={36} alt="Logo" priority/>
              <span
                className={`ml-3 text-white font-semibold overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out opacity-100
                `}
              >
                EchoSphere
              </span>
            </div>
          </Link>
          <div className="flex flex-col px-3 overflow-y-auto">
            <SidebarItem icon={<Calendar size={20} />} text="Calendar" link="/protected/calendar"/>
            <SidebarItem icon={<BarChart3 size={20} />} text="Analytics" link="/protected/analytics" />
            <SidebarItem icon={<Map size={20} />} text="Demographics" link="/protected/demographics"/>
            <SidebarItem icon={<LineChart size={20} />} text="Trends " link="/protected/Trending" />
            <SidebarItem icon={<PieChart size={20} />} text="Comparative " link="/protected/comparative" />
            <div className='my-4' /> 
          </div>
        </div>
        <div className='flex flex-col px-3 py-2'>
          <SidebarItem
            icon={<Settings size={20} />}
            text="Settings"
            link="/settings"
          />
          <SidebarItem
            icon={<LogOut size={20} />}
            text="Logout"
            link="/landing"
            onClick={() => logout()}
          />

          <SidebarItem
            icon={<User size={20} className="text-white" />}
            text={userName ? `${userName.first_name} ${userName.last_name}` : ''}
            clickable={false}
          />
        </div>
      </nav>
    </aside>
  );
}
