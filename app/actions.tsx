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