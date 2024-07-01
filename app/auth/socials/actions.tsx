'use server'
import { createClient } from '@/utils/supabase/server';
import axios from 'axios';

export async function setAccessToken(accessToken:string , platform: string) {
    const supabase = createClient();  
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    console.log(user.id)
    
    if (userError || !user) {
        console.error('Error fetching user or no user found:', userError);
        return;
    }
    // check if account already exists in data base 
    const { data , error } = await supabase
        .from('platform_account')
        .select("*")
        .eq('user_id', user.id)
        .eq("platform", platform)
        
    console.log(JSON.stringify(data))

    if (data.length === 0) {
        console.log ("no existing accounts")
        await insertNewAcc(accessToken, platform, user.id)
    } else {
        console.log("matching acc found")
        await updateToken(accessToken, platform, user.id)
    }

};
  
export async function updateToken(accessToken :string , platform :string , userID : any) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('platform_account')
        .update({ access_token: accessToken })
        .eq('user_id', userID)
        .eq('platform', platform)
        .select();

    console.log(JSON.stringify(data))

    if (error) {
        console.error('Error updating platform account:', error);
    } else {
        console.log('Updated platform account:', data);
    }
}
     
export async function insertNewAcc(accessToken: string , platform : string , userID :any) {
    const supabase = createClient()


    //get platform acc id
    const { data, error } = await supabase
        .from('platform_account')
        .insert([
            { platform_account_id: '1234567890', user_id: userID,  platform: platform, access_token :accessToken, client_name: "self" },
        ])
        .select()

    console.log(JSON.stringify(data))

    if (error) {
        console.error('Error updating platform account:', error);
    } else {
        console.log('Updated platform account:', data);
    }

}

//has errors
export async function getLongLivedToken(accessToken: string) {
    const APPID = '2153953224988805'
    const APPSECRET = '5e5874258a0f788689edadaadfb3b6a4'
    const lltURL = `https://graph.facebook.com/v20.0/oauth/access_token?
        grant_type=fb_exchange_token&
        client_id=${APPID}&
        client_secret=${APPSECRET}&
        fb_exchange_token=${accessToken}`
    
    try {
        const data = await axios.get(lltURL)
        return data
    } catch (error) {
        console.error('There has been a problem with your axios operation:', error);
        throw error;
    }
    

}

export async function getLongLivedPageToken(userID: string, longLivedUserAccessToken: string ) {
    const endpoint = `https://graph.facebook.com/v20.0/
        ${userID}/accounts?
        access_token=${longLivedUserAccessToken}`

}