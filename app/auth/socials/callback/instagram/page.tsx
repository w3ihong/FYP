'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setAccessToken } from '../../actions';
import { getLongLivedToken } from '../../actions';

export default function InstagramConnectRedirect() {
  const router = useRouter();

  useEffect(() => {
    const fetchAndSetAccessToken = async () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        const accessToken = params.get('access_token');
        const accessExpirationTime = params.get('data_access_expiration_time');
        const expiresIn = params.get('expires_in');
        const longLiveToken = params.get('long-lived-token');
        
        console.log('Access Token:', accessToken);
        console.log('Data Access Expiration Time:', accessExpirationTime);
        console.log('Expires In:', expiresIn);
        console.log('Long Live Token:', longLiveToken);

        if (accessToken) {
          // Store the token in local storage or handle it accordingly

          // Store the user's access token
          if (longLiveToken == null ) {
            await setAccessToken(accessToken, 'Instagram')
            // const data = await getLongLivedToken(accessToken)
            // console.log(JSON.stringify(data))
            // console.log(data)
          }
          
          await setAccessToken(longLiveToken, 'Instagram');

          // Redirect to another page or handle the token further
          router.push('/protected');
        }
      }
    };

    fetchAndSetAccessToken();
  }, [router]);

  return <div>Connecting ...</div>;
}

