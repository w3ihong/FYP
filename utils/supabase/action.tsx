import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// Function to fetch post metrics
export const fetchPostMetrics = async () => {
  try {
    const { data, error } = await supabase
      .from('post_metrics')
      .select('*')
      .order('date_retrieved', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching post metrics:', error.message);
    return null;
  }
};
