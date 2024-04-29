import FetchDataSteps from '@/components/tutorial/FetchDataSteps'
import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabase = createClient()
  const { data: user_reports } = await supabase.from('user_reports').select()

  return <pre>{JSON.stringify(user_reports, null, 2)}</pre>
}