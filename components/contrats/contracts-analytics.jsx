"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { TrendingUp, TrendingDown, Clock, DollarSign, BarChart3 } from "lucide-react"
import { 
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts"

export function ContractsAnalytics({ contracts = [] }) {
  const [timeRange, setTimeRange] = useState("6months")
  const [chartType, setChartType] = useState("service")

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

  // Helper function to get status labels in French
  const getStatusLabel = (status) => {
    const statusLabels = {
      'draft': 'Brouillon',
      'active': 'En cours',
      'completed': 'Terminé',
      'suspended': 'Suspendu',
      'cancelled': 'Annulé'
    }
    return statusLabels[status] || status
  }

  // Calculate monthly evolution data from real contracts
  const monthlyEvolutionData = useMemo(() => {
    if (!contracts || contracts.length === 0) {
      return []
    }

    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
    const currentMonth = new Date().getMonth()
    
    return months.slice(0, currentMonth + 1).map((month, index) => {
      const monthContracts = contracts.filter(contract => {
        const contractDate = new Date(contract.start_date)
        return contractDate.getMonth() === index
      })
      
      const monthValue = monthContracts.reduce((sum, contract) => {
        return sum + (parseFloat(contract.initial_amount) || 0)
      }, 0)
      
      return {
        month,
        value: monthValue,
        count: monthContracts.length
      }
    })
  }, [contracts])

  // Calculate service distribution from real contracts
  const serviceDistribution = useMemo(() => {
    if (!contracts || contracts.length === 0) {
      return []
    }

    const serviceCounts = {}
    contracts.forEach(contract => {
      const service = contract.service || 'non_specifie'
      serviceCounts[service] = (serviceCounts[service] || 0) + 1
    })

    return Object.entries(serviceCounts).map(([service, count]) => ({
      service,
      count,
      label: service.charAt(0).toUpperCase() + service.slice(1)
    }))
  }, [contracts])

  // Calculate status distribution from real contracts
  const statusDistribution = useMemo(() => {
    if (!contracts || contracts.length === 0) {
      return []
    }

    const statusCounts = {}
    contracts.forEach(contract => {
      const status = contract.status || 'draft'
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      label: getStatusLabel(status)
    }))
  }, [contracts])

  // Calculate financial metrics from real contracts
  const financialMetrics = useMemo(() => {
    if (!contracts || contracts.length === 0) {
      return {
        totalValue: 0,
        activeValue: 0,
        completedValue: 0,
        overdueValue: 0,
        nearDeadlineValue: 0
      }
    }

    const totalValue = contracts.reduce((sum, contract) => {
      return sum + (parseFloat(contract.initial_amount) || 0)
    }, 0)

    const activeValue = contracts
      .filter(contract => contract.status === 'active')
      .reduce((sum, contract) => sum + (parseFloat(contract.initial_amount) || 0), 0)

    const completedValue = contracts
      .filter(contract => contract.status === 'completed')
      .reduce((sum, contract) => sum + (parseFloat(contract.initial_amount) || 0), 0)

    const overdueValue = contracts
      .filter(contract => contract.is_overdue)
      .reduce((sum, contract) => sum + (parseFloat(contract.initial_amount) || 0), 0)

    const nearDeadlineValue = contracts
      .filter(contract => contract.is_near_deadline && !contract.is_overdue)
      .reduce((sum, contract) => sum + (parseFloat(contract.initial_amount) || 0), 0)

    return {
      totalValue,
      activeValue,
      completedValue,
      overdueValue,
      nearDeadlineValue
    }
  }, [contracts])

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const renderChart = () => {
    switch (chartType) {
      case "service":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={serviceDistribution.map(({ label, count }) => ({
                  name: label,
                  value: count
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {serviceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )

      case "status":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={statusDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )

      case "evolution":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-lg font-medium">Graphique d'Évolution Mensuelle</p>
                <p className="text-sm">Utilisez la section dédiée ci-dessous pour voir l'évolution mensuelle</p>
              </div>
            </div>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analyses des Contrats</h2>
          <p className="text-muted-foreground">
            Graphiques et statistiques pour le suivi des contrats
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">3 mois</SelectItem>
              <SelectItem value="6months">6 mois</SelectItem>
              <SelectItem value="1year">1 an</SelectItem>
            </SelectContent>
          </Select>

          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type de Graphique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="service">Répartition par Service</SelectItem>
              <SelectItem value="status">Répartition par Statut</SelectItem>
              <SelectItem value="evolution">Évolution Mensuelle</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(financialMetrics.totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {contracts.length} contrats
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contrats Actifs</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(financialMetrics.activeValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              En cours d'exécution
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Retard</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(financialMetrics.overdueValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Délais dépassés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Délais Proches</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(financialMetrics.nearDeadlineValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Délais proches
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {chartType === "service" && "Répartition par Service"}
            {chartType === "status" && "Répartition par Statut"}
            {chartType === "evolution" && "Graphique d'Évolution Mensuelle"}
          </CardTitle>
          <CardDescription>
            {chartType === "service" && "Répartition des contrats par service"}
            {chartType === "status" && "Répartition des contrats par statut"}
            {chartType === "evolution" && "Utilisez la section dédiée ci-dessous pour voir l'évolution mensuelle"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      {/* Monthly Evolution Chart - Always Visible */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Évolution Mensuelle des Contrats
          </CardTitle>
          <CardDescription>
            Suivi de la valeur et du nombre de contrats par mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          {monthlyEvolutionData.length > 0 ? (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyEvolutionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value)}
                    domain={[0, 'dataMax + 100000']}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'value' ? formatCurrency(value) : value,
                      name === 'value' ? 'Valeur des Contrats' : 'Nombre de Contrats'
                    ]}
                    labelFormatter={(label) => `Mois: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    name="Valeur des Contrats"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Aucune donnée disponible pour l'évolution mensuelle
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Service</CardTitle>
            <CardDescription>Nombre de contrats par service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {serviceDistribution.map(({ label, count }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="capitalize">{label}</span>
                  <Badge variant="secondary">{count} contrats</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertes et Statuts</CardTitle>
            <CardDescription>État actuel des contrats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {statusDistribution.map(({ label, count }) => (
                <div key={label} className="flex items-center justify-between">
                  <span>{label}</span>
                  <Badge variant="default">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}