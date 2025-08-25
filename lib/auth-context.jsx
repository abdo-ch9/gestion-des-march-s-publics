"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from './supabase'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isConfigured, setIsConfigured] = useState(false)

  // Transform Supabase user to app user with role
  const transformUser = async (supabaseUser) => {
    if (!supabaseUser) return null
    
    try {
      // Try to get the real role from user_profiles table in Supabase
      const supabase = createClient()
      
      // First, try to get role from user_profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', supabaseUser.id)
        .single()
      
      let role = "agent" // default role
      
      if (profileData && profileData.role) {
        // Use the role from the database
        role = profileData.role
        console.log("Role found in user_profiles:", role)
      } else if (profileError && profileError.code !== 'PGRST116') {
        // PGRST116 means "no rows returned", which is expected if table doesn't exist
        console.log("Profile error (table might not exist):", profileError.message)
        
        // Fallback: try to get role from auth.users metadata
        if (supabaseUser.user_metadata && supabaseUser.user_metadata.role) {
          role = supabaseUser.user_metadata.role
          console.log("Role found in user_metadata:", role)
        } else {
          // Last fallback: infer from email (temporary solution)
          const email = supabaseUser.email?.toLowerCase() || ""
          const username = email.split("@")[0]?.toLowerCase() || ""
          
          if (email.includes("admin") || username.includes("admin")) role = "admin"
          else if (email.includes("manager") || username.includes("manager")) role = "manager"
          else role = "agent"
          
          console.log("Role inferred from email (fallback):", role)
        }
      }
      
      console.log("Final assigned role:", role)

      return {
        // Keep original Supabase user properties for compatibility
        ...supabaseUser,
        // Override with our custom properties
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
        // Keep original Supabase user properties for compatibility
        ...supabaseUser,
        // Override with our custom properties
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
        
        // Check if this is a real Supabase client or fallback
        if (supabase.auth && typeof supabase.auth.getSession === 'function') {
          setIsConfigured(true)
          
          // Get initial session
          const { data: { session } } = await supabase.auth.getSession()
          setSession(session)
          setUser(await transformUser(session?.user))
          setLoading(false)

          // Listen for auth changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              setSession(session)
              setUser(await transformUser(session?.user))
              setLoading(false)
            }
          )

          return () => subscription.unsubscribe()
        } else {
          // Fallback mode - no authentication
          setIsConfigured(false)
          setLoading(false)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setIsConfigured(false)
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const signIn = async (email, password) => {
    try {
      const supabase = createClient()
      if (!isConfigured) {
        return { error: { message: 'Supabase not configured. Please set up your environment variables.' } }
      }
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      return { error: { message: error instanceof Error ? error.message : 'Authentication error' } }
    }
  }

  const signUp = async (email, password) => {
    try {
      const supabase = createClient()
      if (!isConfigured) {
        return { error: { message: 'Supabase not configured. Please set up your environment variables.' } }
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { error }
    } catch (error) {
      return { error: { message: error instanceof Error ? error.message : 'Authentication error' } }
    }
  }

  const signOut = async () => {
    try {
      const supabase = createClient()
      if (isConfigured) {
        await supabase.auth.signOut()
      }
    } catch (error) {
      console.error('Sign out error:', error)
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
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
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