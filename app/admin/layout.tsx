import React from 'react';
import Sidebar from '@/components/sidebarAdmin';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();  
  const {
    data: { user },
  } = await supabase.auth.getUser();



  const userObj = JSON.parse(JSON.stringify(user));
  console.log(userObj.email);

    return (
      <div className='flex flex-row w-full min-h-screen'>
          <Sidebar email={userObj.email} userType= {0}/>
          <div className="h-full w-16">
          </div>
          <div className="flex-1 w-full flex flex-col gap-6 p-6">
              {children}
          </div>
      </div>
  );
}



