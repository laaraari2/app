
import { supabase } from './supabase';

export async function testSupabaseConnection() {
  const { error } = await supabase
    .from('institutions')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Supabase connection/query failed:', error.message);
    return false;
  }

  console.log('Supabase query succeeded.');
  return true;
}
