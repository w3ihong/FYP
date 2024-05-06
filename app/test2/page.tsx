'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import Link from 'next/link'

export default function Page() {
  const [user_reports, setNotes] = useState<any[] | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from('user_reports').select()
      setNotes(data)
    }
    getData()
  }, [])

  return ( 
  <div>
  <pre>{JSON.stringify(user_reports, null, 2)}</pre>
  
  <Link href="/">
        <Button children="go back" />
      </Link>
      </div>
  );
}
