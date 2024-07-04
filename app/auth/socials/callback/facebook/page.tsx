'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setAccessToken } from '../../actions';
import { getLongLivedToken } from '../../actions';

export default async function InstagramConnectRedirect() {
  

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
