'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addInstagramAccount } from '../../actions';
import { getLongLivedToken } from '../../actions';

export default async function InstagramConnectRedirect() {
  const router = useRouter();

  useEffect(() => {
    const fetchAndSetAccessToken = async () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        const accessToken = params.get('access_token');
        const accessExpirationTime = params.get('data_access_expiration_time');
        const expiresIn = params.get('expires_in');
        const longLiveToken = params.get('long_lived_token');

        console.log("access token : "+accessToken)
        console.log("access token : "+accessExpirationTime)
        console.log("access token : "+expiresIn)
        console.log("long lived token : "+longLiveToken)

        if (accessToken) {

          // Store the user's access token
          // if (longLiveToken == null ) {
            // await setAccessToken(accessToken, 'Instagram')
            const data = await getLongLivedToken(accessToken)
            console.log("exchanged long lived toekn " + data)
            
            await addInstagramAccount(data.access_token)

          // } else {

          //   await addInstagramAccount(longLiveToken);
          // }
          
          // Redirect to another page or handle the token further
          router.push('/protected');
        } else {
          router.push('./error')

        }
      }
    };

    fetchAndSetAccessToken();
  }, [router]);

  return (
    
      <div className='w-full h-screen flex justify-center '>
        <div className='self-center flex'>
          {/* spin loader */}
          <div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-8 border-t-accent place-self-center" />
          <h1 className='pl-2 text-xl w-max place-self-center '>Fetching account data ...</h1>  
        </div>

      </div>

  )
}
