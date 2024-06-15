'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createAdminClient, createClient } from '@/utils/supabase/server'
import nodemailer from 'nodemailer';
import { idText } from 'typescript';
import { Router } from 'lucide-react';
import TwoFactorAuth from './landing/TwoFactorAuth/page';

const otpStore = new Map();
const router = Router;


export async function login(formData: FormData) {
  const supabase = createClient();

  // Type-casting here for convenience
  // In practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  console.log(data.email);

  // Authenticate the user with email and password
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword(data);

  if (authError) {
    redirect('/landing/login?message=Email or password is incorrect');
    return;
  }

  // If authentication is successful, check if the user account is disabled
  const user = authData.user;
  const { data: foundUser, error: findError } = await supabase
    .from('users')
    .select('disabled, FA')
    .eq('user_id', user.id)
    .single();

  if (findError) {
    console.error('Error checking user status:', findError.message);
    redirect('/landing/login?message=An error occurred while checking user status');
    return;
  }

  if (foundUser.disabled) {
    console.log('User account is disabled');
    redirect('/landing/login?message=Your account is disabled');
    return;
  }

  if (foundUser['FA']) {
    
    console.log('2FA is enabled for this account');

    // Generate OTP
    const otp = generateOTP();

    // Save the OTP in a store (this example uses a hypothetical otpStore)
    otpStore.set(data.email, otp);

    // Send OTP via email
    await sendOTPEmail(data.email, otp);

    redirect(`/landing/TwoFactorAuth?email=${encodeURIComponent(data.email) }`)

  

    

    

    

   // redirect('/landing/login?message=Please check your email for 2FA code');
    return;

    
   // + encodeURIComponent(data.email)
  }

  // Proceed with the login if the user is not disabled and 2FA is not enabled
  revalidatePath('/landing/login', 'page');
  console.log('Log in successful');
  
  redirect('/protected');
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

export async function deleteUser() {
  const supabase = createAdminClient();
  try {
    // Get the current user
    const { data: { user }, error: getUserError } = await supabase.auth.getUser();
    if (getUserError) {
      throw getUserError;
    }

    if (!user) {
      console.error('No user logged in.');
      return false;
    }

    // Delete user data from your database
    const { error: deleteUserDataError } = await supabase
      .from('users')
      .delete()
      .eq('user_id', user.id); // Assuming 'id' is the primary key of your user table

    if (deleteUserDataError) {
      throw deleteUserDataError;
    }

    // Delete the user from the Supabase authentication system
    const { error: deleteAuthUserError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteAuthUserError) {
      throw deleteAuthUserError;
    }

    console.log('User deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting user:', error.message);
    return false;
  }
}

// Function to generate a random OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}

// Function to send OTP via email
async function sendOTPEmail(email, otp) {
  // Configure Nodemailer with your email service provider
  let transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider
    auth: {
      user: 'yaswanthgan3@gmail.com', // Your email address
      pass: 'glfq xntf jyqv jihm' // Your email password or app-specific password
    }
  });

  // Email content
  let mailOptions = {
    from: 'yaswanthgan3@gmail.com',
    to: email,
    subject: 'Your OTP for Verification',
    text: `Your OTP is: ${otp}. Please use this OTP to verify your email.`
  };

  // Send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);
  console.log('OTP email sent:', info.messageId);
}

export async function sendOTP(email: string) {
  const supabase = createClient();

  try {
    const otp = generateOTP(); // Generate OTP
    otpStore.set(email , otp);
    

    // Send OTP via email
    await sendOTPEmail(email, otp);

    console.log('OTP sent successfully to', email);

    // Optionally, you can save the OTP in the database or in-memory store for later verification

    return otp; // Return the OTP for further processing if needed
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    return null; // Handle the error appropriately
  }
}

export async function verifyOTP(data: { email: string; otp: string }) {
  const supabase = createClient();
  const email = data.email;
  const otp = data.otp;

  // Retrieve the saved OTP from the store
  const savedOTP = otpStore.get(email);

  if (savedOTP === otp) {
    // OTP is correct, remove it from the store
    otpStore.delete(email);
    console.log('OTP verified successfully for', email);

    // Get the currently authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error fetching authenticated user:', userError.message);
      redirect(`/landing/TwoFactorAuth?email=${encodeURIComponent(email)}&message=An error occurred`);
      return;
    }

    if (!user) {
      console.error('No authenticated user found');
      redirect(`/landing/TwoFactorAuth?email=${encodeURIComponent(email)}&message=No authenticated user found`);
      return;
    }

    // Log the ID of the authenticated user
    console.log('Authenticated user ID:', user.id);

    // Update the user to set FA to true
    const { error: updateError } = await supabase
      .from('users')
      .update({ FA: true })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating user 2FA status:', updateError.message);
      redirect(`/landing/TwoFactorAuth?email=${encodeURIComponent(email)}&message=An error occurred`);
      return;
    }

    console.log('2FA enabled successfully for', email);
    redirect('/protected');
  } else {
    // OTP is incorrect, redirect back to the OTP page with an error message
    console.log('Incorrect OTP');
    redirect(`/landing/TwoFactorAuth?email=${encodeURIComponent(email)}&message=Incorrect OTP`);
  }
}



export async function disableUser() {
  const supabase = createClient();

  try {
    // Get the currently authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error fetching authenticated user:', userError.message);
      throw userError;
    }

    if (!user) {
      console.error('No authenticated user found');
      return false;
    }

    // Log the ID of the authenticated user
    console.log('Authenticated user ID:', user.id);

    // Find the user by ID in your users table
    const { data: foundUser, error: findError } = await supabase
      .from('users')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    if (findError) {
      console.error('Error finding user by ID:', findError.message);
      throw findError;
    }

    if (!foundUser) {
      console.error('User not found for ID:', user.id);
      return false;
    }

    // Disable the user account
    const { error: updateError } = await supabase
      .from('users')
      .update({ disabled: true }) // Assuming you have a field 'disabled' to track account status
      .eq('user_id', foundUser.user_id); // Using user_id to identify the user

    if (updateError) {
      console.error('Error updating user status:', updateError.message);
      throw updateError;
    }

    console.log('User disabled successfully:', foundUser.user_id);


    
  
    // Sign out the user after disabling the account
    const { error: signOutError } = await supabase.auth.signOut();
    

    

    if (signOutError) {
      console.error('Error signing out user:', signOutError.message);
      throw signOutError;
    }

    
    console.log('User signed out successfully');
    return true;
  } catch (error) {
    console.error('Error disabling user:', error.message);
    return false;
  }
}










