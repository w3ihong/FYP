import React from 'react';
import Sidebar from '@/components/sidebar';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import VoiceflowChat from '@/components/chatbot'; // Import the VoiceflowChat component

export default async function ProtectedLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const supabase = createClient();  
    const {
      data: { user },
    } = await supabase.auth.getUser();

    
    //comment out to aid with development
     if (!user) {
       console.log('User not found');

       return redirect("../../landing/login");
     }

          // Fetch user profile to check user_type
  const { data: profile, error } = await supabase
  .from('users')
  .select('user_type')
  .eq('user_id', user.id)
  .single();

if (error) {
  console.error('Error fetching user profile:', error.message);
  return redirect("../../landing/login");
}

// Check if the user is an admin
if (profile.user_type === 'admin') {
  return redirect("/admin");
  
} 

    
    const userObj = JSON.parse(JSON.stringify(user));

    
    return (
        <div className='flex flex-row w-full min-h-screen bg-gray-50'>
            <Sidebar email={userObj.email} userType= {0}/>
            <div className="h-full w-16">
            </div>
            <div className="flex-1 w-full flex flex-col gap-6 p-6">
                {children}
            </div>
            <VoiceflowChat /> 
        </div>

        
    );

}