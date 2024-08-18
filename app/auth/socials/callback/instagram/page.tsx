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

          const data = await getLongLivedToken(accessToken)
          
          const success =  await addInstagramAccount(data.access_token)

          if (success) {
            alert('Account Connected Successfully, Please re-login');
            router.push('/landing');

          } else {  

            router.push('./error?message=Account Onboarding Failed');
          }

        } else {
          router.push('./error?message=Error connecting to Instagram account');

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
