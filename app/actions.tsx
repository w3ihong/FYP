'use server'


import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createAdminClient, createClient } from '@/utils/supabase/server'
import nodemailer from 'nodemailer';

import {  toZonedTime, format } from 'date-fns-tz';

const otpStore = new Map();


export async function login(formData: FormData) {
  const supabase = createClient();

  // Type-casting here for convenience
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  // Authenticate the user with email and password
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword(data);

  if (authError) {
    redirect('/landing/login?message=Email or password is incorrect');
    return;
  }

  // Get the authenticated user
  const user = authData.user;
  const userId = user.id;

  // Insert user data if necessary
  await insertUserData(userId);

  // Check if the user account is disabled
  const { data: foundUser, error: findError } = await supabase
    .from('users')
    .select('disabled, FA, profile_complete , suspended')
    .eq('user_id', userId)
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

  // Check if profile and category are complete
  if (!foundUser.profile_complete) {
    redirect('/landing/register/userProfile');
    return;
  }

  // Handle 2FA
  if (foundUser.FA) {
    const otpStore = ''; // Replace with actual OTP store logic
    const isVerify = await verifyOTP(data.email, otpStore);

    if (isVerify) {
      redirect('/protected'); // Redirect to protected page if OTP is verified
      return;
    } else {
      redirect(`/landing/TwoFactorAuth?email=${encodeURIComponent(data.email)}`);
      return;
    }
  }

  if (foundUser.suspended) {
    console.log('User account has been suspended');
    await enableUser();
    redirect('/landing/login?message=Your account has been suspended ');
 //   return;
  }
  

  

  // Proceed with the login if the user is not disabled and 2FA is not enabled
  revalidatePath('/landing/login', 'page');
  console.log('Log in successful');
  redirect('/protected');
}

// Function to insert user data into the users table
async function insertUserData(userId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('users')
    .insert([
      {
        user_id: userId,
        suspended: false,
        user_type: 'basic',
        disabled : 'false' ,
        FA : false ,
        
       
      },
    ]);

  if (error) {
    // console.error('Error inserting user data:', error.message);
    return false;
  }

  console.log('User data inserted successfully');
  return true;
}



export async function signup(email: string, password: string) {
  const supabase = createClient()

  const check = supabase.auth.getUser();

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


export async function billingDetails() {
  const supabase = createClient();
  const userResponse = await supabase.auth.getUser(); 
  
  if (!userResponse) {
    console.error('User not authenticated');
    return null;
  }
  
  const userId = userResponse.data.user!.id;

  try {
    const { data, error } = await supabase
      .from('billing')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching billing details:', error.message);
      return null;
    }

    return data;
  } catch (error : any) {
    console.error('Error fetching billing details:', error.message);
    return null;
  }
}


export async function updateCardDetails(cardDetails: any) {
  const supabase = createClient();
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error fetching authenticated user:', userError.message);
      return false;
    }

    const userId = user?.id;

    if (!userId) {
      console.error('User ID not found');
      return false;
    }

    // Check if user exists in billing table
    const { data: existingBillingUsers, error: billingError } = await supabase
      .from('billing')
      .select('*')
      .eq('user_id', userId);

    if (billingError) {
      throw billingError;
    }

    const existingBillingUser = existingBillingUsers?.[0]; // Take the first result if available

    if (!existingBillingUser) {
      // Insert new billing record if user doesn't exist in billing table
      const { data: newBillingUser, error: insertError } = await supabase
        .from('billing')
        .insert({
          user_id: userId,
          full_name: cardDetails.full_name,
          credit_card_no: cardDetails.credit_card_no,
          credit_card_expiry: cardDetails.credit_card_expiry,
          credit_card_cvv: cardDetails.credit_card_cvv,
          state: cardDetails.state,
          city: cardDetails.city,
          street: cardDetails.street,
          unit: cardDetails.unit,
          postalcode: cardDetails.postalcode
        });

      if (insertError) {
        throw insertError;
      }

      // Handle success
      console.log('New billing record created for user:', newBillingUser);
    } else {
      // Update existing billing record
      const { data: updatedBillingUser, error: updateError } = await supabase
        .from('billing')
        .update({
          full_name: cardDetails.full_name,
          credit_card_no: cardDetails.credit_card_no,
          credit_card_expiry: cardDetails.credit_card_expiry,
          credit_card_cvv: cardDetails.credit_card_cvv,
          state: cardDetails.state,
          city: cardDetails.city,
          street: cardDetails.street,
          unit: cardDetails.unit,
          postalcode: cardDetails.postalcode
        })
        .eq('user_id', userId);

      if (updateError) {
        throw updateError;
      }

      // Handle success
      console.log('Billing details updated successfully:', updatedBillingUser);
    }
  } catch (error) {
    throw new Error(`Error updating card details: ${error.message}`);
  }
}


export async function planType() {
  const supabase = createClient();

  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    const userId = user?.id;

    if (!userId) {
      throw new Error('User ID not found');
    }

    // Get the user_type for the current user
    const { data: userData, error: userTypeError } = await supabase
      .from('users')
      .select('user_type')
      .eq('user_id', userId)
      .single();

    if (userTypeError) {
      throw userTypeError;
    }

    const userType = userData?.user_type;

    if (!userType) {
      throw new Error('User type not found');
    }

    return userType;
  } catch (error : any) {
    console.error('Error fetching plan type:', error.message);
    return null;
  }
}

export async function upgradeSubscription(plan_type: string): Promise<void> {
  const supabase = createClient();
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    const userId = user?.id;

    if (!userId) {
      throw new Error('User ID not found');
    }

    const { data, error } = await supabase
      .from('users')
      .update({ user_type: plan_type }) 
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    // Handle success
    console.log('User type updated successfully:', data);
  } catch (error : any) {
    throw new Error(`Error updating user type: ${error.message}`);
  }
}

export async function downgradeSubscription(plan_type: string): Promise<void> {
  const supabase = createClient();
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    const userId = user?.id;

    if (!userId) {
      throw new Error('User ID not found');
    }

    const { data, error } = await supabase
      .from('users')
      .update({ user_type: plan_type }) 
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    // Handle success
    console.log('User type updated successfully:', data);
  } catch (error : any) {
    throw new Error(`Error updating user type: ${error.message}`);
  }
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
    email: String(user.data.user.email),
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

  // Get the current user
  const { data: { user }, error: getUserError } = await supabase.auth.getUser();
  if (getUserError) {
    console.error('Error getting user:', getUserError.message);
    return false;
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
    console.error('Error deleting user data:', deleteUserDataError.message);
    return false;
  }

  // Delete the user from the Supabase authentication system
  const { error: deleteAuthUserError } = await supabase.auth.admin.deleteUser(user.id);

  if (deleteAuthUserError) {
    console.error('Error deleting auth user:', deleteAuthUserError.message);
    return false;
  }

  console.log('User deleted successfully');
  redirect('/landing');
  return true;
}


// Function to generate a random OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}

// Function to send OTP via email
async function sendOTPEmail(email: string, otp : string) {
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
  } catch (error: any) {
    console.error('Error sending OTP:', error.message);
    return null; // Handle the error appropriately
  }
}

export async function verifyOTP(email : string, inputOtp : any) {
  const supabase = createClient();

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

  const userId = user.id;

  const storedOtp = otpStore.get(email); // Retrieve stored OTP for the email

  // Handle empty input OTP
  if (!inputOtp) {
    console.error('Empty input OTP');
    return false;
  }

  if (storedOtp && storedOtp === inputOtp) {
    otpStore.delete(email); // OTP is valid, remove it from the store
    console.log('OTP verified successfully for', email);

    // Update the user to set 2FAenabled to true
    const { error: updateError } = await supabase
      .from('users')
      .update({ FA: true }) // Assuming you have a field 'FA' to track 2FA status
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating user 2FA status:', updateError.message);
      throw updateError;
    }

    console.log('2FA enabled successfully for', email);

    
    // Redirect to protected page
    redirect('/protected');

    return true;
  } else {
    console.error('Invalid OTP for', email);
    return false;
  }
}


export async function checkOTP(email : string, inputOtp : string) {
  const supabase = createClient();

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

  const userId = user.id;

  const storedOtp = otpStore.get(email); // Retrieve stored OTP for the email

  // Handle empty input OTP
  if (!inputOtp) {
    console.error('Empty input OTP');
    return false;
  }

  if (storedOtp && storedOtp === inputOtp) {
    otpStore.delete(email); // OTP is valid, remove it from the store
    console.log('OTP verified successfully for', email);

    // Update the user to set 2FAenabled to true
    const { error: updateError } = await supabase
      .from('users')
      .update({ FA: true }) // Assuming you have a field 'FA' to track 2FA status
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating user 2FA status:', updateError.message);
      throw updateError;
    }

    console.log('2FA enabled successfully for', email);

    
    
    

    return true;
  } else {
    console.error('Invalid OTP for', email);
    return false;
  }
}


export async function disableUser() {
  const supabase = createClient();

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


 // if (signOutError) {
 //   console.error('Error signing out user:', signOutError.message);
 //   throw signOutError;
 // }

//  console.log('User signed out successfully');
  redirect('/landing');
  return true;
}




export async function enableUser() {
  const supabase = createClient();

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
    .update({ disabled: false }) // Assuming you have a field 'disabled' to track account status
    .eq('user_id', foundUser.user_id); // Using user_id to identify the user

  if (updateError) {
    console.error('Error updating user status:', updateError.message);
    throw updateError;
  }

  console.log('User has been enabled successfully:', foundUser.user_id);

  
  return true;
}

export async function checkUserStatus() {
  const supabase = createClient();

  // Get the currently authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error fetching authenticated user:', userError.message);
    throw userError;
  }

  if (!user) {
    console.error('No authenticated user found');
    return null; // Return null if no user is authenticated
  }

  // Log the ID of the authenticated user
  console.log('Authenticated user ID:', user.id);

  // Find the user by ID in your users table and fetch their disabled status
  const { data: foundUser, error: findError } = await supabase
    .from('users')
    .select('disabled')
    .eq('user_id', user.id)
    .single();

  if (findError) {
    console.error('Error finding user by ID:', findError.message);
    throw findError;
  }

  if (!foundUser) {
    console.error('User not found for ID:', user.id);
    return null; // Return null if user is not found
  }

  // Log the disabled status of the user
  console.log('User status (disabled):', foundUser.disabled);

  return true;
}

//for existing user in the profile settings
export async function getUserProfile() {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error fetching authenticated user:', userError.message);
    return null;
  }

  const userId = user?.id;

  if (!userId) {
    console.error('User ID not found');
    return null;
  }

  const { data: profileData, error: profileError } = await supabase
    .from('users')
    .select('first_name,last_name,DOB,country,main_category,gender')
    .eq('user_id', userId)
    .single();

  if (profileError) {
    console.error('Error fetching user profile:', profileError.message);
    return null;
  }
  if (profileData) {
    profileData.main_category = JSON.parse(profileData.main_category || '[]');
  }

  return profileData;
}

// Function to update user profile data
export async function updateUserProfile(profileData: any) {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error fetching authenticated user:', userError.message);
    return false;
  }

  const userId = user?.id;

  if (!userId) {
    console.error('User ID not found');
    return false;
  }

  const { error: updateError } = await supabase
    .from('users')
    .update({
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      DOB: profileData.dateOfBirth,
      country: profileData.country,
      gender: profileData.gender,
      profile_complete: true  // Mark profile as complete
    })
    .eq('user_id', userId);

  if (updateError) {
    console.error('Error updating user profile:', updateError.message);
    return false;
  }

  return true;
}

//get user's category for main and sub
export async function getUserCategory() {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error fetching authenticated user:', userError.message);
    return null;
  }

  const userId = user?.id;

  if (!userId) {
    console.error('User ID not found');
    return null;
  }

  const { data: profileData, error: profileError } = await supabase
    .from('users')
    .select('main_category, sub_category')
    .eq('user_id', userId)
    .single();

  if (profileError) {
    console.error('Error fetching user profile:', profileError.message);
    return null;
  }

  // Parse the JSON fields if necessary
  if (profileData) {
    profileData.main_category = JSON.parse(profileData.main_category || '[]');
    profileData.sub_category = JSON.parse(profileData.sub_category || '{}');
  }

  return profileData;
}

export async function updateUserCategory(profileData: any) {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error fetching authenticated user:', userError.message);
    return false;
  }

  const userId = user?.id;

  if (!userId) {
    console.error('User ID not found');
    return false;
  }

  const { error: updateError } = await supabase
    .from('users')
    .update({
      main_category: JSON.stringify(profileData.mainCategories),
      sub_category: JSON.stringify(profileData.subCategories)
    })
    .eq('user_id', userId);

  if (updateError) {
    console.error('Error updating user profile:', updateError.message);
    return false;
  }

  return true;
}

export async function fetchUsers() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('users') // Replace 'users' with your actual table name
      .select('user_id  , first_name , suspended');
      

    if (error) {
      throw error;
    }

    
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function fetchReports()
{
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('reports_on_user') // Replace 'users' with your actual table name
      .select('reason , reporter_id , reportee_id , first_name ');
      

    if (error) {
      throw error;
    }

    
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }

}

export async function fetchSuspension()
{
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('suspension') // Replace 'users' with your actual table name
      .select('reason , user_id  ');
      

    if (error) {
      throw error;
    }

    
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }

}

export async function disableUsers(userId: string) {
  const supabase = createClient();
  const user = supabase.auth.getUser();

  try {
    // Log the userId to debug
    console.log('Suspending user with ID:', userId);

    // Update the user's status in the database based on the user ID
    let { error } = await supabase
      .from('users') // Replace 'users' with your actual table name
      .update({ suspended: true }) // Replace with your actual fields
      .eq('user_id', userId); // Pass the userId correctly here

    if (error) {
      throw error;
    }
    return { success: true };
  } catch (error) {
    console.error('Error suspending user:', error);
    return { success: false, error };
  }
}



export async function enableUsers(userId: string) {
  const supabase = createClient();
  const user = supabase.auth.getUser();

  try {
    // Log the userId to debug
    console.log('Unsuspending user with ID:', userId);

    // Update the user's status in the database based on the user ID
    let { error } = await supabase
      .from('users') // Replace 'users' with your actual table name
      .update({ suspended: false }) // Replace with your actual fields
      .eq('user_id', userId); // Pass the userId correctly here

    if (error) {
      throw error;
    }
    return { success: true };
  } catch (error) {
    console.error('Error disabling user:', error);
    return { success: false, error };
  }
}



export async function insertSuspensionData(userId: string, reason: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('suspension')
    .insert([
      {
        user_id: userId,
        reason: reason,
        
        
      },
    ]);

  if (error) {
    console.error('Error inserting user data:', error.message);
    return false;
  }

  console.log('User data inserted successfully');
  return true;
}


export const getPosts = async () => {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error('Error fetching authenticated user:', userError.message);
    return [];
  }

  const userId = user?.id;

  if (!userId) {
    console.error('User ID not found');
    return [];
  }

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      platform_account!inner (
        user_id,account_username,platform
      )
    `)
    .eq('platform_account.user_id', userId);

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  return data.map(post => ({
    ...post,
    client_name: post.platform_account.account_username,
    platform: post.platform_account.platform
  }));

  
};
export const fetchUserName = async () => {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error('Error fetching authenticated user:', userError.message);
    return null;
  }

  const userId = user?.id;

  if (!userId) {
    console.error('User ID not found');
    return null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('user_id, first_name, last_name')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error.message);
    return null;
  }

  if (!data) {
    console.error('User data not found');
    return null;
  }

  return {
    user_id: data.user_id,
    first_name: data.first_name,
    last_name: data.last_name,
  };
};

export const getPostMetrics = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('post_metrics')
    .select('*');

  if (error) {
    console.error('Error fetching post metrics:', error.message);
    return null;
  }

  return data;
};

export const getPostsWithMetrics = async () => {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error fetching authenticated user:', userError.message);
    return [];
  }

  const userId = user?.id;

  if (!userId) {
    console.error('User ID not found');
    return [];
  }

  // Fetch posts for the authenticated user with platform information
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select(`
      *,
      platform_account!inner (
        user_id, account_username, platform
      )
    `)
    .eq('platform_account.user_id', userId);

  if (postsError) {
    console.error('Error fetching posts:', postsError.message);
    return [];
  }

  // Fetch post metrics
  const { data: metrics, error: metricsError } = await supabase
    .from('post_metrics')
    .select('*');

  if (metricsError) {
    console.error('Error fetching post metrics:', metricsError.message);
    return [];
  }

  // Merge posts with their metrics
  const postsWithMetrics = posts.map(post => {
    const postMetrics = metrics.find(metric => metric.post_id === post.id) || {};
    return {
      ...post,
      metrics: postMetrics,
      platform: post.platform_account?.platform // Ensure platform data is included
    };
  });

  return postsWithMetrics;
};



export const getPostsWithSentiment = async (
  sortDirection: 'asc' | 'desc' = 'desc',
  startDate?: string,
  endDate?: string
) => {
  const supabase = createClient();

  // Fetch the authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error fetching authenticated user:', userError.message);
    return [];
  }

  const userId = user?.id;
  


  if (!userId) {
    console.error('User ID not found');
    return [];
  }

  // Construct the date filter
  const dateFilter: any = {};
  if (startDate) {
    dateFilter['created_at'] = `gte.${startDate}`;
  }
  if (endDate) {
    dateFilter['created_at'] = dateFilter['created_at']
      ? [dateFilter['created_at'], `lte.${endDate}`]
      : `lte.${endDate}`;
  }

  // Fetch posts with their sentiment metrics
  const { data: postsWithSentiment, error: postsWithSentimentError } = await supabase
    .from('posts')
    .select(`
      *,
      post_metrics!inner (
        post_id,
        post_sentiment, 
        post_impressions, 
        date_retrieved,
        post_likes
      )
    `)
    .filter('created_at', 'gte', startDate || '1970-01-01')
    .filter('created_at', 'lte', endDate || new Date().toISOString())
    .order('created_at', { ascending: sortDirection === 'asc' })
    .limit(20);

  if (postsWithSentimentError) {
    console.error('Error fetching posts with sentiment:', postsWithSentimentError.message);
    return [];
  }

  // Convert date_retrieved to Singapore Time (SGT) and add emoji based on sentiment
  const timeZone = 'Asia/Singapore';
  const getSentimentEmoji = (sentiment) => {
    if (sentiment > 0.5) return '😀';
    if (sentiment < -0.5) return '😞';
    return '😐';
  };

  const postsWithConvertedDatesAndEmojis = postsWithSentiment.map(post => {
    const postMetrics = post.post_metrics || [];
    const convertedMetrics = postMetrics.map(metric => {
      const utcDate = metric.date_retrieved ? new Date(metric.date_retrieved) : null;
      const sgtDate = utcDate ? toZonedTime(utcDate, timeZone) : null;
      const formattedSgtDate = sgtDate ? format(sgtDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone }) : null;
      const sentimentEmoji = getSentimentEmoji(metric.post_sentiment);
      return {
        ...metric,
        date_retrieved: formattedSgtDate,
        sentiment_emoji: sentimentEmoji,
      };
    });
    return {
      ...post,
      post_metrics: convertedMetrics,
    };
  });

  return postsWithConvertedDatesAndEmojis;
};


export const getPlatformMetricDates = async () => {
  const supabase = createClient();
  const timeZone = 'Asia/Singapore';

  try {
    // Fetch platform metrics
    const { data: platformMetrics, error: platformError } = await supabase
      .from('platform_metrics')
      .select('*');

    if (platformError) {
      console.error('Supabase error fetching platform metrics:', platformError);
      return [];
    }

    // Convert date_retrieved to Singapore Time (SGT)
    const formattedMetrics = platformMetrics.map(metric => {
      const utcDate = metric.date_retrieved ? new Date(metric.date_retrieved) : null;
      const sgtDate = utcDate ? toZonedTime(utcDate, timeZone) : null;
      const formattedSgtDate = sgtDate ? format(sgtDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone }) : null;
      return {
        ...metric,
        date_retrieved: formattedSgtDate,
      };
    });

    return formattedMetrics;
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};



export const getPlatformMetricDatesThree = async () => {
  const supabase = createClient();
  const timeZone = 'Asia/Singapore';

  try {
    // Fetch post metrics and platform metrics in one query
    const { data: postMetrics, error: postError } = await supabase
      .from('post_metrics')
      .select('*, platform_metrics(platform_account, post_likes, post_shares, post_impressions)')
      .order('date_retrieved', { ascending: false });

    if (postError) {
      console.error('Supabase error fetching post metrics:', postError);
      return [];
    }

    // Convert date_retrieved to Singapore Time (SGT)
    const formattedMetrics = postMetrics.map(metric => {
      const utcDate = metric.date_retrieved ? new Date(metric.date_retrieved) : null;
      const sgtDate = utcDate ? toZonedTime(utcDate, timeZone) : null;
      const formattedSgtDate = sgtDate ? format(sgtDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone }) : null;
      return {
        ...metric,
        date_retrieved: formattedSgtDate,
      };
    });

    return formattedMetrics;
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};



export const getPlatformMetricDatesTwo = async () => {
  const supabase = createClient();
  const timeZone = 'Asia/Singapore';

  try {
    // Fetch recent post metrics
    const { data: postMetrics, error: postError } = await supabase
      .from('post_metrics')
      .select('*')
      .order('date_retrieved', { ascending: true })
      .limit(12);
      
      

    if (postError) {
      console.error('Supabase error fetching post metrics:', postError);
      return [];
    }

    // Fetch total platform metrics
    const { data: platformMetricsData, error: platformError } = await supabase
      .from('platform_metrics')
      .select('*')
      .eq('platform_account', '17841466917978018');
      
      

    if (platformError) {
      console.error('Supabase error fetching platform metrics:', platformError);
      return [];
    }

    // Combine post metrics and platform metrics
    const joinedData = [...postMetrics, ...platformMetricsData];

    // Convert date_retrieved to Singapore Time (SGT)
    const formattedMetrics = joinedData.map(metric => {
      const utcDate = metric.date_retrieved ? new Date(metric.date_retrieved) : null;
      const sgtDate = utcDate ? toZonedTime(utcDate, timeZone) : null;
      const formattedSgtDate = sgtDate ? format(sgtDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone }) : null;
      return {
        ...metric,
        date_retrieved: formattedSgtDate,
      };
    });

    return formattedMetrics;
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};


export const getDateRetrievedFromMetrics = async () => {
  const supabase = createClient();

  // Fetch the authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error fetching authenticated user:', userError.message);
    return [];
  }

  const userId = "17841466917978018";

 // const userId = user?.id;

  if (!userId) {
    console.error('User ID not found');
    return [];
  }

  // Fetch date_retrieved from platform_metrics table
  const { data: metrics, error: metricsError } = await supabase
    .from('platform_metrics')
    .select('date_retrieved')
    .eq('platform_account', userId); // Assuming you want to filter by user_id

  if (metricsError) {
    console.error('Error fetching metrics:', metricsError.message);
    return [];
  }

  // Return the date_retrieved fields
  return metrics.map(metric => metric.date_retrieved);
};

export const test = async (
  sortDirection: 'asc' | 'desc' = 'desc',
  startDate?: string,
  endDate?: string
) => {
  const supabase = createClient();

  // Fetch the authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error fetching authenticated user:', userError.message);
    return [];
  }

  const userId = user?.id;

  if (!userId) {
    console.error('User ID not found');
    return [];
  }

  // Fetch posts with their sentiment metrics
  const { data: postsWithSentiment, error: postsWithSentimentError } = await supabase
    .from('post_metrics')
    .select(`
      *,
      platform_metrics!inner (
        date_retrieved
      )
    `)
    .order('created_at', { ascending: sortDirection === 'asc' })
    .limit(10);

  if (postsWithSentimentError) {
    console.error('Error fetching posts with sentiment:', postsWithSentimentError.message);
    return [];
  }

  // Convert date_retrieved to Singapore Time (SGT)
  const postsWithConvertedDates = convertDateToSGT(postsWithSentiment);

  return postsWithConvertedDates;
};



const timeZone = 'Asia/Singapore';

export const convertDatesToSGT = async (data: any[]) => {
  return data.map(item => {
    const utcDate = item.date_retrieved ? new Date(item.date_retrieved) : new Date(0); // Default to epoch start if null
    const sgtDate = toZonedTime(utcDate, timeZone);
    const formattedSgtDate = format(sgtDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone });
    return {
      ...item,
      date_retrieved: formattedSgtDate,
    };
  });
};










function convertDateToSGT(postsWithSentiment: any[]) {
  return postsWithSentiment.map(post => {
    const date = new Date(post.date_retrieved);
    if (isNaN(date.getTime())) {
      console.error('Invalid date format:', post.date_retrieved);
      return post;
    }
    // Convert to SGT (UTC+8)
    const sgtOffset = 8 * 60; // SGT is UTC+8
    const sgtDate = new Date(date.getTime() + sgtOffset * 60 * 1000);
    return { ...post, date_retrieved: sgtDate.toISOString() };
  });
}


export const toggleBlurEffect = async () => {
  if (typeof document !== 'undefined') {
    const supabase = createClient();
    try {
      // Fetch the authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching authenticated user:', userError.message);
        return;
      }

      // console.log('User:', user);  // Log the user details

      const userId = user?.id;

      if (!userId) {
        console.error('User ID not found');
        return;
      }

      // Fetch the user's membership status
      const { data: membership, error: membershipError } = await supabase
        .from('users')
        .select('user_type')
        .eq('user_id', userId)
        .single();

      if (membershipError) {
        console.error('Error fetching membership status:', membershipError.message);
        return;
      }

      console.log('Membership:', membership);  // Log the membership details

      // Check if the user is not premium
      if (membership.user_type !== 'premium') {
        document.body.classList.add('blurred');
        console.log('User type is not premium:', membership.user_type);
      } else {
        document.body.classList.remove('blurred');
        console.log('User type is premium:', membership.user_type);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
};





