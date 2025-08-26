"use client"

import { useState, useMemo } from "react"
import { useAuth } from "../../lib/auth-context"
import { useContracts } from "../../lib/hooks/use-contracts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { Plus, Search, Filter, TrendingUp, Clock, CheckCircle, AlertTriangle, RefreshCw, DollarSign, TrendingDown } from "lucide-react"
import { ContractsList } from "./contracts-list"
import { AddContractModal } from "./add-contract-modal"
import { ContractDetails } from "./contract-details"
import { ContractsAnalytics } from "./contracts-analytics"
import { toast } from "sonner"
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts"

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

export function ContractsDashboard() {
  const { user } = useAuth()
  const { 
    contracts, 
    loading, 
    error, 
    fetchContracts 
  } = useContracts()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  
  // Get the user role from authentication context
  const userRole = user?.role

  // Calculate dynamic statistics from real contracts data
  const contractsStats = useMemo(() => {
    if (!contracts || contracts.length === 0) {
      return {
        totalValue: 0,
        activeContracts: 0,
        overdueContracts: 0,
        nearDeadlineContracts: 0,
        completedContracts: 0,
        totalContracts: 0
      }
    }

    const totalValue = contracts.reduce((sum, contract) => {
      return sum + (parseFloat(contract.initial_amount) || 0)
    }, 0)

    const activeContracts = contracts.filter(contract => contract.status === 'active').length
    const overdueContracts = contracts.filter(contract => contract.is_overdue).length
    const nearDeadlineContracts = contracts.filter(contract => contract.is_near_deadline).length
    const completedContracts = contracts.filter(contract => contract.status === 'completed').length

    return {
      totalValue,
      activeContracts,
      overdueContracts,
      nearDeadlineContracts,
      completedContracts,
      totalContracts: contracts.length
    }
  }, [contracts])

  // Calculate monthly evolution data
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

  // Calculate service distribution
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

  // Calculate status distribution
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

  const handleAddContract = () => {
    setIsAddModalOpen(true)
  }

  const handleViewDetails = (contract) => {
    setSelectedContract(contract)
    setIsDetailsModalOpen(true)
  }

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false)
    setSelectedContract(null)
  }

  const handleRefresh = () => {
    fetchContracts()
    toast.success("Liste des contrats actualisée")
  }

  // Filter contracts based on search and filters
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = !searchTerm || 
      contract.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.awardee.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter
    const matchesService = serviceFilter === "all" || contract.service === serviceFilter
    
    return matchesSearch && matchesStatus && matchesService
  })

  // Sort contracts
  const sortedContracts = [...filteredContracts].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.start_date) - new Date(a.start_date)
      case "amount":
        return (b.initial_amount || 0) - (a.initial_amount || 0)
      case "status":
        return a.status.localeCompare(b.status)
      case "deadline":
        return new Date(a.deadline_date) - new Date(b.deadline_date)
      default:
        return new Date(b.created_at) - new Date(a.created_at)
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Contrats</h1>
          <p className="text-muted-foreground">
            Gérez tous vos contrats, suivez les délais et les décomptes financiers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          {userRole === "admin" && (
            <Button onClick={handleAddContract} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Contrat
            </Button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">
                Erreur: {error}
              </span>
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
                  Données synchronisées avec la base de données
                </span>
              </div>
              <div className="text-xs text-blue-600">
                {contracts.length} contrat{contracts.length !== 1 ? 's' : ''} chargé{contracts.length !== 1 ? 's' : ''}
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
              <span className="text-muted-foreground">Chargement des contrats...</span>
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
              <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(contractsStats.totalValue)}</div>
              <p className="text-xs text-muted-foreground">
                {contractsStats.totalContracts} contrat(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contrats Actifs</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{contractsStats.activeContracts}</div>
              <p className="text-xs text-muted-foreground">
                En cours d'exécution
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Retard</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{contractsStats.overdueContracts}</div>
              <p className="text-xs text-muted-foreground">
                Délais dépassés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Délais Proches</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{contractsStats.nearDeadlineContracts}</div>
              <p className="text-xs text-muted-foreground">
                Attention requise
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche et Filtres</CardTitle>
          <CardDescription>
            Trouvez rapidement vos contrats et appliquez des filtres
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par numéro, objet ou attributaire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="active">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les services</SelectItem>
                <SelectItem value="eau">Eau</SelectItem>
                <SelectItem value="assainissement">Assainissement</SelectItem>
                <SelectItem value="irrigation">Irrigation</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date de début</SelectItem>
                <SelectItem value="amount">Montant</SelectItem>
                <SelectItem value="status">Statut</SelectItem>
                <SelectItem value="deadline">Délai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="list">Liste des Contrats</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {/* Loading skeleton for summary card */}
              <Card>
                <CardHeader>
                  <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-64 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                        <div className="space-y-1">
                          {[...Array(3)].map((_, j) => (
                            <div key={j} className="flex justify-between">
                              <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                              <div className="h-5 w-12 bg-muted animate-pulse rounded" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Loading skeleton for monthly evolution chart */}
              <Card>
                <CardHeader>
                  <div className="h-6 w-64 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-80 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>

              {/* Loading skeleton for distribution cards */}
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="flex items-center justify-between">
                            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                            <div className="h-5 w-12 bg-muted animate-pulse rounded" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Résumé des Contrats</CardTitle>
                  <CardDescription>
                    Vue d'ensemble de vos contrats par service et statut
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <h4 className="font-medium">Par Service</h4>
                      {serviceDistribution.length > 0 ? (
                        <div className="space-y-1">
                          {serviceDistribution.map((item) => (
                            <div key={item.service} className="flex justify-between">
                              <span className="capitalize">{item.label}</span>
                              <Badge variant="secondary">
                                {item.count} contrat{item.count !== 1 ? 's' : ''}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-sm">Aucun service disponible</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Par Statut</h4>
                      {statusDistribution.length > 0 ? (
                        <div className="space-y-1">
                          {statusDistribution.map((item) => (
                            <div key={item.status} className="flex justify-between">
                              <span>{item.label}</span>
                              <Badge 
                                variant={
                                  item.status === 'active' ? 'default' : 
                                  item.status === 'completed' ? 'secondary' : 
                                  item.status === 'overdue' ? 'destructive' : 'outline'
                                }
                              >
                                {item.count}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-sm">Aucun statut disponible</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Alertes</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Délais proches</span>
                          <Badge variant="outline" className="text-orange-600">
                            {contractsStats.nearDeadlineContracts}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Contrats en retard</span>
                          <Badge variant="destructive">
                            {contractsStats.overdueContracts}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Evolution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Évolution Mensuelle des Contrats</CardTitle>
                  <CardDescription>
                    Suivi de la valeur et du nombre de contrats par mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {monthlyEvolutionData.length > 0 ? (
                    <div className="h-[300px]">
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
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      Aucune donnée disponible pour l'évolution mensuelle
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Service and Status Distribution Cards */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Service Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition par Service</CardTitle>
                    <CardDescription>
                      Nombre de contrats par service
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {serviceDistribution.length > 0 ? (
                      <div className="space-y-3">
                        {serviceDistribution.map((item) => (
                          <div key={item.service} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.label}</span>
                            <Badge variant="secondary">
                              {item.count} contrat{item.count > 1 ? 's' : ''}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        Aucun service disponible
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Status Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Alertes et Statuts</CardTitle>
                    <CardDescription>
                      État actuel des contrats
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {statusDistribution.length > 0 ? (
                      <div className="space-y-3">
                        {statusDistribution.map((item) => (
                          <div key={item.status} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.label}</span>
                            <Badge 
                              variant={
                                item.status === 'active' ? 'default' : 
                                item.status === 'completed' ? 'secondary' : 
                                item.status === 'overdue' ? 'destructive' : 
                                item.status === 'draft' ? 'outline' : 'outline'
                              }
                              className={
                                item.status === 'overdue' ? 'text-red-600 border-red-600' : ''
                              }
                            >
                              {item.count}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        Aucun statut disponible
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <ContractsList
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            serviceFilter={serviceFilter}
            sortBy={sortBy}
            onViewDetails={handleViewDetails}
            userRole={userRole}
            contracts={sortedContracts}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <ContractsAnalytics contracts={contracts} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddContractModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        userRole={userRole}
        onSuccess={() => {
          setIsAddModalOpen(false)
          handleRefresh()
        }}
      />

      <ContractDetails
        contract={selectedContract}
        open={isDetailsModalOpen}
        onOpenChange={handleCloseDetails}
        userRole={userRole}
        onRefresh={handleRefresh}
      />
    </div>
  )
}

// Missing FileText icon import
const FileText = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
) 