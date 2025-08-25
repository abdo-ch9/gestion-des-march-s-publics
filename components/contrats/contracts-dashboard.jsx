"use client"

import { useState } from "react"
import { useAuth } from "../../lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { Plus, Search, Filter, TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { ContractsList } from "./contracts-list"
import { AddContractModal } from "./add-contract-modal"
import { ContractDetails } from "./contract-details"

export function ContractsDashboard() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  
  // TEMPORARY: Force admin role for testing
  const [forceAdminRole, setForceAdminRole] = useState(false)
  
  // Get the effective user role (either real or forced)
  const effectiveUserRole = forceAdminRole ? "admin" : user?.role

  // Mock data - replace with real data from Supabase
  const contractsStats = {
    total: 24,
    active: 18,
    completed: 4,
    overdue: 2,
    totalValue: 2845000
  }

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
        {effectiveUserRole === "admin" && (
          <Button onClick={handleAddContract} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Contrat
          </Button>
        )}
      </div>

      {/* Debug Info - Temporary */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800">Debug Info (Temporaire)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
            <div>
              <span className="font-medium">Email:</span> {user?.email || 'Non défini'}
            </div>
            <div>
              <span className="font-medium">Rôle:</span> 
              <span className={forceAdminRole ? "text-orange-600 font-bold" : ""}>
                {effectiveUserRole || 'Non défini'}
                {forceAdminRole && " (FORCÉ)"}
              </span>
            </div>
            <div>
              <span className="font-medium">Nom:</span> {user?.name || 'Non défini'}
            </div>
            <div>
              <span className="font-medium">ID:</span> {user?.id || 'Non défini'}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setForceAdminRole(!forceAdminRole)
                console.log("Toggling admin role:", !forceAdminRole)
              }}
              className={forceAdminRole ? "bg-orange-100 text-orange-700 border-orange-600" : "text-orange-600 border-orange-600 hover:bg-orange-50"}
            >
              {forceAdminRole ? "🔒 Désactiver Rôle Admin" : "🔧 Forcer Rôle Admin"}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                console.log("Current user object:", user)
                console.log("Real user role:", user?.role)
                console.log("Effective user role:", effectiveUserRole)
                console.log("Force admin role:", forceAdminRole)
                console.log("User role check:", effectiveUserRole === "admin")
              }}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              📊 Log User Info
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={async () => {
                try {
                  const { createClient } = await import("../../lib/supabase")
                  const supabase = createClient()
                  
                  console.log("Testing Supabase connection...")
                  
                  // Test 1: Vérifier la connexion
                  const { data: testData, error: testError } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .limit(1)
                  
                  if (testError) {
                    console.log("❌ user_profiles table error:", testError)
                    
                    // Test 2: Vérifier si la table existe
                    const { data: tables, error: tablesError } = await supabase
                      .from('information_schema.tables')
                      .select('table_name')
                      .eq('table_schema', 'public')
                      .eq('table_name', 'user_profiles')
                    
                    if (tablesError) {
                      console.log("❌ Cannot check tables:", tablesError)
                    } else if (tables.length === 0) {
                      console.log("❌ user_profiles table does not exist")
                      console.log("💡 Run the SQL script: supabase_user_profiles_setup.sql")
                    } else {
                      console.log("✅ user_profiles table exists")
                    }
                  } else {
                    console.log("✅ user_profiles table accessible:", testData)
                  }
                  
                  // Test 3: Vérifier l'utilisateur actuel
                  const { data: { user: currentUser } } = await supabase.auth.getUser()
                  console.log("Current Supabase user:", currentUser)
                  
                } catch (error) {
                  console.error("Test error:", error)
                }
              }}
              className="text-purple-600 border-purple-600 hover:bg-purple-50"
            >
              🔍 Test Supabase
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contrats</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractsStats.total}</div>
            <p className="text-xs text-muted-foreground">
              Contrats actifs et terminés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contrats Actifs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractsStats.active}</div>
            <p className="text-xs text-muted-foreground">
              En cours d'exécution
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminés</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractsStats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Contrats finalisés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Retard</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{contractsStats.overdue}</div>
            <p className="text-xs text-muted-foreground">
              Délais dépassés
            </p>
          </CardContent>
        </Card>
      </div>

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
                <SelectItem value="active">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
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
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Eau</span>
                      <Badge variant="secondary">8 contrats</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Assainissement</span>
                      <Badge variant="secondary">6 contrats</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Irrigation</span>
                      <Badge variant="secondary">5 contrats</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Maintenance</span>
                      <Badge variant="secondary">5 contrats</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Par Statut</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>En cours</span>
                      <Badge variant="default">18</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Terminé</span>
                      <Badge variant="secondary">4</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>En retard</span>
                      <Badge variant="destructive">2</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Alertes</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Délais proches</span>
                      <Badge variant="outline" className="text-orange-600">3</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Décomptes en attente</span>
                      <Badge variant="outline" className="text-blue-600">7</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <ContractsList
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            serviceFilter={serviceFilter}
            sortBy={sortBy}
            onViewDetails={handleViewDetails}
            userRole={effectiveUserRole}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyses des Contrats</CardTitle>
              <CardDescription>
                Graphiques et statistiques pour le suivi des contrats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Les graphiques d'analyse seront affichés ici (évolution des décomptes, 
                consommation des délais, répartition par service, etc.)
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddContractModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        userRole={effectiveUserRole}
      />

      <ContractDetails
        contract={selectedContract}
        open={isDetailsModalOpen}
        onOpenChange={handleCloseDetails}
        userRole={effectiveUserRole}
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