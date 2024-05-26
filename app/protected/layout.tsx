import React from 'react';
import Sidebar from '@/components/sidebar';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';


export default async function ProtectedLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    // TO DO :idk why this is not working
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
            <Sidebar/>
            <div className="h-full w-16">
            </div>
            <div className="flex-1 w-full flex flex-col gap-6 p-6">
                {children}
            </div>
        </div>
    );
}