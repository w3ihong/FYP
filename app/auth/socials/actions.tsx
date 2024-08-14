'use server'

import { createClient } from '@/utils/supabase/server';
import { supabase } from '@/utils/supabase/client';
import axios from 'axios';

export async function addInstagramAccount(accessToken:string) {
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
        .eq("platform", "Instagram")
        
    console.log(JSON.stringify(data))

    if (data.length === 0) {
        // perfrom onboarding process
        //
        console.log ("no existing accounts")

        const detailsData = await getAssociatedDetails(accessToken);
        const platform_account_id = detailsData.data[0].instagram_business_account.id
        const IGAccDetails = await getIGAccDetails(platform_account_id, accessToken)
        const AccountSuccess = await insertNewAcc(IGAccDetails.id,accessToken, "Instagram", user.id, IGAccDetails.username, IGAccDetails.profile_picture_url)
        // await loadIGMediaObj(IGAccDetails.id, accessToken)
        const triggerOnboardEndpoint = `https://fyp-ml-ejbkojtuia-ts.a.run.app/onboard_account/${platform_account_id}`
        const response = await axios.post(triggerOnboardEndpoint)
        if (response.data == true && AccountSuccess == true) {
            return true
        } else {
            return false 
        }
    } else {
        // update only the access token
        console.log("matching acc found")
        try {
            await updateToken(accessToken, "Instagram", user.id)
        } catch (error) {
            console.error('Error updating platform account:', error);

            return false
        }
        return true
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

export async function insertNewAcc(accountID: number ,accessToken: string , platform : string , userID :any , accountName :string , profilePicURL :string) {
    const supabase = createClient()

    //get platform acc id
    const { data, error } = await supabase
        .from('platform_account')
        .insert([
            { platform_account_id: accountID, user_id: userID,  platform: platform, access_token :accessToken, client_name: accountName , profile_picture_url: profilePicURL},
        ])
        .select()

    if (error) {
        console.error('Error updating platform account:', error);
        return false
    } else {
        console.log('Updated platform account:', data);
        return true
    }
}

export async function getAssociatedDetails(accessToken:string ) {
    const endpoint = `https://graph.facebook.com/v20.0/me/accounts?fields=id%2Cname%2Caccess_token%2Cinstagram_business_account&access_token=${accessToken}`
    const response = await axios.get(endpoint)
    return response.data
}


export const getDemographicsData = async (platformAccountId, viewType, timeframe) => {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error fetching authenticated user:', userError.message);
      return { error: 'User not authenticated' };
    }
  
    const userId = user?.id;
  
    if (!userId) {
      console.error('User ID not found');
      return { error: 'User ID not found' };
    }
  
    const { data, error } = await supabase
      .from('platform_account')
      .select('platform_account_id')
      .eq('user_id', userId);
  
    if (error || !data.length) {
      console.error('Error fetching platform accounts:', error);
      return { error: 'No platform accounts found' };
    }
  
    const account = data.find(account => account.platform_account_id === platformAccountId);
  
    if (!account) {
      console.error('Platform account not found for user');
      return { error: 'Platform account not found for user' };
    }
  
    try {
      const response = await fetch(`https://fyp-ml-ejbkojtuia-ts.a.run.app/demographics/${platformAccountId}?type=${viewType}&timeframe=${timeframe}`);
      const demographicsData = await response.json();
      
      if (demographicsData.error) {
        console.error('Error fetching demographics:', demographicsData.error.message);
        return { error: demographicsData.error.message };
      }
  
      return demographicsData;
    } catch (error) {
      console.error('Error fetching demographics:', error);
      return { error: 'Failed to fetch demographics data' };
    }
  };

  export const getFollowersDemographics = async (platformAccountId) => {
    try {
      const { data: demographicsData, error: demographicsError } = await supabase
        .from('follower_demographics')
        .select('*')
        .eq('platform_account', platformAccountId)
        .order('date_retrieved', { ascending: false })
        .limit(1);
  
      if (demographicsError || !demographicsData.length) {
        console.error('Error fetching follower demographics:', demographicsError);
        return { error: 'No follower demographics found' };
      }
  
      return demographicsData[0];
    } catch (error) {
      console.error('Error fetching follower demographics:', error);
      return { error: 'Failed to fetch follower demographics' };
    }
  };
  
  

export async function getLongLivedToken(accessToken: string) {
    const APPID = '2153953224988805'
    const APPSECRET = '5e5874258a0f788689edadaadfb3b6a4'
    const endpoint = `https://graph.facebook.com/v20.0/oauth/access_token?
        grant_type=fb_exchange_token&
        client_id=${APPID}&
        client_secret=${APPSECRET}&
        fb_exchange_token=${accessToken}`
    
    const response = await axios.get(endpoint)
    
    return response.data
}


export async function getConnectedIGAcc(pageID:number, accessToken:string) {
    const endpoint = `https://graph.facebook.com/v20.0/${pageID}?fields=instagram_business_account&access_token=${accessToken}`
    
    const response = await axios.get(endpoint)
    if (response.status == 200) {       
        return response.data
    } else {
        console.log("error processing request")
    }
}

export async function getIGAccDetails(accID :number, accessToken:string) {
    const fields = "id,profile_picture_url,name,username"
    const endpoint  = `https://graph.facebook.com/v20.0/${accID}?fields=id,profile_picture_url,name,username&access_token=${accessToken}`
    
    const response = await axios.get(endpoint)

    return response.data
}

// export async function loadIGMediaObj(accID :number , accessToken:string) {
//     const supabase = createClient()
//     const endpoint = `https://graph.facebook.com/v20.0/${accID}/media?access_token=${accessToken}`
//     const response = await axios.get(endpoint)

//     const ids = response.data.data.map(item => item.id);
//     console.log(response.data)
//     console.log(ids)
//     for (const id of ids) {
//         //get media metadata 
//         const data = await getIGMediaData(id, accessToken)

//         //add to posts table
//         const { data: postData, error: postError } = await supabase
//             .from('posts')
//             .insert([
//                 { platform_account: accID, id: data.id, post_type: data.media_type, media_url: data.media_url, permalink: data.permalink, caption: data.caption, created_at: data.timestamp}
//             ])
//             .select()

//         if (postError) {
//             console.error('Error inserting post:', postError);
//         } else {
//             console.log('Inserted post:', postData);
//         }
//     }
// }

// export async function getIGMediaData(mediaID :number, accessToken:string){
//     const fields = `id,media_type,media_url,thumbnail_url,permalink,caption,timestamp`
//     const endpoint = `https://graph.facebook.com/v20.0/${mediaID}?fields=${fields}&access_token=${accessToken}`
//     const response = await axios.get(endpoint)

//     if (response.status == 200) {
//         return response.data
//     } else {
//         console.log("error processing request")
//     }
    
// }



