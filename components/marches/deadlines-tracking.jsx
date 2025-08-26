"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  TrendingDown,
  FileText
} from "lucide-react"
import { useMarkets } from "../../lib/hooks/use-markets"

export function DeadlinesTracking() {
  const { markets, loading, error } = useMarkets()
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [filterStatus, setFilterStatus] = useState("all")

  // Calculate real deadline data from markets
  const deadlineData = {
    totalMarkets: markets.length,
    marketsWithDeadlines: markets.filter(m => m.expected_end_date).length,
    marketsInProgress: markets.filter(m => m.status === 'in_progress').length,
    marketsCompleted: markets.filter(m => m.status === 'completed').length,
    marketsDelayed: markets.filter(m => {
      if (m.expected_end_date && m.status === 'in_progress') {
        const endDate = new Date(m.expected_end_date)
        const today = new Date()
        return endDate < today
      }
      return false
    }).length,
    marketsOnTime: markets.filter(m => {
      if (m.expected_end_date && m.status === 'in_progress') {
        const endDate = new Date(m.expected_end_date)
        const today = new Date()
        return endDate >= today
      }
      return false
    }).length
  }

  // Calculate percentages
  const onTimeRate = deadlineData.marketsInProgress > 0 ? 
    (deadlineData.marketsOnTime / deadlineData.marketsInProgress) * 100 : 0
  const delayedRate = deadlineData.marketsInProgress > 0 ? 
    (deadlineData.marketsDelayed / deadlineData.marketsInProgress) * 100 : 0

  // Get markets with deadlines for detailed tracking
  const marketsWithDeadlines = markets
    .filter(m => m.expected_end_date)
    .map(market => {
      const endDate = new Date(market.expected_end_date)
      const today = new Date()
      const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))
      const isDelayed = daysRemaining < 0 && market.status === 'in_progress'
      const isCompleted = market.status === 'completed'
      
      return {
        ...market,
        daysRemaining,
        isDelayed,
        isCompleted,
        progress: isCompleted ? 100 : 
          isDelayed ? Math.min(100, Math.max(0, 100 + (daysRemaining / 30) * 100)) : 
          Math.min(100, Math.max(0, 100 - (daysRemaining / 30) * 100))
      }
    })
    .sort((a, b) => {
      if (a.isDelayed && !b.isDelayed) return -1
      if (!a.isDelayed && b.isDelayed) return 1
      return a.daysRemaining - b.daysRemaining
    })

  // Get markets by service for deadline analysis
  const marketsByService = markets.reduce((acc, market) => {
    if (market.expected_end_date) {
      const service = market.service || 'Non spécifié'
      if (!acc[service]) {
        acc[service] = { total: 0, delayed: 0, onTime: 0, completed: 0 }
      }
      acc[service].total++
      
      if (market.status === 'completed') {
        acc[service].completed++
      } else if (market.status === 'in_progress') {
        const endDate = new Date(market.expected_end_date)
        const today = new Date()
        if (endDate < today) {
          acc[service].delayed++
        } else {
          acc[service].onTime++
        }
      }
    }
    return acc
  }, {})

  const getStatusBadge = (market) => {
    if (market.isCompleted) {
      return <Badge className="bg-green-100 text-green-800">Terminé</Badge>
    } else if (market.isDelayed) {
      return <Badge className="bg-red-100 text-red-800">En retard</Badge>
    } else if (market.daysRemaining <= 7) {
      return <Badge className="bg-orange-100 text-orange-800">Urgent</Badge>
    } else if (market.daysRemaining <= 30) {
      return <Badge className="bg-yellow-100 text-yellow-800">Proche</Badge>
    } else {
      return <Badge className="bg-blue-100 text-blue-800">Normal</Badge>
    }
  }

  const getProgressColor = (market) => {
    if (market.isCompleted) return "bg-green-500"
    if (market.isDelayed) return "bg-red-500"
    if (market.daysRemaining <= 7) return "bg-orange-500"
    if (market.daysRemaining <= 30) return "bg-yellow-500"
    return "bg-blue-500"
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Chargement des données de délais...</span>
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
            <span>⚠️ Erreur lors du chargement des données de délais:</span>
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
          <h2 className="text-2xl font-bold text-foreground">Suivi des Délais</h2>
          <p className="text-muted-foreground">
            Suivi des échéances et des délais des marchés publics
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

      {/* Deadline Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Marchés</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {deadlineData.totalMarkets}
            </div>
            <p className="text-xs text-muted-foreground">
              Marchés enregistrés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avec Délais</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {deadlineData.marketsWithDeadlines}
            </div>
            <p className="text-xs text-muted-foreground">
              Marchés avec échéances
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À Temps</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {deadlineData.marketsOnTime}
            </div>
            <p className="text-xs text-muted-foreground">
              {onTimeRate.toFixed(1)}% des marchés en cours
            </p>
            <Progress value={onTimeRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Retard</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {deadlineData.marketsDelayed}
            </div>
            <p className="text-xs text-muted-foreground">
              {delayedRate.toFixed(1)}% des marchés en cours
            </p>
            <Progress value={delayedRate} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Deadline Analysis by Service */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse des Délais par Service</CardTitle>
          <CardDescription>
            Répartition des délais selon le service responsable
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(marketsByService).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune donnée de délai disponible
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(marketsByService).map(([service, data]) => (
                <div key={service} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{service}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-600">
                        {data.onTime} à temps
                      </span>
                      <span className="text-red-600">
                        {data.delayed} en retard
                      </span>
                      <span className="text-blue-600">
                        {data.completed} terminés
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 h-2">
                    <div 
                      className="bg-green-500 rounded-l-full" 
                      style={{ width: `${data.total > 0 ? (data.onTime / data.total) * 100 : 0}%` }}
                    />
                    <div 
                      className="bg-red-500" 
                      style={{ width: `${data.total > 0 ? (data.delayed / data.total) * 100 : 0}%` }}
                    />
                    <div 
                      className="bg-blue-500 rounded-r-full" 
                      style={{ width: `${data.total > 0 ? (data.completed / data.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Deadlines Table */}
      <Card>
        <CardHeader>
          <CardTitle>Détail des Délais</CardTitle>
          <CardDescription>
            Suivi détaillé des échéances de tous les marchés
          </CardDescription>
        </CardHeader>
        <CardContent>
          {marketsWithDeadlines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun marché avec des délais définis
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Marché</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date Limite</TableHead>
                  <TableHead>Jours Restants</TableHead>
                  <TableHead>Progression</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketsWithDeadlines.map((market) => (
                  <TableRow key={market.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{market.number}</div>
                        <div className="text-sm text-muted-foreground max-w-xs truncate">
                          {market.object}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{market.service}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(market.expected_end_date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`font-medium ${
                        market.isDelayed ? 'text-red-600' : 
                        market.daysRemaining <= 7 ? 'text-orange-600' : 
                        market.daysRemaining <= 30 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {market.isDelayed ? 
                          `${Math.abs(market.daysRemaining)} jours de retard` : 
                          market.daysRemaining === 0 ? 'Aujourd\'hui' :
                          `${market.daysRemaining} jours`
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Progress value={market.progress} className="h-2" />
                        <span className="text-xs text-muted-foreground">
                          {market.progress.toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(market)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Urgent Deadlines Alert */}
      {deadlineData.marketsDelayed > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Marchés en Retard - Action Requise
            </CardTitle>
            <CardDescription className="text-red-700">
              {deadlineData.marketsDelayed} marché{deadlineData.marketsDelayed !== 1 ? 's' : ''} nécessite{deadlineData.marketsDelayed !== 1 ? 'nt' : ''} une attention immédiate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {marketsWithDeadlines
                .filter(m => m.isDelayed)
                .slice(0, 3)
                .map(market => (
                  <div key={market.id} className="flex items-center justify-between p-3 bg-red-100 rounded-lg">
                    <div>
                      <span className="font-medium">{market.number}</span>
                      <span className="text-sm text-red-700 ml-2">
                        {Math.abs(market.daysRemaining)} jours de retard
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      Voir Détails
                    </Button>
                  </div>
                ))}
              {deadlineData.marketsDelayed > 3 && (
                <div className="text-center text-sm text-red-700">
                  Et {deadlineData.marketsDelayed - 3} autre{deadlineData.marketsDelayed - 3 !== 1 ? 's' : ''} marché{deadlineData.marketsDelayed - 3 !== 1 ? 's' : ''} en retard...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 