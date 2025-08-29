import { useState, useEffect } from 'react'
import { createClient } from '../supabase'

export function useAdmin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])
  const [contracts, setContracts] = useState([])
  const [markets, setMarkets] = useState([])
  const [expenses, setExpenses] = useState([])
  const [settlements, setSettlements] = useState([])

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

  // Create new user (simplified - just profile, no auth user creation)
  const createUser = async (userData) => {
    try {
      setLoading(true)
      setError(null)

      // Get current user ID for created_by
      const { data: { user } } = await supabase.auth.getUser()
      
      // Create user profile only (auth user must be created separately)
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: userData.user_id || null, // Can be null if auth user not created yet
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role || 'user',
          organization: userData.organization,
          phone: userData.phone
        }])
        .select()

      if (error) throw error

      // Refresh users list
      await fetchUsers()
      return data[0]

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

  // ========================================
  // SYSTEM STATISTICS
  // ========================================

  // Get system overview
  const getSystemOverview = async () => {
    try {
      setLoading(true)
      setError(null)

      const [
        { count: usersCount },
        { count: contractsCount },
        { count: marketsCount },
        { count: expensesCount },
        { count: settlementsCount }
      ] = await Promise.all([
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('contracts').select('*', { count: 'exact', head: true }),
        supabase.from('markets').select('*', { count: 'exact', head: true }),
        supabase.from('expenses').select('*', { count: 'exact', head: true }),
        supabase.from('settlements').select('*', { count: 'exact', head: true })
      ])

      return {
        users: usersCount || 0,
        contracts: contractsCount || 0,
        markets: marketsCount || 0,
        expenses: expensesCount || 0,
        settlements: settlementsCount || 0
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

  // Initialize data
  useEffect(() => {
    // Only fetch data if user is admin
    const initData = async () => {
      try {
        const isAdmin = await isCurrentUserAdmin()
        if (isAdmin) {
          await Promise.all([
            fetchUsers(),
            fetchAllContracts(),
            fetchAllMarkets(),
            fetchAllExpenses(),
            fetchAllSettlements()
          ])
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
    contracts,
    markets,
    expenses,
    settlements,

    // User CRUD
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,

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

    // System functions
    getSystemOverview,
    isCurrentUserAdmin,
    clearError
  }
} 