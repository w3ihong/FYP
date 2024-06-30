'use server'
import { createClient } from '@/utils/supabase/client';

export async function setAccessToken(accessToken:string , platform: string) {
    const supabase = createClient();  
    const user  = await supabase.auth.getUser();
    

    // const userID = (await (supabase.auth.getUser())).data.user.id;

    // const { data, error } = await supabase
    //       .from('platform_account')
    //       .update({ 'access_token': accessToken })
    //       .eq('user_id', userID)
    //       .eq('platform', platform)
    //       .select();

    // console.log(data)
    // console.log(error)
    
    return 
}   