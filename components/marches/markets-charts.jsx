"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Area,
  AreaChart
} from "recharts"
import { useMarkets } from "../../lib/hooks/use-markets"

export function MarketsCharts() {
  const { markets, loading, error } = useMarkets()
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [chartType, setChartType] = useState("overview")

  // Calculate real chart data from markets
  const chartData = {
    // Status distribution
    statusDistribution: markets.reduce((acc, market) => {
      const status = market.status || 'draft'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {}),

    // Service distribution
    serviceDistribution: markets.reduce((acc, market) => {
      const service = market.service || 'Non spécifié'
      acc[service] = (acc[service] || 0) + 1
      return acc
    }, {}),

    // Contract type distribution
    contractTypeDistribution: markets.reduce((acc, market) => {
      const type = market.contract_type || 'Non spécifié'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {}),

    // Budget source distribution
    budgetSourceDistribution: markets.reduce((acc, market) => {
      const source = market.budget_source || 'Non spécifié'
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {}),

    // Monthly progression (mock data for now, could be enhanced with real dates)
    monthlyProgression: markets.reduce((acc, market) => {
      if (market.created_at) {
        const month = new Date(market.created_at).toLocaleDateString('fr-FR', { month: 'short' })
        if (!acc[month]) {
          acc[month] = { month, count: 0, value: 0 }
        }
        acc[month].count++
        acc[month].value += market.estimated_amount || 0
      }
      return acc
    }, {}),

    // Value by service
    valueByService: markets.reduce((acc, market) => {
      const service = market.service || 'Non spécifié'
      if (!acc[service]) {
        acc[service] = { service, count: 0, value: 0 }
      }
      acc[service].count++
      acc[service].value += market.estimated_amount || 0
      return acc
    }, {}),

    // Timeline data
    timelineData: markets
      .filter(m => m.expected_start_date && m.expected_end_date)
      .map(market => ({
        name: market.number,
        start: new Date(market.expected_start_date).getTime(),
        end: new Date(market.expected_end_date).getTime(),
        value: market.estimated_amount || 0,
        status: market.status
      }))
      .sort((a, b) => a.start - b.start)
  }

  // Convert data for charts
  const statusChartData = Object.entries(chartData.statusDistribution).map(([status, count]) => ({
    name: status === 'draft' ? 'Brouillon' : 
          status === 'published' ? 'Publié' : 
          status === 'in_progress' ? 'En cours' : 
          status === 'completed' ? 'Terminé' : 
          status === 'cancelled' ? 'Annulé' : status,
    value: count,
    fill: status === 'draft' ? '#94a3b8' : 
          status === 'published' ? '#3b82f6' : 
          status === 'in_progress' ? '#10b981' : 
          status === 'completed' ? '#059669' : 
          status === 'cancelled' ? '#ef4444' : '#6b7280'
  }))

  const serviceChartData = Object.entries(chartData.serviceDistribution).map(([service, count]) => ({
    name: service === 'irrigation' ? 'Irrigation' : 
          service === 'formation' ? 'Formation' : 
          service === 'equipement' ? 'Équipement' : 
          service === 'infrastructure' ? 'Infrastructure' : 
          service === 'informatique' ? 'Informatique' : 
          service === 'maintenance' ? 'Maintenance' : service,
    value: count
  }))

  const contractTypeChartData = Object.entries(chartData.contractTypeDistribution).map(([type, count]) => ({
    name: type === 'travaux' ? 'Travaux' : 
          type === 'services' ? 'Services' : 
          type === 'fournitures' ? 'Fournitures' : 
          type === 'maintenance' ? 'Maintenance' : 
          type === 'conseil' ? 'Conseil' : type,
    value: count
  }))

  const budgetSourceChartData = Object.entries(chartData.budgetSourceDistribution).map(([source, count]) => ({
    name: source === 'budget_etat' ? 'Budget État' : 
          source === 'budget_local' ? 'Budget Local' : 
          source === 'don_international' ? 'Don International' : 
          source === 'pret' ? 'Prêt' : 
          source === 'autofinancement' ? 'Autofinancement' : source,
    value: count
  }))

  const monthlyProgressionData = Object.values(chartData.monthlyProgression).map(item => ({
    month: item.month,
    count: item.count,
    value: item.value / 1000000 // Convert to millions
  }))

  const valueByServiceData = Object.values(chartData.valueByService)
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .map(item => ({
      service: item.service === 'irrigation' ? 'Irrigation' : 
               item.service === 'formation' ? 'Formation' : 
               item.service === 'equipement' ? 'Équipement' : 
               item.service === 'infrastructure' ? 'Infrastructure' : 
               item.service === 'informatique' ? 'Informatique' : 
               item.service === 'maintenance' ? 'Maintenance' : item.service,
      value: item.value / 1000000, // Convert to millions
      count: item.count
    }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Chargement des graphiques...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-red-600">
            <span>⚠️ Erreur lors du chargement des graphiques:</span>
            <span className="font-medium">{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Graphiques de Suivi</h2>
          <p className="text-muted-foreground">
            Visualisation des données des marchés publics
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={selectedPeriod === "month" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedPeriod("month")}
          >
            Mois
          </Button>
          <Button 
            variant={selectedPeriod === "quarter" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedPeriod("quarter")}
          >
            Trimestre
          </Button>
          <Button 
            variant={selectedPeriod === "year" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedPeriod("year")}
          >
            Année
          </Button>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex gap-2">
        <Button 
          variant={chartType === "overview" ? "default" : "outline"} 
          size="sm"
          onClick={() => setChartType("overview")}
        >
          Vue d'ensemble
        </Button>
        <Button 
          variant={chartType === "financial" ? "default" : "outline"} 
          size="sm"
          onClick={() => setChartType("financial")}
        >
          Financier
        </Button>
        <Button 
          variant={chartType === "timeline" ? "default" : "outline"} 
          size="sm"
          onClick={() => setChartType("timeline")}
        >
          Chronologie
        </Button>
      </div>

      {/* Overview Charts */}
      {chartType === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Statut</CardTitle>
              <CardDescription>
                Distribution des marchés selon leur statut actuel
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statusChartData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune donnée de statut disponible
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Marchés']} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Service Distribution Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Service</CardTitle>
              <CardDescription>
                Nombre de marchés par service responsable
              </CardDescription>
            </CardHeader>
            <CardContent>
              {serviceChartData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune donnée de service disponible
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={serviceChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, 'Marchés']} />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Contract Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Type de Contrat</CardTitle>
              <CardDescription>
                Distribution selon le type de contrat
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contractTypeChartData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune donnée de type de contrat disponible
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={contractTypeChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, 'Marchés']} />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Budget Source Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Source de Budget</CardTitle>
              <CardDescription>
                Distribution selon la source de financement
              </CardDescription>
            </CardHeader>
            <CardContent>
              {budgetSourceChartData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune donnée de source de budget disponible
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgetSourceChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, 'Marchés']} />
                    <Bar dataKey="value" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Financial Charts */}
      {chartType === "financial" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Progression Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Progression Mensuelle</CardTitle>
              <CardDescription>
                Évolution du nombre et de la valeur des marchés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {monthlyProgressionData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune donnée de progression disponible
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyProgressionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="count" stroke="#3b82f6" name="Nombre de marchés" />
                    <Line yAxisId="right" type="monotone" dataKey="value" stroke="#10b981" name="Valeur (M MAD)" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Value by Service Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Valeur par Service</CardTitle>
              <CardDescription>
                Valeur totale des marchés par service
              </CardDescription>
            </CardHeader>
            <CardContent>
              {valueByServiceData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune donnée de valeur disponible
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={valueByServiceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="service" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} M MAD`, 'Valeur']} />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Timeline Charts */}
      {chartType === "timeline" && (
        <div className="space-y-6">
          {/* Timeline Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Chronologie des Marchés</CardTitle>
              <CardDescription>
                Vue d'ensemble temporelle des marchés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.timelineData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune donnée de chronologie disponible
                </div>
              ) : (
                <div className="space-y-4">
                  {chartData.timelineData.map((market, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{market.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(market.start).toLocaleDateString('fr-FR')} - {new Date(market.end).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {(market.value / 1000000).toFixed(1)} M MAD
                        </div>
                        <Badge variant={market.status === 'completed' ? 'default' : 'outline'}>
                          {market.status === 'completed' ? 'Terminé' : 'En cours'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé des Données</CardTitle>
          <CardDescription>
            Statistiques générales des marchés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{markets.length}</div>
              <div className="text-sm text-muted-foreground">Total Marchés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {markets.filter(m => m.status === 'in_progress').length}
              </div>
              <div className="text-sm text-muted-foreground">En Cours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {markets.filter(m => m.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Terminés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {(markets.reduce((sum, m) => sum + (m.estimated_amount || 0), 0) / 1000000).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Valeur Totale (M MAD)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 