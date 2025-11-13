import { createClient } from '@supabase/supabase-js';

console.log('Loading Supabase with hardcoded credentials...');

// Hardcoded credentials (temporary fix for env variable loading issue)
const supabaseUrl = 'https://yaixoliparazhkrjgxpv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaXhvbGlwYXJhemhrcmpneHB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMDM1NzcsImV4cCI6MjA3ODU3OTU3N30.Uv-SoDF7bQyHC_Q5u_1hofhD883Nuqs2e0PRedvo48g';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey ? 'SET' : 'NOT SET');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Supabase client created successfully!');
