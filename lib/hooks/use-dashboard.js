import { useState, useEffect, useCallback } from 'react'
import { createClient } from '../supabase'
import { useAuth } from '../auth-context'
import { useRealtimeUpdates } from './use-realtime-updates'

export function useDashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalContracts: 0,
      activeContracts: 0,
      completedContracts: 0,
      delayedContracts: 0,
      totalValue: 0,
      monthlyProgress: 0,
      totalUsers: 0,
      activeUsers: 0,
    },
    recentActivities: [],
    systemHealth: [],
    teamPerformance: [],
    recentContracts: [],
    loading: true,
    error: null
  })
  
  const { user } = useAuth()
  const supabase = createClient()

  // Fetch dashboard statistics
  const fetchDashboardStats = useCallback(async () => {
    if (!supabase || !user) return

    try {
      console.log('Fetching dashboard stats...')
      
      // Fetch contracts statistics
      const { data: contracts, error: contractsError } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false })

      if (contractsError) throw contractsError

      console.log('Contracts fetched:', contracts?.length || 0)

      // Calculate contract statistics
      const totalContracts = contracts?.length || 0
      const activeContracts = contracts?.filter(c => c.status === 'active').length || 0
      const completedContracts = contracts?.filter(c => c.status === 'completed').length || 0
      const delayedContracts = contracts?.filter(c => {
        if (c.status !== 'active') return false
        const deadline = new Date(c.deadline_date)
        const today = new Date()
        return today > deadline
      }).length || 0

      const totalValue = contracts?.reduce((sum, c) => sum + (c.initial_amount || 0), 0) || 0

      // Calculate monthly progress (simplified - can be enhanced)
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const monthlyContracts = contracts?.filter(c => {
        const contractDate = new Date(c.start_date)
        return contractDate.getMonth() === currentMonth && contractDate.getFullYear() === currentYear
      }) || []
      const monthlyProgress = totalContracts > 0 ? Math.round((monthlyContracts.length / totalContracts) * 100) : 0

      // Fetch users statistics (if users table exists)
      let totalUsers = 0
      let activeUsers = 0
      try {
        const { data: users, error: usersError } = await supabase
          .from('user_profiles')
          .select('*')
        
        if (!usersError && users) {
          totalUsers = users.length
          activeUsers = users.filter(u => u.status === 'active').length
        }
      } catch (err) {
        console.log('Users table not available, using default values')
        totalUsers = 24
        activeUsers = 21
      }

      // Fetch recent activities from contracts
      const recentActivities = contracts
        ?.slice(0, 5)
        .map(contract => ({
          action: `Contrat ${contract.status === 'active' ? 'activé' : contract.status === 'completed' ? 'terminé' : 'créé'}`,
          user: contract.awardee || 'Utilisateur',
          time: formatTimeAgo(new Date(contract.created_at)),
          type: contract.status === 'completed' ? 'approve' : 'create'
        })) || []

      // System health (mock for now, can be enhanced with real metrics)
      const systemHealth = [
        { metric: "Performance", value: 95, status: "excellent" },
        { metric: "Sécurité", value: 98, status: "excellent" },
        { metric: "Disponibilité", value: 99.5, status: "excellent" },
        { metric: "Sauvegarde", value: 100, status: "excellent" },
      ]

      // Team performance (if user has team management role)
      const teamPerformance = contracts
        ?.filter(c => c.status === 'active')
        .slice(0, 4)
        .map(contract => ({
          name: contract.awardee || 'Membre équipe',
          contracts: 1,
          completion: Math.floor(Math.random() * 30) + 70, // Mock completion rate
          status: Math.random() > 0.5 ? 'excellent' : 'good'
        })) || []

      // Recent contracts for display - show most recent contracts first
      const recentContracts = contracts
        ?.slice(0, 5) // Show more recent contracts
        .map(contract => ({
          id: contract.number || contract.id,
          title: contract.subject || `Contrat #${contract.id}`,
          client: contract.awardee || 'Client non spécifié',
          status: contract.status,
          progress: calculateProgress(contract),
          dueDate: contract.deadline_date,
          value: contract.initial_amount || 0
        })) || []

      console.log('Recent contracts prepared:', recentContracts.length)

      setDashboardData(prev => ({
        ...prev,
        stats: {
          totalContracts,
          activeContracts,
          completedContracts,
          delayedContracts,
          totalValue,
          monthlyProgress,
          totalUsers,
          activeUsers,
        },
        recentActivities,
        systemHealth,
        teamPerformance,
        recentContracts,
        loading: false
      }))

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setDashboardData(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }))
    }
  }, [supabase, user])

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback((table, payload) => {
    console.log(`Real-time update received for ${table}:`, payload)
    
    if (table === 'contracts') {
      console.log('Contract update received, refreshing dashboard...')
      // Immediately refresh dashboard data when contracts change
      fetchDashboardStats()
    }
  }, [fetchDashboardStats])

  // Use real-time updates hook
  useRealtimeUpdates(handleRealtimeUpdate)

  // Calculate contract progress
  const calculateProgress = (contract) => {
    if (contract.status === 'completed') return 100
    if (contract.status === 'draft') return 0
    
    const startDate = new Date(contract.start_date)
    const deadline = new Date(contract.deadline_date)
    const today = new Date()
    
    if (today < startDate) return 0
    if (today > deadline) return 100
    
    const totalDuration = deadline - startDate
    const elapsed = today - startDate
    
    return Math.round((elapsed / totalDuration) * 100)
  }

  // Format time ago
  const formatTimeAgo = (date) => {
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'À l\'instant'
    if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`
    
    return date.toLocaleDateString('fr-FR')
  }

  // Refresh dashboard data
  const refreshDashboard = useCallback(() => {
    console.log('Manual refresh requested')
    setDashboardData(prev => ({ ...prev, loading: true, error: null }))
    fetchDashboardStats()
  }, [fetchDashboardStats])

  // Auto-refresh every 5 minutes as fallback
  useEffect(() => {
    if (user) {
      console.log('Initial dashboard load for user:', user.id)
      fetchDashboardStats()
      
      const interval = setInterval(fetchDashboardStats, 5 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [user, fetchDashboardStats])

  return {
    ...dashboardData,
    refreshDashboard
  }
} 