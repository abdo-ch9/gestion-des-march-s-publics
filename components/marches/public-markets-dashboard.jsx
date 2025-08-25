"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Progress } from "../../components/ui/progress"
import { 
  FileText, 
  Plus, 
  Edit, 
  Eye, 
  Calendar, 
  DollarSign, 
  Clock, 
  TrendingUp,
  BarChart3,
  Search,
  Filter
} from "lucide-react"
import { MarketsList } from "./markets-list"
import { AddMarketForm } from "./add-market-form"
import { MarketDetails } from "./market-details"
import { FinancialTracking } from "./financial-tracking"
import { DeadlinesTracking } from "./deadlines-tracking"
import { MarketsCharts } from "./markets-charts"

export function PublicMarketsDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isAddMarketOpen, setIsAddMarketOpen] = useState(false)
  const [selectedMarket, setSelectedMarket] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data for demonstration
  const marketsStats = {
    total: 45,
    active: 28,
    completed: 12,
    delayed: 5,
    totalValue: 87500000,
    averageDelay: 12
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
            <AddMarketForm onSuccess={() => setIsAddMarketOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
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
              {(marketsStats.totalValue / 1000000).toFixed(1)}M MAD
            </div>
            <p className="text-xs text-muted-foreground">Montant des marchés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retards Moyens</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{marketsStats.averageDelay} jours</div>
            <p className="text-xs text-muted-foreground">Délai moyen</p>
          </CardContent>
        </Card>
      </div>

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
              <Button variant="outline" size="sm" onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
              }}>
                Réinitialiser
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Répartition par Statut</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>En cours</span>
                      <span className="font-medium">{marketsStats.active}</span>
                    </div>
                    <Progress value={(marketsStats.active / marketsStats.total) * 100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span>Terminés</span>
                      <span className="font-medium">{marketsStats.completed}</span>
                    </div>
                    <Progress value={(marketsStats.completed / marketsStats.total) * 100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span>En retard</span>
                      <span className="font-medium">{marketsStats.delayed}</span>
                    </div>
                    <Progress value={(marketsStats.delayed / marketsStats.total) * 100} className="h-2" />
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Actions Rapides</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <MarketsList 
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onMarketSelect={setSelectedMarket}
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