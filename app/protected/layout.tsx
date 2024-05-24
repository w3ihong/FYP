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
                
            </Sidebar>
            <div className="flex-1 w-full flex flex-col gap-6 p-6">
                {children}
            </div>
        </div>
    );
}