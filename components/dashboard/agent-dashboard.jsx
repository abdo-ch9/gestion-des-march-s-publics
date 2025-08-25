"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Progress } from "../../components/ui/progress"
import { FileText, Calendar, DollarSign, TrendingUp, Users, Clock } from "lucide-react"

export function AgentDashboard({ user }) {
  // Mock data for demonstration
  const stats = {
    totalContracts: 24,
    activeContracts: 18,
    completedContracts: 6,
    totalValue: 1250000,
    monthlyProgress: 75,
  }

  const recentContracts = [
    {
      id: "CTR-001",
      title: "Installation Système d'Irrigation",
      client: "Coopérative Al Amal",
      status: "active",
      progress: 65,
      dueDate: "2024-02-15",
      value: 85000,
    },
    {
      id: "CTR-002",
      title: "Formation Techniques Agricoles",
      client: "Association Tifawt",
      status: "completed",
      progress: 100,
      dueDate: "2024-01-30",
      value: 45000,
    },
    {
      id: "CTR-003",
      title: "Maintenance Équipements",
      client: "Ferme Benali",
      status: "active",
      progress: 30,
      dueDate: "2024-03-01",
      value: 32000,
    },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">En cours</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Terminé</Badge>
      case "pending":
        return <Badge variant="outline">En attente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de Bord Agent</h1>
        <p className="text-muted-foreground">Bienvenue, {user?.name || 'Agent'}. Voici un aperçu de vos activités.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contrats</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalContracts}</div>
            <p className="text-xs text-muted-foreground">Contrats assignés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contrats Actifs</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeContracts}</div>
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
              {stats.totalValue.toLocaleString()} MAD
            </div>
            <p className="text-xs text-muted-foreground">Montant des contrats</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression Mensuelle</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.monthlyProgress}%</div>
            <Progress value={stats.monthlyProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Contracts */}
      <Card>
        <CardHeader>
          <CardTitle>Contrats Récents</CardTitle>
          <CardDescription>Vos contrats les plus récents et leur statut</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentContracts.map((contract) => (
              <div
                key={contract.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <h3 className="font-medium">{contract.title}</h3>
                      <p className="text-sm text-muted-foreground">{contract.client}</p>
                    </div>
                    {getStatusBadge(contract.status)}
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Échéance: {new Date(contract.dueDate).toLocaleDateString("fr-FR")}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {contract.value.toLocaleString()} MAD
                    </span>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm font-medium">{contract.progress}%</div>
                  <Progress value={contract.progress} className="h-2 w-20" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" className="w-full">
              Voir Tous les Contrats
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>Accédez rapidement aux fonctionnalités principales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex-col gap-2">
              <FileText className="h-6 w-6" />
              Nouveau Contrat
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              Gérer Clients
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              Planifier Rendez-vous
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 