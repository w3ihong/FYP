'use client';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { BarChart3, TrendingUp, LineChart, PieChart, LogOut, Calendar, Settings } from 'lucide-react';
import Link from "next/link";
import { logout } from '@/app/actions';
import Image from 'next/image';
import logo from "@/public/ESLogo.png";
import { createClient } from '@/utils/supabase/client';

// Sidebar context to manage the expanded state
const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

// Props for SidebarItem component
interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  link: string;
  onClick?: () => void;
}

// SidebarItem component
export function SidebarItem({ icon, text, link, onClick }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);

  return (
    <Link href={link}>
      <div
        className={`relative flex items-center p-2 my-1 font-medium rounded-md cursor-pointer transition-colors hover:bg-SBaccent text-gray-699 `}
        onClick={onClick} // onClick handler
      >
        <span className="text-white">{icon}</span>
        <span
          className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
            expanded ? 'w-auto ml-3 opacity-100 text-white' : 'w-0 opacity-0'
          }`}
        >
          {text}
        </span>
      </div>
    </Link>
  );
}

// Sidebar component
export default function Sidebar({ email, userType }: { email: string, userType: number }) {
  const [expanded, setExpanded] = useState(false); // State to manage sidebar expansion
  const [userName, setUserName] = useState<{ firstName: string; lastName: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('first_name, last_name')
          .eq('email', email)
          .single();

        if (error) {
          console.error('Supabase error:', error);
          return;
        }

        if (data) {
          setUserName({ firstName: data.first_name, lastName: data.last_name });
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchUserData();
  }, [email, supabase]);

  return (
    <aside
      className={`fixed top-0 h-screen bg-accent transition-all ${expanded ? 'w-60' : 'w-16'}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <nav className="h-screen flex flex-col justify-between border-r shadow-sm">
        <div className='flex-col h-full'>
          <div className="flex items-center p-3 pb-2">
            <Image src={logo} className="w-9 h-9" alt="Logo" />
            {expanded && (
              <span className="ml-3 text-white font-semibold">
                EchoSphere
              </span>
            )}
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <div className="flex flex-col px-3 h-full">
              <SidebarItem icon={<BarChart3 size={20} />} text="Analysis Dashboard" link="/protected/analytics" />
              <SidebarItem icon={<TrendingUp size={20} />} text="Sentiment Analysis" link="/protected/sentiment-analysis" />
              <SidebarItem icon={<LineChart size={20} />} text="Trending Topics" link="/protected/trending-topics" />
              <SidebarItem icon={<PieChart size={20} />} text="Comparative Analysis" link="/protected/comparative-analysis" />
              <SidebarItem icon={<Calendar size={20} />} text="Calendar" link="/protected/calendar"/>

              <div className='grow' />
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
                  onClick={() => logout()}
                />
              </div>
            </div>
          </SidebarContext.Provider>
        </div>

        <div className="border-t flex p-3 items-center">
          {expanded && userName && (
            <div className="flex items-center ml-3">
              <div className="leading-4">
                <span className="text-xs text-gray-300">{userName.firstName} {userName.lastName}</span>
              </div>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
