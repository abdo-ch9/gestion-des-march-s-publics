"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from './supabase'
import { ClientOnly } from '../components/ui/client-only'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isConfigured, setIsConfigured] = useState(false)
  const [authError, setAuthError] = useState(null)

  // Transform Supabase user to app user with role
  const transformUser = async (supabaseUser) => {
    if (!supabaseUser) return null
    
    try {
      const supabase = createClient()
      
      if (!supabase) {
        // Fallback role assignment
        const email = supabaseUser.email?.toLowerCase() || ""
        const username = email.split("@")[0]?.toLowerCase() || ""
        
        let role = "agent"
        if (email.includes("admin") || username.includes("admin")) role = "admin"
        else if (email.includes("manager") || username.includes("manager")) role = "manager"
        
        return {
          ...supabaseUser,
          email: supabaseUser.email || "",
          role,
          name: supabaseUser.email?.split("@")[0] || "",
          id: supabaseUser.id
        }
      }
      
      // Try to get role from user_profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', supabaseUser.id)
        .single()
      
      let role = "agent" // default role
      
      if (profileData && profileData.role) {
        role = profileData.role
      } else if (profileError && profileError.code !== 'PGRST116') {
        // Fallback: try to get role from auth.users metadata
        if (supabaseUser.user_metadata && supabaseUser.user_metadata.role) {
          role = supabaseUser.user_metadata.role
        } else {
          // Last fallback: infer from email
          const email = supabaseUser.email?.toLowerCase() || ""
          const username = email.split("@")[0]?.toLowerCase() || ""
          
          if (email.includes("admin") || username.includes("admin")) role = "admin"
          else if (email.includes("manager") || username.includes("manager")) role = "manager"
          else role = "agent"
        }
      }

      return {
        ...supabaseUser,
        email: supabaseUser.email || "",
        role,
        name: supabaseUser.email?.split("@")[0] || "",
        id: supabaseUser.id
      }
    } catch (error) {
      console.error("Error transforming user:", error)
      
      // Fallback to basic role assignment
      const email = supabaseUser.email?.toLowerCase() || ""
      const username = email.split("@")[0]?.toLowerCase() || ""
      
      let role = "agent"
      if (email.includes("admin") || username.includes("admin")) role = "admin"
      else if (email.includes("manager") || username.includes("manager")) role = "manager"
      
      return {
        ...supabaseUser,
        email: supabaseUser.email || "",
        role,
        name: supabaseUser.email?.split("@")[0] || "",
        id: supabaseUser.id
      }
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const supabase = createClient()
        
        // Check Supabase configuration and provide helpful guidance
        if (!supabase) {
          console.warn('🚨 Supabase Configuration Required')
          console.warn('To fix this error, please:')
          console.warn('1. Create a .env.local file in your project root')
          console.warn('2. Add your Supabase credentials:')
          console.warn('   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
          console.warn('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
          console.warn('3. See supabase-config-example.txt for detailed instructions')
          console.warn('4. Restart your development server')
          
          setIsConfigured(false)
          setAuthError('Supabase not configured. Please check the console for setup instructions.')
          setLoading(false)
          return
        }
        
        if (supabase && supabase.auth && typeof supabase.auth.getSession === 'function') {
          setIsConfigured(true)
          setAuthError(null)
          
          // Get initial session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()
          
          if (sessionError) {
            setAuthError(sessionError.message)
            setLoading(false)
            return
          }
          
          setSession(session)
          if (session?.user) {
            const transformedUser = await transformUser(session.user)
            setUser(transformedUser)
          }
          setLoading(false)

          // Listen for auth changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              setSession(session)
              if (session?.user) {
                const transformedUser = await transformUser(session.user)
                setUser(transformedUser)
              } else {
                setUser(null)
              }
              setLoading(false)
            }
          )

          return () => subscription.unsubscribe()
        } else {
          setIsConfigured(false)
          setAuthError('Supabase not configured')
          setLoading(false)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setIsConfigured(false)
        setAuthError(error.message)
        setLoading(false)
      }
    }

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false)
        setAuthError('Authentication timeout')
      }
    }, 10000) // 10 second timeout

    initializeAuth()

    return () => clearTimeout(timeoutId)
  }, [])

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      setAuthError(null)
      
      const supabase = createClient()
      if (!supabase) {
        return { error: { message: 'Supabase not configured. Please set up your environment variables.' } }
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        setAuthError(error.message)
        setLoading(false)
        return { error }
      }
      
      if (data.user) {
        const transformedUser = await transformUser(data.user)
        setUser(transformedUser)
        setSession(data.session)
      }
      
      setLoading(false)
      return { error: null }
    } catch (error) {
      setAuthError(error.message)
      setLoading(false)
      return { error: { message: error instanceof Error ? error.message : 'Authentication error' } }
    }
  }

  const signUp = async (email, password) => {
    try {
      setLoading(true)
      setAuthError(null)
      
      const supabase = createClient()
      if (!supabase) {
        return { error: { message: 'Supabase not configured. Please set up your environment variables.' } }
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      setLoading(false)
      return { error }
    } catch (error) {
      setLoading(false)
      return { error: { message: error instanceof Error ? error.message : 'Authentication error' } }
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      if (supabase && isConfigured) {
        await supabase.auth.signOut()
      }
      setUser(null)
      setSession(null)
      setLoading(false)
    } catch (error) {
      console.error('Sign out error:', error)
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    signUp,
    isConfigured,
    authError,
  }

  return (
    <AuthContext.Provider value={value}>
      <ClientOnly fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Initialisation de l'authentification...</p>
          </div>
        </div>
      }>
        {children}
      </ClientOnly>
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 