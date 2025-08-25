import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export function useContracts() {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all contracts
  const fetchContracts = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('contrats')
        .select(`
          *,
          services(nom),
          attributaires(nom)
        `)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setContracts(data || [])
    } catch (err) {
      console.error('Error fetching contracts:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Create new contract
  const createContract = async (contractData) => {
    try {
      setError(null)

      const { data, error: createError } = await supabase
        .from('contrats')
        .insert([contractData])
        .select()

      if (createError) throw createError

      // Refresh contracts list
      await fetchContracts()

      return { success: true, data: data[0] }
    } catch (err) {
      console.error('Error creating contract:', err)
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  // Update existing contract
  const updateContract = async (id, updates) => {
    try {
      setError(null)

      const { data, error: updateError } = await supabase
        .from('contrats')
        .update(updates)
        .eq('id', id)
        .select()

      if (updateError) throw updateError

      // Refresh contracts list
      await fetchContracts()

      return { success: true, data: data[0] }
    } catch (err) {
      console.error('Error updating contract:', err)
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  // Delete contract
  const deleteContract = async (id) => {
    try {
      setError(null)

      const { error: deleteError } = await supabase
        .from('contrats')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Refresh contracts list
      await fetchContracts()

      return { success: true }
    } catch (err) {
      console.error('Error deleting contract:', err)
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  // Add settlement to contract
  const addSettlement = async (contractId, settlementData) => {
    try {
      setError(null)

      const { data, error: settlementError } = await supabase
        .from('decomptes')
        .insert([{
          ...settlementData,
          contrat_id: contractId
        }])
        .select()

      if (settlementError) throw settlementError

      return { success: true, data: data[0] }
    } catch (err) {
      console.error('Error adding settlement:', err)
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  // Add deadline to contract
  const addDeadline = async (contractId, deadlineData) => {
    try {
      setError(null)

      const { data, error: deadlineError } = await supabase
        .from('delais')
        .insert([{
          ...deadlineData,
          contrat_id: contractId
        }])
        .select()

      if (deadlineError) throw deadlineError

      return { success: true, data: data[0] }
    } catch (err) {
      console.error('Error adding deadline:', err)
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  // Get contract settlements
  const getContractSettlements = async (contractId) => {
    try {
      const { data, error: settlementsError } = await supabase
        .from('decomptes')
        .select('*')
        .eq('contrat_id', contractId)
        .order('created_at', { ascending: false })

      if (settlementsError) throw settlementsError

      return { success: true, data: data || [] }
    } catch (err) {
      console.error('Error fetching settlements:', err)
      return { success: false, error: err.message }
    }
  }

  // Get contract deadlines
  const getContractDeadlines = async (contractId) => {
    try {
      const { data, error: deadlinesError } = await supabase
        .from('delais')
        .select('*')
        .eq('contrat_id', contractId)
        .order('created_at', { ascending: false })

      if (deadlinesError) throw deadlinesError

      return { success: true, data: data || [] }
    } catch (err) {
      console.error('Error fetching deadlines:', err)
      return { success: false, error: err.message }
    }
  }

  // Search contracts
  const searchContracts = async (searchTerm, filters = {}) => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('contrats')
        .select(`
          *,
          services(nom),
          attributaires(nom)
        `)

      // Apply search term
      if (searchTerm) {
        query = query.or(`numero.ilike.%${searchTerm}%,objet.ilike.%${searchTerm}%,attributaire.ilike.%${searchTerm}%`)
      }

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('statut', filters.status)
      }

      if (filters.service && filters.service !== 'all') {
        query = query.eq('service_id', filters.service)
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'amount':
            query = query.order('montant_initial', { ascending: false })
            break
          case 'date':
            query = query.order('date_debut', { ascending: false })
            break
          case 'deadline':
            query = query.order('date_fin', { ascending: true })
            break
          case 'status':
            query = query.order('statut', { ascending: true })
            break
          default:
            query = query.order('created_at', { ascending: false })
        }
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error: searchError } = await query

      if (searchError) throw searchError

      setContracts(data || [])
    } catch (err) {
      console.error('Error searching contracts:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Get contract statistics
  const getContractStats = async () => {
    try {
      const { data, error: statsError } = await supabase
        .from('contrats')
        .select('statut, montant_initial')

      if (statsError) throw statsError

      const stats = {
        total: data.length,
        active: data.filter(c => c.statut === 'active').length,
        completed: data.filter(c => c.statut === 'completed').length,
        overdue: data.filter(c => c.statut === 'overdue').length,
        totalValue: data.reduce((sum, c) => sum + (c.montant_initial || 0), 0)
      }

      return { success: true, data: stats }
    } catch (err) {
      console.error('Error fetching contract stats:', err)
      return { success: false, error: err.message }
    }
  }

  // Initialize contracts on mount
  useEffect(() => {
    fetchContracts()
  }, [])

  return {
    contracts,
    loading,
    error,
    fetchContracts,
    createContract,
    updateContract,
    deleteContract,
    addSettlement,
    addDeadline,
    getContractSettlements,
    getContractDeadlines,
    searchContracts,
    getContractStats
  }
} 