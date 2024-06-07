'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'


export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    
    
  }

  console.log(data.email);

 

 

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/landing/login?message= Email or password is incorrect')
  }

  revalidatePath('/landing/login', 'page')
  console.log('Log in successful');
  redirect('/protected')
}

export async function signup(email: string, password: string) {
  const supabase = createClient()

  const data = {
    email,
    password
  }



  const { error } = await supabase.auth.signUp(data)

  console.log(error)

  if (error) {
    redirect('/error')
  } else {
    revalidatePath('/landing/register', 'page')
    console.log('Sign up successful');
    return true;
  }
  
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()

  revalidatePath('/protected', 'page')
  redirect('/landing/login')
}


export async function getEmail() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return user?.email;
}



export async function updatePassword(oldPassword: string, newPassword: string) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (!user.data?.user) {
    console.error('User not authenticated');
    redirect('/landing/login?message=User not authenticated');
    return;
  }

  // Re-authenticate user with the old password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.data.user.email,
    password: oldPassword,
  });

  if (signInError) {
    console.error('Error reauthenticating:', signInError.message);
    redirect('/settings/change-password?message=Current password is incorrect');
    return;
  }

  // Update password
  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

  if (updateError) {
    console.error('Error updating password:', updateError.message);
    redirect('/settings/change-password?message=Error updating password');
    return;
  }

  revalidatePath('/settings/change-password', 'page');
  console.log('Password updated successfully');
  redirect('/settings?message=Password updated successfully');
}

export async function updateEmail(currentEmail: string, newEmail: string) {
  const supabase = createClient();
  

  const user = await supabase.auth.getUser();

  if (!user.data?.user) {
    console.error('User not authenticated');
    redirect('/landing/login?message=User not authenticated');
    return;
  }

  

  // Update email
  const { error: updateError} = await supabase.auth.updateUser({ email: newEmail });

  if (updateError) {
    console.error('Error updating email:', updateError.message);
    redirect('/settings/change-email?message=Error updating email');
    return;
  }

  console.log('Email updated successfully');
  redirect('/settings?message=Email updated successfully');
}

// Delete the user account when modal clicked

export async function deleteAccount() {

  const supabase = createClient();

  try {
    // Check if the user is authenticated
    const user = await supabase.auth.getUser();
    if (!user.data?.user) {
      console.error('User not authenticated');
      redirect('/landing/login?message=User not authenticated');
      return;
    }

    // Delete the user account
    const { error } = await supabase.auth.deleteUser();
    if (error) {
      console.error('Error deleting account:', error.message);
      redirect('/settings/delete-account?message=Error deleting account');
      return;
    }

    console.log('Account deleted successfully');
    redirect('/landing/login?message=Account deleted successfully');
  } catch (error) {
    console.error('Unexpected error during account deletion:', error);
    redirect('/settings/delete-account?message=Unexpected error deleting account');
  }
}

export async function sendOTP(email: string) {
  const supabase = createClient();
  const user = supabase.auth.getUser();
  
  try {
    const { data, error } = await supabase.auth.signInWithOtp({ email: email });
    if (error) {
      console.error('Error sending OTP:', error.message);
      return null; // or handle the error appropriately
    } else {
      console.log('OTP sent successfully:', data);
      return user; // or do something with the data
    }
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    return null; // or handle the error appropriately
  }
}










