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