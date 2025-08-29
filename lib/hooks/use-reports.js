import { useState, useEffect } from 'react'
import { createClient } from '../supabase'
import { useAuth } from '../auth-context'

export function useReports() {
  const [reports, setReports] = useState({
    contracts: [],
    markets: [],
    finances: [],
    settlements: [],
    expenses: []
  })
  const [stats, setStats] = useState({
    totalContracts: 0,
    totalValue: 0,
    successRate: 0,
    averageTime: 0,
    activeContracts: 0,
    completedContracts: 0,
    pendingContracts: 0,
    totalMarkets: 0,
    totalExpenses: 0,
    totalRevenue: 0,
    netProfit: 0
  })
  const [performanceMetrics, setPerformanceMetrics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const supabase = createClient()

  // Fetch all data for reports
  const fetchReportData = async () => {
    if (!supabase || !user) return

    setLoading(true)
    setError(null)

    try {
      // Fetch contracts with market data
      const { data: contracts, error: contractsError } = await supabase
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

      if (contractsError) throw contractsError

      // Fetch markets
      const { data: markets, error: marketsError } = await supabase
        .from('markets')
        .select('*')
        .order('created_at', { ascending: false })

      if (marketsError) throw marketsError

      // Fetch settlements
      const { data: settlements, error: settlementsError } = await supabase
        .from('settlements')
        .select('*')

      if (settlementsError) throw settlementsError

      // Fetch expenses
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('*')

      if (expensesError) throw expensesError

      // Process and calculate statistics
      const processedData = processReportData(contracts, markets, settlements, expenses)
      const calculatedStats = calculateReportStats(processedData)
      const calculatedMetrics = calculatePerformanceMetrics(processedData)

      setReports(processedData)
      setStats(calculatedStats)
      setPerformanceMetrics(calculatedMetrics)

    } catch (err) {
      console.error('Error fetching report data:', err)
      setError(err.message || 'Erreur lors de la récupération des données de rapport')
    } finally {
      setLoading(false)
    }
  }

  // Process raw data into usable format
  const processReportData = (contracts, markets, settlements, expenses) => {
    // Process contracts with additional calculations
    const processedContracts = (contracts || []).map(contract => {
      const startDate = new Date(contract.start_date)
      const today = new Date()
      const consumedDays = Math.max(0, Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)))
      
      // Calculate deadline_date from start_date and duration_days
      const deadlineDate = new Date(startDate)
      deadlineDate.setDate(deadlineDate.getDate() + (contract.duration_days || 0))
      
      // Calculate payment status
      const contractSettlements = (settlements || []).filter(s => s.contract_id === contract.id)
      const totalPaid = contractSettlements.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0)
      const remainingAmount = parseFloat(contract.initial_amount || 0) - totalPaid
      
      let paymentStatus = 'pending'
      if (totalPaid >= parseFloat(contract.initial_amount || 0)) {
        paymentStatus = 'paid'
      } else if (totalPaid > 0) {
        paymentStatus = 'partial'
      }

      return {
        ...contract,
        deadline_date: deadlineDate.toISOString().split('T')[0],
        consumed_days: consumedDays,
        remaining_days: Math.max(0, (contract.duration_days || 0) - consumedDays),
        is_overdue: contract.status === 'active' && today > deadlineDate,
        is_near_deadline: contract.status === 'active' && ((contract.duration_days || 0) - consumedDays) <= 30 && ((contract.duration_days || 0) - consumedDays) > 0,
        total_paid: totalPaid,
        remaining_amount: remainingAmount,
        payment_status: paymentStatus,
        settlements: contractSettlements
      }
    })

    return {
      contracts: processedContracts,
      markets: markets || [],
      settlements: settlements || [],
      expenses: expenses || []
    }
  }

  // Calculate comprehensive statistics
  const calculateReportStats = (data) => {
    const contracts = data.contracts || []
    const markets = data.markets || []
    const expenses = data.expenses || []

    // Contract statistics
    const totalContracts = contracts.length
    const activeContracts = contracts.filter(c => c.status === 'active').length
    const completedContracts = contracts.filter(c => c.status === 'completed').length
    const pendingContracts = contracts.filter(c => c.status === 'draft' || c.status === 'pending').length

    // Calculate total value from contracts
    const totalValue = contracts.reduce((sum, contract) => {
      return sum + (parseFloat(contract.initial_amount) || 0)
    }, 0)

    // Calculate success rate (completed contracts / total contracts)
    const successRate = totalContracts > 0 ? ((completedContracts / totalContracts) * 100) : 0

    // Calculate average completion time
    const completedContractsWithTime = contracts.filter(c => c.status === 'completed' && c.duration_days)
    const averageTime = completedContractsWithTime.length > 0 
      ? Math.round(completedContractsWithTime.reduce((sum, c) => sum + c.duration_days, 0) / completedContractsWithTime.length)
      : 0

    // Market statistics
    const totalMarkets = markets.length

    // Financial statistics
    const totalExpenses = expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0)
    
    // Calculate revenue from markets (estimated amounts)
    const totalRevenue = markets.reduce((sum, market) => {
      return sum + (parseFloat(market.estimated_amount) || 0)
    }, 0)

    // Net profit calculation (revenue - expenses - contract costs)
    const netProfit = totalRevenue - totalExpenses - totalValue

    return {
      totalContracts,
      totalValue,
      successRate: Math.round(successRate * 10) / 10, // Round to 1 decimal place
      averageTime,
      activeContracts,
      completedContracts,
      pendingContracts,
      totalMarkets,
      totalExpenses,
      totalRevenue,
      netProfit
    }
  }

  // Calculate performance metrics
  const calculatePerformanceMetrics = (data) => {
    const contracts = data.contracts || []
    const markets = data.markets || []
    const expenses = data.expenses || []

    // Success Rate Metric
    const totalContracts = contracts.length
    const completedContracts = contracts.filter(c => c.status === 'completed').length
    const successRate = totalContracts > 0 ? ((completedContracts / totalContracts) * 100) : 0
    const successRateTarget = 90
    const successRateTrend = successRate >= successRateTarget ? 'up' : 'down'

    // Budget Efficiency Metric (based on expenses vs budget)
    const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
    const totalBudget = markets.reduce((sum, m) => sum + (parseFloat(m.estimated_amount) || 0), 0)
    const budgetEfficiency = totalBudget > 0 ? ((totalBudget - totalExpenses) / totalBudget) * 100 : 0
    const budgetEfficiencyTarget = 85
    const budgetEfficiencyTrend = budgetEfficiency >= budgetEfficiencyTarget ? 'up' : 'down'

    // Processing Time Metric
    const activeContracts = contracts.filter(c => c.status === 'active')
    const averageProcessingTime = activeContracts.length > 0 
      ? activeContracts.reduce((sum, c) => sum + (c.consumed_days || 0), 0) / activeContracts.length
      : 0
    const processingTimeTarget = 15
    const processingTimeTrend = averageProcessingTime <= processingTimeTarget ? 'up' : 'down'

    // Customer Satisfaction Metric (simulated based on contract completion rate)
    const satisfactionScore = Math.min(5, Math.max(1, (successRate / 20) + 3)) // Scale 1-5
    const satisfactionTarget = 4.0
    const satisfactionTrend = satisfactionScore >= satisfactionTarget ? 'up' : 'down'

    return [
      {
        category: "Contrats",
        metric: "Taux de Réussite",
        value: Math.round(successRate * 10) / 10,
        target: successRateTarget,
        trend: successRateTrend,
        color: successRateTrend === 'up' ? "text-green-600" : "text-red-600",
        unit: "%"
      },
      {
        category: "Finances",
        metric: "Efficacité Budgétaire",
        value: Math.round(budgetEfficiency * 10) / 10,
        target: budgetEfficiencyTarget,
        trend: budgetEfficiencyTrend,
        color: budgetEfficiencyTrend === 'up' ? "text-green-600" : "text-red-600",
        unit: "%"
      },
      {
        category: "Marchés",
        metric: "Temps de Traitement",
        value: Math.round(averageProcessingTime * 10) / 10,
        target: processingTimeTarget,
        trend: processingTimeTrend,
        color: processingTimeTrend === 'up' ? "text-green-600" : "text-red-600",
        unit: " jours"
      },
      {
        category: "Utilisateurs",
        metric: "Satisfaction Client",
        value: Math.round(satisfactionScore * 10) / 10,
        target: satisfactionTarget,
        trend: satisfactionTrend,
        color: satisfactionTrend === 'up' ? "text-green-600" : "text-red-600",
        unit: "/5"
      }
    ]
  }

  // Generate custom report
  const generateCustomReport = async (reportType, filters = {}) => {
    try {
      setLoading(true)
      
      let filteredData = { ...reports }
      
      // Apply date filters if provided
      if (filters.startDate && filters.endDate) {
        const startDate = new Date(filters.startDate)
        const endDate = new Date(filters.endDate)
        
        filteredData.contracts = filteredData.contracts.filter(contract => {
          const contractDate = new Date(contract.start_date)
          return contractDate >= startDate && contractDate <= endDate
        })
        
        filteredData.markets = filteredData.markets.filter(market => {
          const marketDate = new Date(market.publication_date)
          return marketDate >= startDate && marketDate <= endDate
        })
        
        filteredData.expenses = filteredData.expenses.filter(expense => {
          const expenseDate = new Date(expense.date)
          return expenseDate >= startDate && expenseDate <= endDate
        })
      }
      
      // Apply status filters if provided
      if (filters.status) {
        filteredData.contracts = filteredData.contracts.filter(contract => 
          contract.status === filters.status
        )
        filteredData.markets = filteredData.markets.filter(market => 
          market.status === filters.status
        )
      }
      
      // Apply service filters if provided
      if (filters.service) {
        filteredData.contracts = filteredData.contracts.filter(contract => 
          contract.service === filters.service
        )
        filteredData.markets = filteredData.markets.filter(market => 
          market.service === filters.service
        )
      }
      
      // Calculate filtered statistics
      const filteredStats = calculateReportStats(filteredData)
      const filteredMetrics = calculatePerformanceMetrics(filteredData)
      
      const report = {
        type: reportType,
        generatedAt: new Date().toISOString(),
        filters,
        data: filteredData,
        statistics: filteredStats,
        performanceMetrics: filteredMetrics
      }
      
      return report
      
    } catch (err) {
      console.error('Error generating custom report:', err)
      throw new Error(`Erreur lors de la génération du rapport: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Export report data
  const exportReport = (reportData, format = 'json') => {
    try {
      let exportData
      
      switch (format) {
        case 'json':
          exportData = JSON.stringify(reportData, null, 2)
          break
        case 'csv':
          exportData = convertToCSV(reportData)
          break
        default:
          throw new Error('Format d\'export non supporté')
      }
      
      // Create and download file
      const blob = new Blob([exportData], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rapport_${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      return { success: true, message: 'Rapport exporté avec succès' }
      
    } catch (err) {
      console.error('Error exporting report:', err)
      throw new Error(`Erreur lors de l'export: ${err.message}`)
    }
  }

  // Convert data to CSV format
  const convertToCSV = (data) => {
    // Implementation for CSV conversion
    // This is a simplified version - you can enhance it based on your needs
    const headers = ['Type', 'Valeur', 'Date', 'Statut']
    const rows = []
    
    // Add contracts
    data.data.contracts.forEach(contract => {
      rows.push([
        'Contrat',
        contract.initial_amount,
        contract.start_date,
        contract.status
      ])
    })
    
    // Add markets
    data.data.markets.forEach(market => {
      rows.push([
        'Marché',
        market.estimated_amount,
        market.publication_date,
        market.status
      ])
    })
    
    // Add expenses
    data.data.expenses.forEach(expense => {
      rows.push([
        'Dépense',
        expense.amount,
        expense.date,
        expense.status
      ])
    })
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  // Refresh data
  const refreshData = () => {
    fetchReportData()
  }

  // Initialize on component mount
  useEffect(() => {
    if (user) {
      fetchReportData()
    }
  }, [user])

  return {
    reports,
    stats,
    performanceMetrics,
    loading,
    error,
    fetchReportData,
    generateCustomReport,
    exportReport,
    refreshData
  }
} 