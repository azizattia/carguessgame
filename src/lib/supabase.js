import { createClient } from '@supabase/supabase-js';

console.log('Environment check:');
console.log('import.meta.env:', import.meta.env);
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('supabaseUrl:', supabaseUrl);
console.log('supabaseAnonKey:', supabaseAnonKey ? 'SET' : 'NOT SET');

if (!supabaseUrl) {
  console.error('ERROR: supabaseUrl is undefined!');
}

if (!supabaseAnonKey) {
  console.error('ERROR: supabaseAnonKey is undefined!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
