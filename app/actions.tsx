'use server'


import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createAdminClient, createClient } from '@/utils/supabase/server'
import nodemailer from 'nodemailer';

const otpStore = new Map();


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

  //console.log(authData?.user?.id);

  const value = authData?.user?.id;

  await insertUserData(value);
  
  


  if (authError) {
    redirect('/landing/login?message=Email or password is incorrect');
    return;
  }

  // If authentication is successful, check if the user account is disabled
  const user = authData.user;
  const { data: foundUser, error: findError } = await supabase
    .from('users')
    .select('disabled, FA , suspended')
    .eq('user_id', user.id)
    .single();

  if (findError) {
    console.error('Error checking user status:', findError.message);
   // redirect('/landing/login?message=An error occurred while checking user status');
    return;
  }

  

  if (foundUser.disabled) {
    console.log('User account is disabled');
    await enableUser();
 //   redirect('/landing/login?message=Your account is disabled');
 //   return;
  }

  if (foundUser['FA']) {
    console.log('2FA is enabled for this account');
    console.log(otpStore);
    const isVerify = await verifyOTP(data.email , otpStore);

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
  
  const userId = userResponse.data.user.id;

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
  } catch (error) {
    console.error('Error fetching billing details:', error.message);
    return null;
  }
}

export async function updateCardDetails(cardDetails: any): Promise<void> {
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
        postalcode: cardDetails.postalcode,
      })
      .eq('user_id', userId); // Use the actual user ID

    if (error) {
      throw error;
    }

    // Handle success
    console.log('Card details updated successfully:', data);
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
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

export async function verifyOTP(email, inputOtp) {
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


export async function checkOTP(email, inputOtp) {
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

export async function fetchUsers() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('users') // Replace 'users' with your actual table name
      .select('user_id  , name , disabled');
      

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














