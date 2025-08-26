import { useState, useEffect } from 'react'
import { createClient } from '../supabase'
import { useAuth } from '../auth-context'

export function useMarkets() {
  const [markets, setMarkets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const supabase = createClient()

  // Fetch all markets
  const fetchMarkets = async () => {
    if (!supabase) {
      console.warn('Supabase client not available')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('markets')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Erreur lors du chargement des marchés')
      }
      
      setMarkets(data || [])
    } catch (err) {
      console.error('Error fetching markets:', err)
      setError(err.message || 'Erreur inconnue lors du chargement des marchés')
    } finally {
      setLoading(false)
    }
  }

  // Add a new market
  const addMarket = async (marketData) => {
    if (!supabase) {
      throw new Error('Client Supabase non configuré')
    }
    
    if (!user) {
      throw new Error('Utilisateur non authentifié')
    }
    
    setLoading(true)
    setError(null)
    
    try {
      console.log('Adding market with data:', marketData)
      console.log('User ID:', user.id)
      
      // Prepare the market data
      const newMarket = {
        ...marketData,
        created_by: user.id,
        status: 'draft'
        // Remove created_at and updated_at - let Supabase handle these
      }
      
      console.log('Prepared market data:', newMarket)
      console.log('Data keys being sent:', Object.keys(newMarket))
      
      const { data, error } = await supabase
        .from('markets')
        .insert([newMarket])
        .select()
        .single()
      
      if (error) {
        console.error('Supabase insert error:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error(error.message || 'Erreur lors de la création du marché')
      }
      
      console.log('Market created successfully:', data)
      
      // Add the new market to the local state
      setMarkets(prev => [data, ...prev])
      
      return { success: true, data }
    } catch (err) {
      console.error('Error adding market:', err)
      const errorMessage = err.message || 'Erreur inconnue lors de la création du marché'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Update a market
  const updateMarket = async (id, updates) => {
    if (!supabase) {
      throw new Error('Client Supabase non configuré')
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('markets')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Supabase update error:', error)
        throw new Error(error.message || 'Erreur lors de la mise à jour du marché')
      }
      
      // Update the market in local state
      setMarkets(prev => prev.map(market => 
        market.id === id ? data : market
      ))
      
      return { success: true, data }
    } catch (err) {
      console.error('Error updating market:', err)
      const errorMessage = err.message || 'Erreur inconnue lors de la mise à jour du marché'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Delete a market
  const deleteMarket = async (id) => {
    if (!supabase) {
      throw new Error('Client Supabase non configuré')
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('markets')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Supabase delete error:', error)
        throw new Error(error.message || 'Erreur lors de la suppression du marché')
      }
      
      // Remove the market from local state
      setMarkets(prev => prev.filter(market => market.id !== id))
      
      return { success: true }
    } catch (err) {
      console.error('Error deleting market:', err)
      const errorMessage = err.message || 'Erreur inconnue lors de la suppression du marché'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Get a single market by ID
  const getMarket = async (id) => {
    if (!supabase) {
      console.warn('Supabase client not available')
      return null
    }
    
    try {
      const { data, error } = await supabase
        .from('markets')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('Supabase get error:', error)
        throw new Error(error.message || 'Erreur lors de la récupération du marché')
      }
      
      return data
    } catch (err) {
      console.error('Error fetching market:', err)
      setError(err.message || 'Erreur inconnue lors de la récupération du marché')
      return null
    }
  }

  // Search markets
  const searchMarkets = async (query) => {
    if (!supabase) {
      console.warn('Supabase client not available')
      return []
    }
    
    try {
      const { data, error } = await supabase
        .from('markets')
        .select('*')
        .or(`number.ilike.%${query}%,object.ilike.%${query}%,service.ilike.%${query}%`)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Supabase search error:', error)
        throw new Error(error.message || 'Erreur lors de la recherche')
      }
      
      return data || []
    } catch (err) {
      console.error('Error searching markets:', err)
      setError(err.message || 'Erreur inconnue lors de la recherche')
      return []
    }
  }

  // Filter markets by status
  const filterMarketsByStatus = async (status) => {
    if (!supabase) {
      console.warn('Supabase client not available')
      return []
    }
    
    try {
      const { data, error } = await supabase
        .from('markets')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Supabase filter error:', error)
        throw new Error(error.message || 'Erreur lors du filtrage')
      }
      
      return data || []
    } catch (err) {
      console.error('Error filtering markets:', err)
      setError(err.message || 'Erreur inconnue lors du filtrage')
      return []
    }
  }

  // Test Supabase connection and table existence
  const testConnection = async () => {
    if (!supabase) {
      console.error('Supabase client not available')
      return false
    }
    
    try {
      console.log('Testing Supabase connection...')
      
      // Try to select from markets table
      const { data, error } = await supabase
        .from('markets')
        .select('count')
        .limit(1)
      
      if (error) {
        console.error('Table test error:', error)
        if (error.code === '42P01') {
          console.error('Table "markets" does not exist. Please run the SQL setup script.')
          throw new Error('La table "markets" n\'existe pas. Veuillez exécuter le script SQL de configuration.')
        }
        throw error
      }
      
      console.log('Supabase connection successful, markets table exists')
      return true
    } catch (err) {
      console.error('Connection test failed:', err)
      throw err
    }
  }

  // Initialize markets on component mount
  useEffect(() => {
    if (user) {
      // Test connection first
      testConnection()
        .then(() => fetchMarkets())
        .catch(err => {
          console.error('Failed to initialize markets:', err)
          setError(err.message)
        })
    }
  }, [user])

  return {
    markets,
    loading,
    error,
    addMarket,
    updateMarket,
    deleteMarket,
    getMarket,
    searchMarkets,
    filterMarketsByStatus,
    fetchMarkets,
    testConnection,
    clearError: () => setError(null)
  }
} 