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

  console.log(user?.id);
  
  // comment out to aid with development
  if (!user) {
    console.log('User not found');
    return redirect("../../landing/login");
  }

  return (
    <div className='flex'>
    <div>
      <Sidebar/>
    </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
