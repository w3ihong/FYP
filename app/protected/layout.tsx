import React from 'react';
import Link from 'next/link';
import Sidebar, { SidebarItem } from '@/components/sidebar';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { BarChart3, Calendar, LogOut, Users, SquarePlus, LayoutDashboard, Settings, Brain } from 'lucide-react';


export default async function ProtectedLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    // const supabase = createClient('https://fpfkrvlfzcslqjfkcfzl.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwZmtydmxmemNzbHFqZmtjZnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMxOTE0NTYsImV4cCI6MjAyODc2NzQ1Nn0.2dVff91qo0QuckDUWRfAh3KlLFF_5T6MCf90A0KEqg8');
  
    // const {
    //   data: { user },
    // } = await supabase.auth.getUser();
  
    // if (!user) {
    //   console.log('User not found');
    //   return redirect("../../landing/login");
    // }
    
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