"use client"

import { useState, useCallback, useMemo } from "react"
import { useAuth } from "../../lib/auth-context"
import { useFinances } from "../../lib/hooks/use-finances"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { 
  DollarSign, TrendingUp, TrendingDown, AlertTriangle, 
  Plus, Download, FileText, RefreshCw, Calendar,
  BarChart3, PieChart, LineChart, Activity, Clock
} from "lucide-react"
import { toast } from "sonner"
import { 
  ResponsiveContainer, AreaChart, BarChart, PieChart as RechartsPieChart,
  Area, Bar, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts"

// Import expense CRUD components
import { AddExpenseModal } from "./add-expense-modal"
import { EditExpenseModal } from "./edit-expense-modal"
import { DeleteExpenseDialog } from "./delete-expense-dialog"
import { ExpenseDetailsView } from "./expense-details-view"
import { ExpenseActionsMenu } from "./expense-actions-menu"
import { ContractPaymentStatus } from "./contract-payment-status"

// Helper function to format currency
const formatCurrency = (amount) => {
  if (isNaN(amount) || amount === 0) return '0 DH'
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M DH`
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K DH`
  }
  return `${amount.toLocaleString('fr-FR')} DH`
}

// Helper function to format percentage
const formatPercentage = (value, total) => {
  if (total === 0) return '0%'
  return `${((value / total) * 100).toFixed(1)}%`
}

export function FinancialDashboard() {
  const { user } = useAuth()
  const userRole = user?.role
  
  const {
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
  } = useFinances()

  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState("all")

  // Expense CRUD modal states
  const [addExpenseOpen, setAddExpenseOpen] = useState(false)
  const [editExpenseOpen, setEditExpenseOpen] = useState(false)
  const [deleteExpenseOpen, setDeleteExpenseOpen] = useState(false)
  const [expenseDetailsOpen, setExpenseDetailsOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)

  // Handle refresh
  const handleRefresh = () => {
    fetchFinances()
    toast.success("Données financières actualisées")
  }

  // Handle export
  const handleExport = (format) => {
    exportFinancialData(format)
    toast.success(`Export ${format.toUpperCase()} en cours...`)
  }

  // Handle report generation
  const handleGenerateReport = async () => {
    try {
      const report = await generateReport(
        new Date(new Date().getFullYear(), 0, 1), // Start of year
        new Date(), // Today
        'summary'
      )
      console.log('Generated report:', report)
      toast.success("Rapport généré avec succès")
    } catch (error) {
      toast.error("Erreur lors de la génération du rapport")
    }
  }

  // Expense CRUD handlers
  const handleAddExpense = () => {
    setAddExpenseOpen(true)
  }

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense)
    setEditExpenseOpen(true)
  }

  const handleDeleteExpense = (expense) => {
    setSelectedExpense(expense)
    setDeleteExpenseOpen(true)
  }

  const handleViewExpense = (expense) => {
    setSelectedExpense(expense)
    setExpenseDetailsOpen(true)
  }

  const handleExpenseSuccess = () => {
    fetchFinances()
  }

  // Handle contract payment status change
  const handleContractPaymentStatusChange = async (contractId, newStatus, updateData = {}) => {
    try {
      await updateContractPaymentStatus(contractId, newStatus, updateData)
      toast.success("Statut de paiement du contrat mis à jour")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut de paiement")
    }
  }

  // Filter expenses based on search and filters
  const filteredExpenses = finances.expenses?.filter(expense => {
    const matchesSearch = !searchTerm || 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  }) || []

  // Filter revenue based on search
  const filteredRevenue = finances.revenue?.filter(revenue => {
    return !searchTerm || 
      revenue.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      revenue.number.toLowerCase().includes(searchTerm.toLowerCase())
  }) || []

  // Chart colors
  const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord Financier</h1>
          <p className="text-muted-foreground">
            Suivi complet des revenus, dépenses et flux de trésorerie
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={handleGenerateReport}>
            <FileText className="mr-2 h-4 w-4" />
            Rapport
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700 font-medium">
                  Erreur: {error}
                </span>
              </div>
              
              {/* Show configuration help for Supabase errors */}
              {error.includes('Supabase client is not configured') && (
                <div className="text-xs text-red-600 bg-red-100 p-3 rounded border border-red-200">
                  <div className="font-medium mb-2">Configuration requise :</div>
                  <div className="space-y-1">
                    <div>1. Créez un fichier <code className="bg-red-200 px-1 rounded">.env.local</code> à la racine du projet</div>
                    <div>2. Ajoutez vos variables Supabase :</div>
                    <div className="ml-4">
                      <div><code className="bg-red-200 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase</code></div>
                      <div><code className="bg-red-200 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon</code></div>
                    </div>
                    <div>3. Consultez <code className="bg-red-200 px-1 rounded">supabase-config-example.txt</code> pour les instructions détaillées</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Status Summary */}
      {!loading && !error && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-blue-700">
                  Données financières synchronisées avec la base de données
                </span>
              </div>
              <div className="text-xs text-blue-600">
                {finances.revenue?.length || 0} revenus • {finances.expenses?.length || 0} dépenses
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Chargement des données financières...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Marge: {formatCurrency(stats.profitMargin)} • {finances.revenue?.length || 0} contrats
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(stats.totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                Contrats: {formatCurrency(stats.totalContractValues)} + Dépenses: {formatCurrency(stats.totalExpenses - stats.totalContractValues)}
              </p>
              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-800">
                <strong>Note :</strong> Le prix des contrats est automatiquement ajouté aux dépenses totales
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bénéfice Net</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(stats.netProfit)}
              </div>
              <p className="text-xs text-muted-foreground">
                Revenus - 20% • {stats.totalRevenue > 0 ? ((stats.netProfit / stats.totalRevenue) * 100).toFixed(1) : '0'}% du revenu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paiements en Attente</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(stats.pendingPayments)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.overduePayments > 0 ? `${formatCurrency(stats.overduePayments)} en retard` : 'Tous à jour'}
              </p>
              
              {/* Payment Status Summary */}
              {stats.paymentStatusStats && (
                <div className="mt-3 pt-3 border-t">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(stats.paymentStatusStats).map(([status, data]) => {
                      const statusInfo = {
                        pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
                        partial: { label: 'Partiel', color: 'bg-orange-100 text-orange-800' },
                        paid: { label: 'Payé', color: 'bg-green-100 text-green-800' },
                        overdue: { label: 'En retard', color: 'bg-red-100 text-red-800' },
                        cancelled: { label: 'Annulé', color: 'bg-gray-100 text-gray-800' }
                      }[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
                      
                      return (
                        <div key={status} className="flex items-center justify-between p-2 bg-white rounded border">
                          <Badge className={statusInfo.color} variant="outline">
                            {statusInfo.label}
                          </Badge>
                          <span className="font-medium">{data.count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contrats en Attente</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {finances.revenue?.filter(c => (c.payment_status || 'pending') === 'pending').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {finances.revenue?.filter(c => c.payment_status === 'overdue').length || 0} en retard
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche et Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par description, fournisseur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                <SelectItem value="materiaux">Matériaux</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="personnel">Personnel</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="autres">Autres</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvé</SelectItem>
                <SelectItem value="paid">Payé</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toute période</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
          <TabsTrigger value="expenses">Dépenses (Inclut Contrats)</TabsTrigger>
          <TabsTrigger value="cashflow">Flux de Trésorerie</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-64 bg-muted animate-pulse rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] bg-muted animate-pulse rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* Monthly Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Évolution Mensuelle des Marges Bénéficiaires</CardTitle>
                  <CardDescription>
                    Suivi des marges (prix marché - prix contrat) par mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.monthlyRevenue.length > 0 ? (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.monthlyRevenue}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis tickFormatter={formatCurrency} />
                          <Tooltip 
                            formatter={(value) => [formatCurrency(value), 'Revenus']}
                            labelFormatter={(label) => `Mois: ${label}`}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#10b981"
                            fill="#10b981"
                            fillOpacity={0.3}
                            name="Revenus"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      Aucune donnée de revenus disponible
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top Revenue Sources and Expense Categories */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Top Revenue Sources */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Sources de Revenus (Marges)</CardTitle>
                    <CardDescription>
                      Contrats avec les plus grandes marges bénéficiaires
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats.topRevenueSources.length > 0 ? (
                      <div className="space-y-3">
                        {stats.topRevenueSources.map((source, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: chartColors[index % chartColors.length] }}
                              />
                              <span className="text-sm font-medium truncate max-w-32">
                                {source.name}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatCurrency(source.value)}</div>
                              <div className="text-xs text-muted-foreground">{source.percentage}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        Aucune source de revenus disponible
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Top Expense Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Catégories de Dépenses</CardTitle>
                    <CardDescription>
                      Catégories les plus coûteuses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats.topExpenseCategories.length > 0 ? (
                      <div className="space-y-3">
                        {stats.topExpenseCategories.map((category, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: chartColors[index % chartColors.length] }}
                              />
                              <span className="text-sm font-medium capitalize">
                                {category.category}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatCurrency(category.amount)}</div>
                              <div className="text-xs text-muted-foreground">{category.percentage}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        Aucune catégorie de dépenses disponible
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sources de Revenus (Marges Bénéficiaires)</CardTitle>
              <CardDescription>
                Détail des contrats et leurs marges bénéficiaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredRevenue.length > 0 ? (
                <div className="space-y-4">
                  {filteredRevenue.map((revenue) => {
                    const profitMargin = (parseFloat(revenue.market_estimated_amount) || 0) - revenue.totalValue
                    return (
                      <div key={revenue.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">#{revenue.number}</Badge>
                            <span className="font-medium">{revenue.subject}</span>
                            <Badge variant="secondary">{revenue.service}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {revenue.startDate && new Date(revenue.startDate).toLocaleDateString('fr-FR')}
                            {revenue.market_number && ` • Marché: ${revenue.market_number}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">
                            Marge: {formatCurrency(profitMargin)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Marché: {formatCurrency(revenue.market_estimated_amount)} • Contrat: {formatCurrency(revenue.totalValue)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Aucun revenu trouvé
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-4">
          {/* Summary Card */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">Résumé des Dépenses</CardTitle>
              <CardDescription>
                Détail du calcul automatique des dépenses totales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-700">Dépenses Manuelles</h4>
                  <div className="text-sm space-y-1">
                    <div>Total: {formatCurrency(stats.totalExpenses - stats.totalContractValues)}</div>
                    <div>Nombre: {finances.expenses?.length || 0} dépenses</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-orange-700">Prix des Contrats (Automatique)</h4>
                  <div className="text-sm space-y-1">
                    <div>Total: {formatCurrency(stats.totalContractValues)}</div>
                    <div>Nombre: {finances.revenue?.length || 0} contrats</div>
                  </div>
                </div>
              </div>
              
              {/* Payment Status Summary */}
              {finances.revenue && finances.revenue.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h5 className="font-semibold text-gray-700 mb-2">Statuts de Paiement des Contrats</h5>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                    {['pending', 'partial', 'paid', 'overdue', 'cancelled'].map((status) => {
                      const count = finances.revenue.filter(c => (c.payment_status || 'pending') === status).length
                      const statusInfo = {
                        pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
                        partial: { label: 'Partiel', color: 'bg-orange-100 text-orange-800' },
                        paid: { label: 'Payé', color: 'bg-green-100 text-green-800' },
                        overdue: { label: 'En retard', color: 'bg-red-100 text-red-800' },
                        cancelled: { label: 'Annulé', color: 'bg-gray-100 text-gray-800' }
                      }[status]
                      
                      return (
                        <div key={status} className="flex items-center justify-between p-2 bg-white rounded border">
                          <Badge className={statusInfo.color} variant="outline">
                            {statusInfo.label}
                          </Badge>
                          <span className="font-medium">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">Total des Dépenses</span>
                  <span className="text-2xl font-bold text-red-600">
                    {formatCurrency(stats.totalExpenses)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Dépenses manuelles + Prix des contrats (ajouté automatiquement)
                </p>
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                  <strong>Calcul automatique :</strong> {formatCurrency(stats.totalExpenses - stats.totalContractValues)} + {formatCurrency(stats.totalContractValues)} = {formatCurrency(stats.totalExpenses)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manual Expenses Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Dépenses Manuelles</CardTitle>
                <CardDescription>
                  Gestion des dépenses et coûts ajoutés manuellement
                </CardDescription>
              </div>
              {(userRole === "admin" || userRole === "manager") && (
                <Button onClick={handleAddExpense}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle Dépense
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {filteredExpenses.length > 0 ? (
                <div className="space-y-4">
                  {filteredExpenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{expense.description}</span>
                          <Badge variant="outline" className="capitalize">
                            {expense.category}
                          </Badge>
                          <Badge 
                            variant={
                              expense.status === "paid" ? "default" :
                              expense.status === "pending" ? "secondary" :
                              expense.status === "cancelled" ? "destructive" : "outline"
                            }
                          >
                            {expense.status === "pending" ? "En attente" :
                             expense.status === "paid" ? "Payé" :
                             expense.status === "cancelled" ? "Annulé" : expense.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {expense.supplier && `Fournisseur: ${expense.supplier}`}
                          {expense.date && ` • ${new Date(expense.date).toLocaleDateString('fr-FR')}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-red-600">
                            {formatCurrency(expense.amount)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {expense.paymentMethod}
                          </div>
                        </div>
                        <ExpenseActionsMenu
                          expense={expense}
                          onEdit={handleEditExpense}
                          onDelete={handleDeleteExpense}
                          onView={handleViewExpense}
                          userRole={userRole}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Aucune dépense manuelle trouvée
                </div>
              )}
            </CardContent>
          </Card>

          {/* Automatic Contract Expenses Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Prix des Contrats (Ajouté Automatiquement)</CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Auto-inclus
                </Badge>
              </div>
              <CardDescription>
                Ces montants sont automatiquement inclus dans le total des dépenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {finances.revenue && finances.revenue.length > 0 ? (
                <div className="space-y-4">
                  {finances.revenue.map((contract) => (
                    <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg bg-orange-50 border-orange-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{contract.subject}</span>
                          <Badge variant="outline">Contrat #{contract.number}</Badge>
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            Prix Contrat
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {contract.startDate && `Début: ${new Date(contract.startDate).toLocaleDateString('fr-FR')}`}
                          {contract.market_number && ` • Marché: ${contract.market_number}`}
                          {contract.service && ` • Service: ${contract.service}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-orange-600">
                            {formatCurrency(contract.totalValue)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Ajouté automatiquement
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-sm text-muted-foreground">
                            Statut de paiement:
                          </div>
                          <ContractPaymentStatus
                            contract={contract}
                            currentStatus={contract.payment_status || 'pending'}
                            onStatusChange={handleContractPaymentStatusChange}
                            userRole={userRole}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Aucun contrat trouvé
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cashflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Flux de Trésorerie</CardTitle>
              <CardDescription>
                Évolution des marges bénéficiaires, dépenses et bénéfices par mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              {finances.cashFlow && finances.cashFlow.length > 0 ? (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={finances.cashFlow}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip 
                        formatter={(value, name) => [
                          formatCurrency(value), 
                          name === 'revenue' ? 'Marges Bénéficiaires' : 
                          name === 'expenses' ? 'Dépenses' : 'Bénéfice Net'
                        ]}
                        labelFormatter={(label) => `Mois: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#10b981" name="Marges Bénéficiaires" />
                      <Bar dataKey="expenses" fill="#ef4444" name="Dépenses" />
                      <Bar dataKey="net" fill="#3b82f6" name="Bénéfice Net" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  Aucune donnée de flux de trésorerie disponible
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Revenue vs Expenses Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition Marges vs Dépenses</CardTitle>
                <CardDescription>
                  Proportion des marges bénéficiaires et dépenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats.totalRevenue > 0 || stats.totalExpenses > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={[
                            { name: 'Marges Bénéficiaires', value: stats.totalRevenue, color: '#10b981' },
                            { name: 'Dépenses', value: stats.totalExpenses, color: '#ef4444' }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                        >
                          {[
                            { name: 'Marges Bénéficiaires', value: stats.totalRevenue, color: '#10b981' },
                            { name: 'Dépenses', value: stats.totalExpenses, color: '#ef4444' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={formatCurrency} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Aucune donnée disponible
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Monthly Expenses Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Tendance Mensuelle des Dépenses</CardTitle>
                <CardDescription>
                  Évolution des dépenses par mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats.monthlyExpenses.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.monthlyExpenses}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={formatCurrency} />
                        <Tooltip 
                          formatter={(value) => [formatCurrency(value), 'Dépenses']}
                          labelFormatter={(label) => `Mois: ${label}`}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#ef4444"
                          fill="#ef4444"
                          fillOpacity={0.3}
                          name="Dépenses"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Aucune donnée de dépenses disponible
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Expense Modal */}
      <AddExpenseModal
        open={addExpenseOpen}
        onOpenChange={setAddExpenseOpen}
        onSuccess={handleExpenseSuccess}
        userRole={userRole}
      />

      {/* Edit Expense Modal */}
      <EditExpenseModal
        open={editExpenseOpen}
        onOpenChange={setEditExpenseOpen}
        onSuccess={handleExpenseSuccess}
        expense={selectedExpense}
        userRole={userRole}
      />

      {/* Delete Expense Dialog */}
      <DeleteExpenseDialog
        open={deleteExpenseOpen}
        onOpenChange={setDeleteExpenseOpen}
        onSuccess={handleExpenseSuccess}
        expense={selectedExpense}
      />

      {/* Expense Details View */}
      <ExpenseDetailsView
        open={expenseDetailsOpen}
        onOpenChange={setExpenseDetailsOpen}
        expense={selectedExpense}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
        userRole={userRole}
      />
    </div>
  )
} 