"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Calendar
} from "lucide-react"
import { useMarkets } from "../../lib/hooks/use-markets"

export function FinancialTracking() {
  const { markets, loading, error } = useMarkets()
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  // Calculate real financial data from markets
  const financialData = {
    totalBudget: markets.reduce((sum, m) => sum + (m.estimated_amount || 0), 0),
    committedAmount: markets.reduce((sum, m) => {
      if (m.status === 'in_progress' || m.status === 'completed') {
        return sum + (m.estimated_amount || 0)
      }
      return sum
    }, 0),
    remainingBudget: markets.reduce((sum, m) => {
      if (m.status === 'draft' || m.status === 'published') {
        return sum + (m.estimated_amount || 0)
      }
      return sum
    }, 0),
    completedValue: markets.reduce((sum, m) => {
      if (m.status === 'completed') {
        return sum + (m.estimated_amount || 0)
      }
      return sum
    }, 0),
    delayedValue: markets.reduce((sum, m) => {
      if (m.expected_end_date && m.status === 'in_progress') {
        const endDate = new Date(m.expected_end_date)
        const today = new Date()
        if (endDate < today) {
          return sum + (m.estimated_amount || 0)
        }
      }
      return sum
    }, 0)
  }

  // Calculate percentages
  const commitmentRate = financialData.totalBudget > 0 ? 
    (financialData.committedAmount / financialData.totalBudget) * 100 : 0
  const completionRate = financialData.totalBudget > 0 ? 
    (financialData.completedValue / financialData.totalBudget) * 100 : 0
  const delayRate = financialData.totalBudget > 0 ? 
    (financialData.delayedValue / financialData.totalBudget) * 100 : 0

  // Get markets by budget source
  const marketsBySource = markets.reduce((acc, market) => {
    const source = market.budget_source || 'Non spécifié'
    if (!acc[source]) {
      acc[source] = { count: 0, total: 0, markets: [] }
    }
    acc[source].count++
    acc[source].total += market.estimated_amount || 0
    acc[source].markets.push(market)
    return acc
  }, {})

  // Get markets by service
  const marketsByService = markets.reduce((acc, market) => {
    const service = market.service || 'Non spécifié'
    if (!acc[service]) {
      acc[service] = { count: 0, total: 0, markets: [] }
    }
    acc[service].count++
    acc[service].total += market.estimated_amount || 0
    acc[service].markets.push(market)
    return acc
  }, {})

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Chargement des données financières...</span>
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
            <span>⚠️ Erreur lors du chargement des données financières:</span>
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
          <h2 className="text-2xl font-bold text-foreground">Suivi Financier</h2>
          <p className="text-muted-foreground">
            Suivi des budgets et des engagements financiers des marchés
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

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(financialData.totalBudget)}
            </div>
            <p className="text-xs text-muted-foreground">
              Montant total des marchés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagements</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(financialData.committedAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {commitmentRate.toFixed(1)}% du budget total
            </p>
            <Progress value={commitmentRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Restant</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(financialData.remainingBudget)}
            </div>
            <p className="text-xs text-muted-foreground">
              Disponible pour nouveaux marchés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marchés Terminés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(financialData.completedValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {completionRate.toFixed(1)}% du budget total
            </p>
            <Progress value={completionRate} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Budget Distribution by Source */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par Source de Budget</CardTitle>
          <CardDescription>
            Répartition des marchés selon leur source de financement
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(marketsBySource).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune donnée de source de budget disponible
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(marketsBySource).map(([source, data]) => (
                <div key={source} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{source}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {data.count} marché{data.count !== 1 ? 's' : ''}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(data.total)}
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={financialData.totalBudget > 0 ? (data.total / financialData.totalBudget) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Distribution by Service */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par Service</CardTitle>
          <CardDescription>
            Répartition des marchés selon le service responsable
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(marketsByService).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune donnée de service disponible
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(marketsByService).map(([service, data]) => (
                <div key={service} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{service}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {data.count} marché{data.count !== 1 ? 's' : ''}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(data.total)}
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={financialData.totalBudget > 0 ? (data.total / financialData.totalBudget) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delayed Projects Financial Impact */}
      {financialData.delayedValue > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Impact Financier des Retards
            </CardTitle>
            <CardDescription className="text-orange-700">
              Marchés en retard et leur impact sur le budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Valeur des marchés en retard:</span>
                <span className="text-xl font-bold text-orange-600">
                  {formatCurrency(financialData.delayedValue)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Pourcentage du budget total:</span>
                <span className="text-lg font-medium text-orange-600">
                  {delayRate.toFixed(1)}%
                </span>
              </div>
              <Progress value={delayRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 