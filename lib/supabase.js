import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we're in development mode and Supabase is not configured
const isDevelopment = process.env.NODE_ENV === 'development'
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey

// Only create the client if environment variables are available
export const supabase = isSupabaseConfigured
  ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
  : null

export const createClient = () => {
  if (!isSupabaseConfigured) {
    if (isDevelopment) {
      // In development, return a mock client that won't crash
      console.warn('⚠️ Supabase not configured. Running in fallback mode. Please set up your environment variables.')
      return {
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: async () => ({ error: { message: 'Supabase not configured' } }),
          signUp: async () => ({ error: { message: 'Supabase not configured' } }),
          signOut: async () => ({ error: null }),
        }
      }
    } else {
      throw new Error('Supabase environment variables are not configured. Please check your .env.local file.')
    }
  }
  return createClientComponentClient()
} 