'use server'
import { createClient } from '@/utils/supabase/server';
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
        console.log ("no existing accounts")

        const pageData = await getPageDetails(accessToken);
        console.log(pageData)
        console.log("page ID :" + pageData.data[0].id)
        const IGAccdata = await getConnectedIGAcc(pageData.data[0].id,accessToken)
        console.log(IGAccdata)
        //get 
        await insertNewAcc(IGAccdata.instagram_business_account.id,accessToken, "Instagram", user.id, "self")
    } else {
        console.log("matching acc found")
        await updateToken(accessToken, "Instagram", user.id)
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
     
export async function insertNewAcc(accountID: number ,accessToken: string , platform : string , userID :any , accountName :string) {
    const supabase = createClient()


    //get platform acc id
    const { data, error } = await supabase
        .from('platform_account')
        .insert([
            { platform_account_id: accountID, user_id: userID,  platform: platform, access_token :accessToken, client_name: accountName},
        ])
        .select()

    console.log(JSON.stringify(data))

    if (error) {
        console.error('Error updating platform account:', error);
    } else {
        console.log('Updated platform account:', data);
    }

}

export async function getPageDetails(accessToken:string ) {
    const endpoint = `https://graph.facebook.com/v20.0/me/accounts?access_token=${accessToken}`

    const response = await axios.get(endpoint)
    return response.data
}

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

//not yet implemented/used
export async function getLongLivedPageToken(app_scoped_user_id: string, longLivedUserAccessToken: string ) {
    const endpoint = `https://graph.facebook.com/v20.0/
        ${app_scoped_user_id}/accounts?
        access_token=${longLivedUserAccessToken}`
}

export async function getConnectedIGAcc(pageID:number, accessToken:string) {
    const endpoint = `https://graph.facebook.com/v20.0/${pageID}?fields=instagram_business_account&access_token=${accessToken}`
    const response = await axios.get(endpoint)
    console.log(response)
    if (response.status == 200) {
        return response.data
    } else {
        console.log("error processing request")
    }
}

export async function getIGAccDetails(accID :number, accessToken:string) {
    const fields = ''
    const endpoint = `https://graph.facebook.com/v20.0/${accID}
        ?fields=${fields}
        &access_token=${accessToken}`
}

export async function getIGMediaObj(accountID :number , accessToken:string) {
    const supabase = createClient()
    const endpoint = `https://graph.facebook.com/v20.0/${accountID}/media?access_token=${accessToken}`
    const resposne = await axios.get(endpoint)

    const ids = resposne.data.map(item => item.id);

  for (const id of ids) {
    const { error } = await supabase
      .from('') // Replace with your table name
      .insert({ id });

  }

}
