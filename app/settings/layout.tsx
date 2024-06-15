import React from 'react';
import Sidebar from '@/components/sidebarSettings';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';


export default async function ProtectedLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const supabase = createClient();  
    const {
      data: { user },
    } = await supabase.auth.getUser();

    
    
    // comment out to aid with development
    // if (!user) {
    //   console.log('User not found');
    //   return redirect("../../landing/login");
    // }

    return (
        <div className='flex flex-row w-full min-h-screen'>
            <Sidebar/>
            <div className="h-full w-16">
            </div>
            <div className="flex-1 w-full flex flex-col gap-6 p-6">
                {children}
            </div>
        </div>
    );
}