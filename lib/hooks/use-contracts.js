import { useState, useEffect } from 'react'
import { createClient } from '../supabase'
import { useAuth } from '../auth-context'

export function useContracts() {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const supabase = createClient()

  // Test connection to contracts table
  const testConnection = async () => {
    if (!supabase) {
      console.warn('Supabase client not available')
      return { success: false, error: 'Client Supabase non configuré. Vérifiez vos variables d\'environnement.' }
    }

    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('count')
        .limit(1)

      if (error) {
        console.error('Error testing contracts table connection:', error)
        return { success: false, error: `Erreur de connexion à la table des contrats: ${error.message}` }
      }

      console.log('Contracts table connection successful')
      return { success: true, error: null }
    } catch (err) {
      console.error('Exception testing contracts table:', err)
      return { success: false, error: `Exception lors de la connexion: ${err.message}` }
    }
  }

  // Fetch all contracts
  const fetchContracts = async () => {
    if (!supabase) {
      setError('Client Supabase non disponible')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Test connection first
      const connectionResult = await testConnection()
      if (!connectionResult.success) {
        throw new Error(connectionResult.error || 'Impossible de se connecter à la table des contrats')
      }

      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          markets (
            id,
            number,
            object,
            service,
            estimated_amount,
            currency,
            status,
            publication_date,
            submission_deadline,
            expected_start_date,
            expected_end_date
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching contracts:', error)
        throw new Error(`Erreur lors de la récupération des contrats: ${error.message}`)
      }

      // Calculate consumed days for each contract
      const contractsWithCalculations = data.map(contract => {
        const startDate = new Date(contract.start_date)
        const today = new Date()
        const consumedDays = Math.max(0, Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)))
        
        // Calculate deadline_date from start_date and duration_days
        const deadlineDate = new Date(startDate)
        deadlineDate.setDate(deadlineDate.getDate() + (contract.duration_days || 0))
        
        return {
          ...contract,
          deadline_date: deadlineDate.toISOString().split('T')[0], // Add computed deadline_date
          consumed_days: consumedDays,
          remaining_days: Math.max(0, contract.duration_days - consumedDays),
          is_overdue: contract.status === 'active' && today > deadlineDate,
          is_near_deadline: contract.status === 'active' && (contract.duration_days - consumedDays) <= 30 && (contract.duration_days - consumedDays) > 0
        }
      })

      setContracts(contractsWithCalculations)
      console.log('Contracts fetched successfully:', contractsWithCalculations)
    } catch (err) {
      console.error('Error in fetchContracts:', err)
      setError(err.message || 'Erreur lors de la récupération des contrats')
    } finally {
      setLoading(false)
    }
  }

  // Add a new contract
  const addContract = async (contractData) => {
    if (!supabase) {
      throw new Error('Client Supabase non disponible')
    }

    if (!user) {
      throw new Error('Utilisateur non authentifié')
    }

    try {
      // Clean the data to match database schema
      const cleanData = {
        number: contractData.number,
        market_id: contractData.market_id,
        subject: contractData.subject,
        awardee: contractData.awardee,
        awardee_address: contractData.awardee_address || null,
        awardee_phone: contractData.awardee_phone || null,
        awardee_email: contractData.awardee_email || null,
        initial_amount: parseFloat(contractData.initial_amount),
        currency: contractData.currency || 'MAD',
        notification_date: contractData.notification_date,
        start_date: contractData.start_date,
        duration_days: parseInt(contractData.duration_days),
        service: contractData.service,
        contract_type: contractData.contract_type,
        procurement_method: contractData.procurement_method,
        budget_source: contractData.budget_source,
        technical_specifications: contractData.technical_specifications || null,
        requirements: contractData.requirements || null,
        deliverables: contractData.deliverables || null,
        notes: contractData.notes || null,
        status: contractData.status || 'draft',
        created_by: user.id
      }

      console.log('Adding contract with data:', cleanData)

      const { data, error } = await supabase
        .from('contracts')
        .insert([cleanData])
        .select()

      if (error) {
        console.error('Error adding contract:', error)
        throw new Error(`Erreur lors de l'ajout du contrat: ${error.message}`)
      }

      console.log('Contract added successfully:', data)
      
      // Refresh the contracts list
      await fetchContracts()
      
      return data[0]
    } catch (err) {
      console.error('Error in addContract:', err)
      throw new Error(err.message || 'Erreur lors de l\'ajout du contrat')
    }
  }

  // Update an existing contract
  const updateContract = async (id, updates) => {
    if (!supabase) {
      throw new Error('Client Supabase non disponible')
    }

    if (!user) {
      throw new Error('Utilisateur non authentifié')
    }

    try {
      // Clean the update data
      const cleanUpdates = {
        number: updates.number,
        market_id: updates.market_id,
        subject: updates.subject,
        awardee: updates.awardee,
        awardee_address: updates.awardee_address || null,
        awardee_phone: updates.awardee_phone || null,
        awardee_email: updates.awardee_email || null,
        initial_amount: parseFloat(updates.initial_amount),
        currency: updates.currency || 'MAD',
        notification_date: updates.notification_date,
        start_date: updates.start_date,
        duration_days: parseInt(updates.duration_days),
        service: updates.service,
        contract_type: updates.contract_type,
        procurement_method: updates.procurement_method,
        budget_source: updates.budget_source,
        technical_specifications: updates.technical_specifications || null,
        requirements: updates.requirements || null,
        deliverables: updates.deliverables || null,
        notes: updates.notes || null,
        status: updates.status
      }

      console.log('Updating contract with data:', cleanUpdates)

      const { data, error } = await supabase
        .from('contracts')
        .update(cleanUpdates)
        .eq('id', id)
        .select()

      if (error) {
        console.error('Error updating contract:', error)
        throw new Error(`Erreur lors de la mise à jour du contrat: ${error.message}`)
      }

      console.log('Contract updated successfully:', data)
      
      // Refresh the contracts list
      await fetchContracts()
      
      return data[0]
    } catch (err) {
      console.error('Error in updateContract:', err)
      throw new Error(err.message || 'Erreur lors de la mise à jour du contrat')
    }
  }

  // Delete a contract
  const deleteContract = async (id) => {
    if (!supabase) {
      throw new Error('Client Supabase non disponible')
    }

    if (!user) {
      throw new Error('Utilisateur non authentifié')
    }

    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting contract:', error)
        throw new Error(`Erreur lors de la suppression du contrat: ${error.message}`)
      }

      console.log('Contract deleted successfully')
      
      // Refresh the contracts list
      await fetchContracts()
    } catch (err) {
      console.error('Error in deleteContract:', err)
      throw new Error(err.message || 'Erreur lors de la suppression du contrat')
    }
  }

  // Get a single contract by ID
  const getContract = async (id) => {
    if (!supabase) {
      throw new Error('Client Supabase non disponible')
    }

    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          markets (
            id,
            number,
            object,
            service,
            estimated_amount,
            currency,
            status,
            publication_date,
            submission_deadline,
            expected_start_date,
            expected_end_date
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching contract:', error)
        throw new Error(`Erreur lors de la récupération du contrat: ${error.message}`)
      }

      return data
    } catch (err) {
      console.error('Error in getContract:', err)
      throw new Error(err.message || 'Erreur lors de la récupération du contrat')
    }
  }

  // Search contracts
  const searchContracts = async (searchTerm) => {
    if (!supabase) {
      throw new Error('Client Supabase non disponible')
    }

    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          markets (
            id,
            number,
            object,
            service,
            estimated_amount,
            currency,
            status,
            publication_date,
            submission_deadline,
            expected_start_date,
            expected_end_date
          )
        `)
        .or(`number.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%,awardee.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching contracts:', error)
        throw new Error(`Erreur lors de la recherche des contrats: ${error.message}`)
      }

      return data
    } catch (err) {
      console.error('Error in searchContracts:', err)
      throw new Error(err.message || 'Erreur lors de la recherche des contrats')
    }
  }

  // Filter contracts by status
  const filterContractsByStatus = async (status) => {
    if (!supabase) {
      throw new Error('Client Supabase non disponible')
    }

    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          markets (
            id,
            number,
            object,
            service,
            estimated_amount,
            currency,
            status,
            publication_date,
            submission_deadline,
            expected_start_date,
            expected_end_date
          )
        `)
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error filtering contracts by status:', error)
        throw new Error(`Erreur lors du filtrage des contrats: ${error.message}`)
      }

      return data
    } catch (err) {
      console.error('Error in filterContractsByStatus:', err)
      throw new Error(err.message || 'Erreur lors du filtrage des contrats')
    }
  }

  // Filter contracts by service
  const filterContractsByService = async (service) => {
    if (!supabase) {
      throw new Error('Client Supabase non disponible')
    }

    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          markets (
            id,
            number,
            object,
            service,
            estimated_amount,
            currency,
            status,
            publication_date,
            submission_deadline,
            expected_start_date,
            expected_end_date
          )
        `)
        .eq('service', service)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error filtering contracts by service:', error)
        throw new Error(`Erreur lors du filtrage des contrats: ${error.message}`)
      }

      return data
    } catch (err) {
      console.error('Error in filterContractsByService:', err)
      throw new Error(err.message || 'Erreur lors du filtrage des contrats')
    }
  }

  // Update contract status only
  const updateContractStatus = async (id, newStatus) => {
    if (!supabase) {
      throw new Error('Client Supabase non disponible')
    }

    if (!user) {
      throw new Error('Utilisateur non authentifié')
    }

    try {
      console.log('Updating contract status:', { id, newStatus })

      const { data, error } = await supabase
        .from('contracts')
        .update({ status: newStatus })
        .eq('id', id)
        .select()

      if (error) {
        console.error('Error updating contract status:', error)
        throw new Error(`Erreur lors de la mise à jour du statut: ${error.message}`)
      }

      console.log('Contract status updated successfully:', data)
      
      // Refresh the contracts list
      await fetchContracts()
      
      return data[0]
    } catch (err) {
      console.error('Error in updateContractStatus:', err)
      throw new Error(err.message || 'Erreur lors de la mise à jour du statut')
    }
  }

  // Fetch contracts on component mount
  useEffect(() => {
    if (user) {
      fetchContracts()
    }
  }, [user])

  return {
    contracts,
    loading,
    error,
    fetchContracts,
    addContract,
    updateContract,
    deleteContract,
    getContract,
    searchContracts,
    filterContractsByStatus,
    filterContractsByService,
    updateContractStatus
  }
} 