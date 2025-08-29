import { useState, useEffect } from 'react'
import { createClient } from '../supabase'

export function useAdmin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])
  // Comment out other state variables for now
  // const [contracts, setContracts] = useState([])
  // const [markets, setMarkets] = useState([])
  // const [expenses, setExpenses] = useState([])
  // const [settlements, setSettlements] = useState([])

  const supabase = createClient()

  // ========================================
  // USER MANAGEMENT CRUD
  // ========================================

  // Get all users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
      return data

    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Create new user (creates both auth user and profile)
  const createUser = async (userData) => {
    try {
      setLoading(true)
      setError(null)

      console.log('Creating user with data:', { ...userData, password: '***' })

      // Step 1: Create the user profile first (without auth user link)
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: null, // Will be updated after auth user creation
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role || 'agent',
          department: userData.department,
          phone: userData.phone,
          status: userData.status || 'active',
          password: userData.password // Store password for reference
        }])
        .select()

      if (profileError) {
        console.error('Profile creation failed:', profileError)
        throw new Error(`Failed to create user profile: ${profileError.message}`)
      }

      console.log('User profile created:', profileData[0])

      // Step 2: Try to create auth user using admin API
      let authUserId = null
      try {
        console.log('Attempting to create auth user with admin API...')
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true,
          user_metadata: {
            full_name: userData.full_name,
            role: userData.role,
            department: userData.department
          }
        })

        if (authError) {
          console.warn('Admin API failed:', authError.message)
          throw authError
        }

        authUserId = authData.user.id
        console.log('Auth user created successfully via admin API:', authUserId)

      } catch (adminError) {
        console.log('Admin API failed, trying alternative method...')
        
        // Alternative: Use the service role key directly
        try {
          // Create a new Supabase client with service role key for admin operations
          const { createClient } = await import('@supabase/supabase-js')
          
          // You'll need to add this environment variable
          const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || 
                                process.env.SUPABASE_SERVICE_ROLE_KEY
          
          if (!serviceRoleKey) {
            console.warn('No service role key available, creating profile-only user')
            // Update profile to indicate no auth user
            await supabase
              .from('user_profiles')
              .update({ 
                user_id: null,
                status: 'pending_auth' // Special status for users without auth
              })
              .eq('id', profileData[0].id)
            
            await fetchUsers()
            return profileData[0]
          }

          const adminSupabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            serviceRoleKey,
            {
              auth: {
                autoRefreshToken: false,
                persistSession: false
              }
            }
          )

          const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
            email: userData.email,
            password: userData.password,
            email_confirm: true,
            user_metadata: {
              full_name: userData.full_name,
              role: userData.role,
              department: userData.department
            }
          })

          if (authError) {
            console.error('Service role auth creation failed:', authError)
            throw authError
          }

          authUserId = authData.user.id
          console.log('Auth user created successfully via service role:', authUserId)

        } catch (serviceError) {
          console.error('All auth creation methods failed:', serviceError)
          
          // Last resort: Create a note in the profile about the issue
          await supabase
            .from('user_profiles')
            .update({ 
              status: 'auth_creation_failed',
              password: `${userData.password} (AUTH_CREATION_FAILED)`
            })
            .eq('id', profileData[0].id)
          
          await fetchUsers()
          throw new Error(`User profile created but authentication setup failed. Please contact administrator. Error: ${serviceError.message}`)
        }
      }

      // Step 3: Update the profile with the auth user ID
      if (authUserId) {
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ user_id: authUserId })
          .eq('id', profileData[0].id)

        if (updateError) {
          console.warn('Failed to link profile to auth user:', updateError)
        } else {
          console.log('Profile successfully linked to auth user')
        }
      }

      // Refresh users list
      await fetchUsers()
      return profileData[0]

    } catch (err) {
      console.error('Error creating user:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update user
  const updateUser = async (userId, updates) => {
    try {
      setLoading(true)
      setError(null)

      // Get the current user data to check if we need to update auth
      const { data: currentUser } = await supabase
        .from('user_profiles')
        .select('user_id, email, password')
        .eq('id', userId)
        .single()

      // If password is being updated and user has an auth account, update auth user
      if (updates.password && currentUser?.user_id && updates.password !== currentUser.password) {
        try {
          // Update the auth user's password
          const { error: authError } = await supabase.auth.admin.updateUserById(
            currentUser.user_id,
            { password: updates.password }
          )
          
          if (authError) {
            console.warn('Failed to update auth user password:', authError.message)
          }
        } catch (authErr) {
          console.warn('Auth user password update failed:', authErr.message)
        }
      }

      // Update the user profile
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()

      if (error) throw error

      // Refresh users list
      await fetchUsers()
      return data[0]

    } catch (err) {
      console.error('Error updating user:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete user (simplified - just profile deletion)
  const deleteUser = async (userId) => {
    try {
      setLoading(true)
      setError(null)

      // Delete from user_profiles only
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId)

      if (error) throw error

      // Refresh users list
      await fetchUsers()
      return true

    } catch (err) {
      console.error('Error deleting user:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ========================================
  // COMMENTED OUT OTHER FUNCTIONALITY FOR NOW
  // ========================================
  // We'll uncomment these as we set up the other tables

  /*
  // ========================================
  // CONTRACT MANAGEMENT CRUD
  // ========================================

  // Get all contracts (admin can see all)
  const fetchAllContracts = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          markets (
            id,
            title,
            description,
            budget,
            currency,
            status
          ),
          user_profiles!contracts_created_by_fkey (
            id,
            full_name,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setContracts(data || [])
      return data

    } catch (err) {
      console.error('Error fetching contracts:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update contract
  const updateContract = async (contractId, updates) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('contracts')
        .update(updates)
        .eq('id', contractId)
        .select()

      if (error) throw error

      // Refresh contracts list
      await fetchAllContracts()
      return data[0]

    } catch (err) {
      console.error('Error updating contract:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete contract
  const deleteContract = async (contractId) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', contractId)

      if (error) throw error

      // Refresh contracts list
      await fetchAllContracts()
      return true

    } catch (err) {
      console.error('Error deleting contract:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ========================================
  // MARKET MANAGEMENT CRUD
  // ========================================

  // Get all markets (admin can see all)
  const fetchAllMarkets = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('markets')
        .select(`
          *,
          user_profiles!markets_created_by_fkey (
            id,
            full_name,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMarkets(data || [])
      return data

    } catch (err) {
      console.error('Error fetching markets:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Create market
  const createMarket = async (marketData) => {
    try {
      setLoading(true)
      setError(null)

      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('markets')
        .insert([{
          ...marketData,
          created_by: user?.id
        }])
        .select()

      if (error) throw error

      // Refresh markets list
      await fetchAllMarkets()
      return data[0]

    } catch (err) {
      console.error('Error creating market:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update market
  const updateMarket = async (marketId, updates) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('markets')
        .update(updates)
        .eq('id', marketId)
        .select()

      if (error) throw error

      // Refresh markets list
      await fetchAllMarkets()
      return data[0]

    } catch (err) {
      console.error('Error updating market:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete market
  const deleteMarket = async (marketId) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('markets')
        .delete()
        .eq('id', marketId)

      if (error) throw error

      // Refresh markets list
      await fetchAllMarkets()
      return true

    } catch (err) {
      console.error('Error deleting market:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ========================================
  // EXPENSE MANAGEMENT CRUD
  // ========================================

  // Get all expenses (admin can see all)
  const fetchAllExpenses = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          contracts (
            id,
            number,
            subject
          ),
          user_profiles!expenses_created_by_fkey (
            id,
            full_name,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setExpenses(data || [])
      return data

    } catch (err) {
      console.error('Error fetching expenses:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update expense
  const updateExpense = async (expenseId, updates) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', expenseId)
        .select()

      if (error) throw error

      // Refresh expenses list
      await fetchAllExpenses()
      return data[0]

    } catch (err) {
      console.error('Error updating expense:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete expense
  const deleteExpense = async (expenseId) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId)

      if (error) throw error

      // Refresh expenses list
      await fetchAllExpenses()
      return true

    } catch (err) {
      console.error('Error deleting expense:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ========================================
  // SETTLEMENT MANAGEMENT CRUD
  // ========================================

  // Get all settlements (admin can see all)
  const fetchAllSettlements = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('settlements')
        .select(`
          *,
          contracts (
            id,
            number,
            subject
          ),
          user_profiles!settlements_created_by_fkey (
            id,
            full_name,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSettlements(data || [])
      return data

    } catch (err) {
      console.error('Error fetching settlements:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Create settlement
  const createSettlement = async (settlementData) => {
    try {
      setLoading(true)
      setError(null)

      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('settlements')
        .insert([{
          ...settlementData,
          created_by: user?.id
        }])
        .select()

      if (error) throw error

      // Refresh settlements list
      await fetchAllSettlements()
      return data[0]

    } catch (err) {
      console.error('Error creating settlement:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update settlement
  const updateSettlement = async (settlementId, updates) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('settlements')
        .update(updates)
        .eq('id', settlementId)
        .select()

      if (error) throw error

      // Refresh settlements list
      await fetchAllSettlements()
      return data[0]

    } catch (err) {
      console.error('Error updating settlement:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete settlement
  const deleteSettlement = async (settlementId) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('settlements')
        .delete()
        .eq('id', settlementId)

      if (error) throw error

      // Refresh settlements list
      await fetchAllSettlements()
      return true

    } catch (err) {
      console.error('Error deleting settlement:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }
  */

  // ========================================
  // SYSTEM STATISTICS
  // ========================================

  // Get system overview (simplified for now)
  const getSystemOverview = async () => {
    try {
      setLoading(true)
      setError(null)

      const { count: usersCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      return {
        users: usersCount || 0,
        contracts: 0, // Will be updated when contracts table is set up
        markets: 0,   // Will be updated when markets table is set up
        expenses: 0,  // Will be updated when expenses table is set up
        settlements: 0 // Will be updated when settlements table is set up
      }

    } catch (err) {
      console.error('Error getting system overview:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  // Check if current user is admin
  const isCurrentUserAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return false

      const { data } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      return data?.role === 'admin'
    } catch (err) {
      console.error('Error checking admin status:', err)
      return false
    }
  }

  // Clear error
  const clearError = () => setError(null)

  // Initialize data (simplified for now)
  useEffect(() => {
    // Only fetch users data for now
    const initData = async () => {
      try {
        const isAdmin = await isCurrentUserAdmin()
        if (isAdmin) {
          await fetchUsers()
        }
      } catch (error) {
        console.error('Error initializing admin data:', error)
        setError('Failed to initialize admin dashboard')
      }
    }

    initData()
  }, [])

  return {
    // State
    loading,
    error,
    users,
    // contracts: [], // Will be uncommented when contracts table is set up
    // markets: [],   // Will be uncommented when markets table is set up
    // expenses: [],  // Will be uncommented when expenses table is set up
    // settlements: [], // Will be uncommented when settlements table is set up

    // User CRUD
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,

    // Commented out for now - will be uncommented as tables are set up
    /*
    // Contract CRUD
    fetchAllContracts,
    updateContract,
    deleteContract,

    // Market CRUD
    fetchAllMarkets,
    createMarket,
    updateMarket,
    deleteMarket,

    // Expense CRUD
    fetchAllExpenses,
    updateExpense,
    deleteExpense,

    // Settlement CRUD
    fetchAllSettlements,
    createSettlement,
    updateSettlement,
    deleteSettlement,
    */

    // System functions
    getSystemOverview,
    isCurrentUserAdmin,
    clearError
  }
} 