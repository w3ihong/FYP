'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setAccessToken } from '../../actions';



export default function  InstagramConnectRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const accessToken = params.get('access_token');
      const accessExiprationTime = params.get('data_access_expiration_time');
      const expiresIn = params.get('expires_in');
      const longLiveToken = params.get('long-lived-token')

      if (accessToken) {
        // Store the token in local storage or handle it accordingly
        console.log('Access Token:', accessToken);
        console.log('Data Access Expiration Time:', accessExiprationTime);
        console.log('Expires In:', expiresIn);
        console.log('long live token ', longLiveToken)

        //get user's accounts

        //store the user's access token
        setAccessToken(longLiveToken,'Instagram')
        // Redirect to another page or handle the token further
        router.push('/protected');
      }
    }
  }, [router]);

  return <div>Connecting ...</div>;
};