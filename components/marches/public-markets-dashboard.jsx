"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Progress } from "../../components/ui/progress"
import { FileText, Plus, TrendingUp, DollarSign, Clock, RefreshCw, Search, Filter, BarChart3, Calendar } from "lucide-react"
import { AddMarketForm } from "./add-market-form"
import { MarketsList } from "./markets-list"
import { MarketsCharts } from "./markets-charts"
import { FinancialTracking } from "./financial-tracking"
import { DeadlinesTracking } from "./deadlines-tracking"
import { useMarkets } from "../../lib/hooks/use-markets"
import { useAuth } from "../../lib/auth-context"
import { toast } from "sonner"

export function PublicMarketsDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isAddMarketOpen, setIsAddMarketOpen] = useState(false)
  const [selectedMarket, setSelectedMarket] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
  // Use real data from the database
  const { markets, loading, error, fetchMarkets } = useMarkets()

  // Calculate real statistics from the database
  const marketsStats = {
    total: markets.length,
    active: markets.filter(m => m.status === 'in_progress').length,
    completed: markets.filter(m => m.status === 'completed').length,
    delayed: markets.filter(m => {
      if (m.expected_end_date && m.status === 'in_progress') {
        const endDate = new Date(m.expected_end_date)
        const today = new Date()
        return endDate < today
      }
      return false
    }).length,
    totalValue: markets.reduce((sum, m) => {
      const amount = m.estimated_amount || 0
      console.log(`Market ${m.number}: estimated_amount = ${m.estimated_amount}, type = ${typeof m.estimated_amount}`)
      return sum + (amount || 0)
    }, 0),
    averageDelay: markets.length > 0 ? 
      markets.filter(m => m.expected_end_date)
        .reduce((sum, m) => {
          const endDate = new Date(m.expected_end_date)
          const today = new Date()
          // Calculate delay: positive for past due, negative for future
          const delay = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))
          console.log(`Market ${m.number}: status=${m.status}, end_date=${m.expected_end_date}, endDate=${endDate}, today=${today}, delay=${delay} days`)
          return sum + delay
        }, 0) / Math.max(1, markets.filter(m => m.expected_end_date).length) : 0
  }

  // Debug logging
  useEffect(() => {
    console.log("Markets data:", markets)
    console.log("Markets stats:", marketsStats)
    console.log("Total value calculation:", marketsStats.totalValue)
    console.log("Markets with amounts:", markets.filter(m => m.estimated_amount && m.estimated_amount > 0))
    
    // Debug average delay calculation
    const marketsWithDates = markets.filter(m => m.expected_end_date)
    console.log("Markets with end dates:", marketsWithDates.length)
    console.log("Markets with end dates details:", marketsWithDates.map(m => ({
      number: m.number,
      status: m.status,
      end_date: m.expected_end_date,
      today: new Date().toISOString().split('T')[0]
    })))
    
    if (marketsWithDates.length > 0) {
      const delays = marketsWithDates.map(m => {
        const endDate = new Date(m.expected_end_date)
        const today = new Date()
        return Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)))
      })
      console.log("Individual delays:", delays)
      console.log("Average delay calculation:", delays.reduce((sum, d) => sum + d, 0) / delays.length)
    }
  }, [markets, marketsStats])

  const handleRefresh = () => {
    fetchMarkets()
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">En cours</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Terminé</Badge>
      case "delayed":
        return <Badge className="bg-red-100 text-red-800">En retard</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Marchés Publics</h1>
          <p className="text-muted-foreground">Gérez tous les marchés publics de votre service</p>
        </div>
        <Dialog open={isAddMarketOpen} onOpenChange={setIsAddMarketOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Marché
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un Nouveau Marché</DialogTitle>
              <DialogDescription>
                Remplissez toutes les informations initiales du marché public
              </DialogDescription>
            </DialogHeader>
            <AddMarketForm onSuccess={() => {
              setIsAddMarketOpen(false)
              // Refresh the markets list to show the new market
              handleRefresh()
            }} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Status Summary */}
      {!loading && !error && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-blue-700">
                  Données synchronisées avec la base de données
                </span>
              </div>
              <div className="text-xs text-blue-600">
                {markets.length} marché{markets.length !== 1 ? 's' : ''} chargé{markets.length !== 1 ? 's' : ''}
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
              <span className="text-muted-foreground">Chargement des marchés...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <span>⚠️ Erreur lors du chargement des marchés:</span>
              <span className="font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards - Only show when not loading and no errors */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Marchés</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{marketsStats.total}</div>
            <p className="text-xs text-muted-foreground">Marchés enregistrés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marchés Actifs</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{marketsStats.active}</div>
            <p className="text-xs text-muted-foreground">En cours d'exécution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {marketsStats.totalValue > 0 ? 
                `${(marketsStats.totalValue / 1000000).toFixed(1)}M MAD` : 
                '0.0M MAD'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {marketsStats.totalValue > 0 ? 
                `${markets.length} marché(s) avec montants` : 
                'Aucun montant défini'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retards Moyens</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {marketsStats.averageDelay > 0 ? 
                `${marketsStats.averageDelay} jours de retard` : 
                marketsStats.averageDelay < 0 ? 
                  `${Math.abs(marketsStats.averageDelay)} jours restants` : 
                  '0 jours'
              }
            </div>
            <p className="text-xs text-muted-foreground">Délai moyen</p>
            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-500 mt-1">
                Debug: {markets.filter(m => m.expected_end_date).length} marchés avec dates
              </div>
            )}
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par objet, attributaire, numéro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                }}
              >
                Réinitialiser
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
              >
                Actualiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="list">Liste des Marchés</TabsTrigger>
          <TabsTrigger value="financial">Suivi Financier</TabsTrigger>
          <TabsTrigger value="deadlines">Suivi des Délais</TabsTrigger>
          <TabsTrigger value="charts">Graphiques</TabsTrigger>
          <TabsTrigger value="details">Détails Marché</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vue d'ensemble des Marchés</CardTitle>
              <CardDescription>Résumé des marchés publics de votre service</CardDescription>
            </CardHeader>
            <CardContent>
              {markets.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Aucun marché trouvé
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Commencez par créer votre premier marché public
                  </p>
                  <Button onClick={() => setIsAddMarketOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un Marché
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Répartition par Statut</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>En cours</span>
                        <span className="font-medium">{marketsStats.active}</span>
                      </div>
                      <Progress value={marketsStats.total > 0 ? (marketsStats.active / marketsStats.total) * 100 : 0} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span>Terminés</span>
                        <span className="font-medium">{marketsStats.completed}</span>
                      </div>
                      <Progress value={marketsStats.total > 0 ? (marketsStats.completed / marketsStats.total) * 100 : 0} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span>En retard</span>
                        <span className="font-medium">{marketsStats.delayed}</span>
                      </div>
                      <Progress value={marketsStats.total > 0 ? (marketsStats.delayed / marketsStats.total) * 100 : 0} className="h-2" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Actions Rapides</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" onClick={() => setIsAddMarketOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un marché
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Voir les rapports
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="w-4 h-4 mr-2" />
                        Planifier les échéances
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <MarketsList 
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onMarketSelect={setSelectedMarket}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <FinancialTracking />
        </TabsContent>

        <TabsContent value="deadlines" className="space-y-4">
          <DeadlinesTracking />
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <MarketsCharts />
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedMarket ? (
            <MarketDetails market={selectedMarket} />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Sélectionnez un marché depuis la liste pour voir ses détails
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 