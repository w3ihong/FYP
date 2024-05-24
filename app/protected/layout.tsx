import React from 'react';
import Link from 'next/link';
import Sidebar, { SidebarItem } from '@/components/sidebar';
import { BarChart3, Calendar, LogOut, Users, SquarePlus, LayoutDashboard, Settings, Brain } from 'lucide-react';

export default function loggedInLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
        <div className='flex flex-row w-full min-h-screen'>
            <Sidebar>
                <Link href="/app/create/page.tsx">
                    <SidebarItem icon={<SquarePlus size={20} />} text="Create" />
                </Link>
                <hr className="border-t border-gray-200 my-2" />
                <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active />
                <Link href="app\protected\analytics\page.tsx">
                <SidebarItem icon={<BarChart3 size={20} />} text="Analytics" alert />
                </Link>
                <Link href="/app/calendar/page.tsx">
                <SidebarItem icon={<Calendar size={20} />} text="Calendar" />
                </Link>
                <Link href="/app/visualize/page.tsx">
                <SidebarItem icon={<Brain size={20} />} text="Visualize" />
                </Link>
                <Link href="/app/team/page.tsx">
                <SidebarItem icon={<Users size={20} />} text="Team" />
                </Link>
                <div style={{ height: '450px' }} />
                <Link href="/app/settings/page.tsx"> {/* Adjust the href as per your settings page */}
                <SidebarItem icon={<Settings size={20} />} text="Settings" />
                </Link>
                <Link href="/app/logout"> {/* Adjust the href as per your logout page */}
                <SidebarItem icon={<LogOut size={20} />} text="Logout" />
                </Link>
            </Sidebar>
            <div className="flex-1 w-full flex flex-col gap-6 p-6">
                {children}
            </div>
        </div>
    );
}