"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Progress } from "../../components/ui/progress"
import { FileText, Calendar, DollarSign, TrendingUp, Users, Clock, RefreshCw, AlertCircle } from "lucide-react"
import { useDashboard } from "../../lib/hooks/use-dashboard"
import { SimpleSkeleton } from "../../components/ui/simple-skeleton"

export function AgentDashboard({ user }) {
  const { 
    stats, 
    recentContracts, 
    loading, 
    error, 
    refreshDashboard 
  } = useDashboard()

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <SimpleSkeleton className="h-10 w-64 mb-2" />
          <SimpleSkeleton className="h-5 w-80" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <SimpleSkeleton className="h-4 w-24" />
                <SimpleSkeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <SimpleSkeleton className="h-8 w-16 mb-2" />
                <SimpleSkeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <SimpleSkeleton className="h-6 w-32 mb-2" />
            <SimpleSkeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <SimpleSkeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tableau de Bord Agent</h1>
            <p className="text-muted-foreground">Bienvenue, {user?.name || 'Agent'}. Voici un aperçu de vos activités.</p>
          </div>
          <Button onClick={refreshDashboard} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <div>
                <h3 className="font-medium">Erreur de chargement</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
            <Button onClick={refreshDashboard} className="mt-4" size="sm">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tableau de Bord Agent</h1>
          <p className="text-muted-foreground">Bienvenue, {user?.name || 'Agent'}. Voici un aperçu de vos activités.</p>
        </div>
        <Button onClick={refreshDashboard} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
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
            {recentContracts.length > 0 ? (
              recentContracts.map((contract) => (
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
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucun contrat récent</p>
                <p className="text-sm">Commencez par créer votre premier contrat</p>
              </div>
            )}
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