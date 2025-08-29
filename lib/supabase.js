import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we're in development mode and Supabase is not configured
const isDevelopment = process.env.NODE_ENV === 'development'
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey

// Singleton pattern to prevent multiple client instances
let supabaseClient = null

// Log configuration status in development
if (isDevelopment) {
  if (isSupabaseConfigured) {
    console.log('✅ Supabase configured successfully')
  } else {
    console.log('🚨 Supabase not configured')
    console.log('📝 Please create a .env.local file with your Supabase credentials')
    console.log('📚 See SETUP_GUIDE.md for complete instructions')
  }
}

export const createClient = () => {
  if (!isSupabaseConfigured) {
    if (isDevelopment) {
      // In development, return a mock client that won't crash
      console.warn('⚠️ Supabase not configured. Running in fallback mode.')
      console.warn('Please create a .env.local file with the following variables:')
      console.warn('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url')
      console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
      console.warn('See supabase-config-example.txt for detailed instructions.')
      return null
    } else {
      throw new Error('Supabase environment variables are not configured. Please check your .env.local file.')
    }
  }
  
  // Return existing client if already created
  if (supabaseClient) {
    return supabaseClient
  }
  
  try {
    // Create new client only once
    supabaseClient = createClientComponentClient()
    return supabaseClient
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    return null
  }
}

// Export a direct reference for components that need it
export const supabase = createClient() 