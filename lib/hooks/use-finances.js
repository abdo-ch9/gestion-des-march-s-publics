import { useState, useEffect } from 'react'
import { createClient } from '../supabase'

export function useFinances() {
  const [finances, setFinances] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    pendingPayments: 0,
    overduePayments: 0,
    monthlyRevenue: [],
    monthlyExpenses: [],
    topRevenueSources: [],
    topExpenseCategories: []
  })

  const supabase = createClient()

  // Fetch all financial data
  const fetchFinances = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if Supabase client is available
      if (!supabase) {
        throw new Error('Supabase client is not configured. Please create a .env.local file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. See supabase-config-example.txt for instructions.')
      }

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Utilisateur non authentifié. Veuillez vous connecter.')
      }

            // Fetch contracts with market data
      const { data: contracts, error: contractsError } = await supabase
        .from('contracts')
        .select(`
          *,
          markets (
            id,
            number,
            object,
            estimated_amount,
            currency,
            status
          )
        `)
        .eq('status', 'active')

      if (contractsError) throw contractsError

      // Fetch settlements (payments)
      const { data: settlements, error: settlementsError } = await supabase
        .from('settlements')
        .select('*')

      if (settlementsError) throw settlementsError

      // Fetch expenses
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('*')

      if (expensesError) throw expensesError

      // Process and combine data
      const processedData = processFinancialData(contracts, settlements, expenses)
      setFinances(processedData)
      
      // Calculate statistics
      const calculatedStats = calculateFinancialStats(processedData)
      setStats(calculatedStats)

    } catch (err) {
      console.error('Error fetching finances:', err)
      setError(err.message || 'An error occurred while fetching finances')
    } finally {
      setLoading(false)
    }
  }

  // Process raw data into usable format
  const processFinancialData = (contracts, settlements, expenses) => {
    const processed = {
      contracts: contracts || [],
      settlements: settlements || [],
      expenses: expenses || [],
      revenue: [],
      expenses: [],
      cashFlow: []
    }

    // Process revenue from contracts and settlements
    if (contracts && settlements) {
      processed.revenue = contracts.map(contract => {
        const contractSettlements = settlements.filter(s => s.contract_id === contract.id)
        const totalPaid = contractSettlements.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0)
        const remaining = parseFloat(contract.initial_amount || 0) - totalPaid
        
        return {
          id: contract.id,
          number: contract.number,
          subject: contract.subject,
          totalValue: parseFloat(contract.initial_amount || 0),
          paidAmount: totalPaid,
          remainingAmount: remaining,
          status: contract.status,
          payment_status: contract.payment_status || 'pending',
          partial_amount: contract.partial_amount || null,
          remaining_amount: contract.remaining_amount || remaining,
          service: contract.service,
          startDate: contract.start_date,
          deadline: contract.deadline_date,
          settlements: contractSettlements,
          // Include market data for financial calculations
          market_id: contract.market_id,
          market_estimated_amount: contract.markets?.estimated_amount || contract.initial_amount || contract.initial_amount,
          market_number: contract.markets?.number || `Marché-${contract.market_id?.slice(0, 8) || 'N/A'}`,
          market_object: contract.markets?.object || 'Objet non spécifié'
        }
      })
    }

    // Process expenses
    if (expenses) {
      processed.expenses = expenses.map(expense => ({
        id: expense.id,
        description: expense.description,
        amount: parseFloat(expense.amount || 0),
        category: expense.category,
        date: expense.date,
        status: expense.status,
        paymentMethod: expense.payment_method,
        supplier: expense.supplier
      }))
    }

    // Calculate cash flow
    if (processed.revenue.length > 0 || processed.expenses.length > 0) {
      processed.cashFlow = calculateCashFlow(processed.revenue, processed.expenses)
    }

    return processed
  }

  // Calculate financial statistics
  const calculateFinancialStats = (data) => {
    // Calculate total contract values
    const totalContractValues = data.revenue.reduce((sum, r) => sum + r.totalValue, 0)
    
    // Calculate total market values (estimated amounts)
    const totalMarketValues = data.revenue.reduce((sum, r) => {
      // Use the market estimated amount that's now included in the revenue object
      const marketEstimatedAmount = r.market_estimated_amount || r.totalValue // fallback to contract value if no market data
      return sum + (parseFloat(marketEstimatedAmount) || 0)
    }, 0)
    
    // Revenus Totaux = market price - contract price (the profit margin)
    const totalRevenue = totalMarketValues - totalContractValues
    
    // Dépenses Totales = contract price + expenses (total costs)
    const totalExpenses = totalContractValues + data.expenses.reduce((sum, e) => sum + e.amount, 0)
    
    // Bénéfice Net = Revenus Totaux - 20%
    const netProfit = totalRevenue - (totalRevenue * 0.20)

    // Calculate pending and overdue payments
    const pendingPayments = data.revenue.reduce((sum, r) => {
      // If status is paid, no pending amount
      if (r.payment_status === 'paid') return sum
      
      // If status is partial, only remaining amount is pending
      if (r.payment_status === 'partial' && r.remaining_amount) {
        return sum + r.remaining_amount
      }
      
      // If status is pending or overdue, full amount is pending
      if (r.payment_status === 'pending' || r.payment_status === 'overdue') {
        return sum + r.remainingAmount
      }
      
      return sum
    }, 0)

    const overduePayments = data.revenue.reduce((sum, r) => {
      if (r.deadline && new Date(r.deadline) < new Date() && r.payment_status !== 'paid') {
        // If partial, only remaining amount is overdue
        if (r.payment_status === 'partial' && r.remaining_amount) {
          return sum + r.remaining_amount
        }
        // If pending, full remaining amount is overdue
        return sum + r.remainingAmount
      }
      return sum
    }, 0)

    // Calculate payment status statistics
    const paymentStatusStats = data.revenue.reduce((stats, r) => {
      const status = r.payment_status || 'pending'
      if (!stats[status]) {
        stats[status] = { count: 0, amount: 0 }
      }
      stats[status].count++
      stats[status].amount += r.totalValue
      return stats
    }, {})

    // Calculate monthly data
    const monthlyRevenue = calculateMonthlyData(data.revenue, 'totalValue')
    const monthlyExpenses = calculateMonthlyData(data.expenses, 'amount')

    // Top revenue sources (now showing profit margins)
    const topRevenueSources = data.revenue
      .map(r => {
        const marketEstimatedAmount = r.market_estimated_amount || r.totalValue
        const profitMargin = (parseFloat(marketEstimatedAmount) || 0) - r.totalValue
        return {
          name: r.subject,
          value: profitMargin,
          percentage: totalRevenue > 0 ? ((profitMargin / totalRevenue) * 100).toFixed(1) : '0.0'
        }
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    // Top expense categories
    const topExpenseCategories = data.expenses
      .reduce((acc, expense) => {
        const category = expense.category || 'Autre'
        acc[category] = (acc[category] || 0) + expense.amount
        return acc
      }, {})
    
    const topExpenses = Object.entries(topExpenseCategories)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: ((amount / totalExpenses) * 100).toFixed(1)
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      pendingPayments,
      overduePayments,
      monthlyRevenue,
      monthlyExpenses,
      topRevenueSources,
      topExpenseCategories: topExpenses,
      // Add additional fields for transparency
      totalContractValues,
      totalMarketValues,
      profitMargin: totalRevenue,
      paymentStatusStats // Add payment status statistics to stats
    }
  }

  // Calculate monthly data for charts
  const calculateMonthlyData = (data, valueField) => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
    const monthlyData = new Array(12).fill(0).map((_, index) => ({
      month: months[index],
      value: 0,
      count: 0
    }))

    data.forEach(item => {
      const date = new Date(item.startDate || item.date)
      const monthIndex = date.getMonth()
      if (monthIndex >= 0 && monthIndex < 12) {
        // For revenue data, calculate profit margin (market price - contract price)
        if (valueField === 'totalValue' && item.market_estimated_amount) {
          const profitMargin = (parseFloat(item.market_estimated_amount) || 0) - parseFloat(item[valueField] || 0)
          monthlyData[monthIndex].value += profitMargin
        } else {
          monthlyData[monthIndex].value += parseFloat(item[valueField] || 0)
        }
        monthlyData[monthIndex].count += 1
      }
    })

    return monthlyData
  }

  // Calculate cash flow
  const calculateCashFlow = (revenue, expenses) => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
    const cashFlow = months.map(month => ({
      month,
      revenue: 0,
      expenses: 0,
      net: 0
    }))

    // Add revenue (profit margins)
    revenue.forEach(r => {
      const date = new Date(r.startDate)
      const monthIndex = date.getMonth()
      if (monthIndex >= 0 && monthIndex < 12) {
        // Use profit margin instead of contract value
        const profitMargin = (parseFloat(r.market_estimated_amount) || 0) - r.totalValue
        cashFlow[monthIndex].revenue += profitMargin
        cashFlow[monthIndex].net += profitMargin
      }
    })

    // Subtract expenses
    expenses.forEach(e => {
      const date = new Date(e.date)
      const monthIndex = date.getMonth()
      if (monthIndex >= 0 && monthIndex < 12) {
        cashFlow[monthIndex].expenses += e.amount
        cashFlow[monthIndex].net -= e.amount
      }
    })

    return cashFlow
  }

  // Add new expense
  const addExpense = async (expenseData) => {
    try {
      // Get current user ID properly
      let createdBy = null
      try {
        const { data: { user } } = await supabase.auth.getUser()
        createdBy = user?.id || null
      } catch (authError) {
        console.warn('Could not get user ID:', authError)
        // Continue without user ID if auth fails
      }

      // Prepare the expense data with proper field mapping
      const expenseToInsert = {
        description: expenseData.description,
        amount: parseFloat(expenseData.amount),
        category: expenseData.category,
        date: expenseData.date,
        status: expenseData.status,
        payment_method: expenseData.payment_method,
        supplier: expenseData.supplier || null,
        invoice_number: expenseData.invoice_number || null,
        notes: expenseData.notes || null,
        created_by: createdBy
      }

      console.log('Inserting expense:', expenseToInsert)

      const { data, error } = await supabase
        .from('expenses')
        .insert([expenseToInsert])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Erreur lors de l\'insertion en base de données')
      }

      console.log('Expense inserted successfully:', data)

      // Refresh data
      await fetchFinances()
      return { success: true, data }

    } catch (err) {
      console.error('Error adding expense:', err)
      throw err
    }
  }

  // Update expense
  const updateExpense = async (id, updates) => {
    try {
      // Prepare the expense data with proper field mapping
      const expenseToUpdate = {
        description: updates.description,
        amount: parseFloat(updates.amount),
        category: updates.category,
        date: updates.date,
        status: updates.status,
        payment_method: updates.payment_method,
        supplier: updates.supplier || null,
        invoice_number: updates.invoice_number || null,
        notes: updates.notes || null,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('expenses')
        .update(expenseToUpdate)
        .eq('id', id)
        .select()

      if (error) throw error

      // Refresh data
      await fetchFinances()
      return { success: true, data }

    } catch (err) {
      console.error('Error updating expense:', err)
      throw err
    }
  }

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Refresh data
      await fetchFinances()
      return { success: true }

    } catch (err) {
      console.error('Error deleting expense:', err)
      throw err
    }
  }

  // Add new settlement
  const addSettlement = async (settlementData) => {
    try {
      const { data, error } = await supabase
        .from('settlements')
        .insert([settlementData])
        .select()

      if (error) throw error

      // Refresh data
      await fetchFinances()
      return { success: true, data }

    } catch (err) {
      console.error('Error adding settlement:', err)
      throw err
    }
  }

  // Update settlement
  const updateSettlement = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('settlements')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error

      // Refresh data
      await fetchFinances()
      return { success: true, data }

    } catch (err) {
      console.error('Error updating settlement:', err)
      throw err
    }
  }

  // Delete settlement
  const deleteSettlement = async (id) => {
    try {
      const { error } = await supabase
        .from('settlements')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Refresh data
      await fetchFinances()
      return { success: true }

    } catch (err) {
      console.error('Error deleting settlement:', err)
      throw err
    }
  }

  // Update contract payment status
  const updateContractPaymentStatus = async (contractId, paymentStatus, updateData = {}) => {
    try {
      const updateFields = { 
        payment_status: paymentStatus,
        updated_at: new Date().toISOString(),
        ...updateData
      }

      const { error } = await supabase
        .from('contracts')
        .update(updateFields)
        .eq('id', contractId)

      if (error) throw error

      // Refresh data
      await fetchFinances()
      return { success: true }

    } catch (err) {
      console.error('Error updating contract payment status:', err)
      throw err
    }
  }

  // Export financial data
  const exportFinancialData = (format = 'csv') => {
    // Implementation for exporting data
    console.log('Exporting financial data in', format, 'format')
  }

  // Generate financial report
  const generateReport = async (startDate, endDate, reportType = 'summary') => {
    try {
      // Filter data by date range
      const filteredData = filterDataByDateRange(finances, startDate, endDate)
      
      // Generate report based on type
      const report = generateReportByType(filteredData, reportType)
      
      return report
    } catch (err) {
      console.error('Error generating report:', err)
      throw err
    }
  }

  // Filter data by date range
  const filterDataByDateRange = (data, startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return {
      ...data,
      revenue: data.revenue.filter(r => {
        const date = new Date(r.startDate)
        return date >= start && date <= end
      }),
      expenses: data.expenses.filter(e => {
        const date = new Date(e.date)
        return date >= start && date <= end
      })
    }
  }

  // Generate report by type
  const generateReportByType = (data, type) => {
    switch (type) {
      case 'summary':
        return {
          type: 'Résumé Financier',
          period: `${new Date().toLocaleDateString('fr-FR')}`,
          totalRevenue: data.revenue.reduce((sum, r) => sum + r.totalValue, 0),
          totalExpenses: data.expenses.reduce((sum, e) => sum + e.amount, 0),
          netProfit: data.revenue.reduce((sum, r) => sum + r.totalValue, 0) - 
                    data.expenses.reduce((sum, e) => sum + e.amount, 0),
          revenueCount: data.revenue.length,
          expenseCount: data.expenses.length
        }
      
      case 'detailed':
        return {
          type: 'Rapport Détaillé',
          period: `${new Date().toLocaleDateString('fr-FR')}`,
          revenue: data.revenue,
          expenses: data.expenses,
          cashFlow: calculateCashFlow(data.revenue, data.expenses)
        }
      
      default:
        return null
    }
  }

  useEffect(() => {
    fetchFinances()
  }, [])

  return {
    finances,
    stats,
    loading,
    error,
    fetchFinances,
    addExpense,
    updateExpense,
    deleteExpense,
    addSettlement,
    updateSettlement,
    deleteSettlement,
    updateContractPaymentStatus,
    exportFinancialData,
    generateReport
  }
} 