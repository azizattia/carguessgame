// Temporarily disabled Supabase to debug
console.log('Supabase temporarily disabled for debugging');

// Mock Supabase client
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } }
    }),
    signUp: async () => ({ data: null, error: 'Supabase disabled' }),
    signInWithPassword: async () => ({ data: null, error: 'Supabase disabled' }),
    signOut: async () => ({ error: null })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null })
      })
    }),
    insert: () => ({
      select: async () => ({ data: null, error: null })
    })
  }),
  rpc: async () => ({ data: [], error: null })
};
