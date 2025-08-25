"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Progress } from "../../components/ui/progress"
import { FileText, Calendar, DollarSign, TrendingUp, Users, Clock, BarChart3, Settings, Shield } from "lucide-react"

export function AdminDashboard({ user }) {
  // Mock data for demonstration
  const stats = {
    totalContracts: 67,
    activeContracts: 45,
    completedContracts: 18,
    delayedContracts: 4,
    totalValue: 4500000,
    monthlyProgress: 82,
    totalUsers: 24,
    activeUsers: 21,
  }

  const systemHealth = [
    { metric: "Performance", value: 95, status: "excellent" },
    { metric: "Sécurité", value: 98, status: "excellent" },
    { metric: "Disponibilité", value: 99.5, status: "excellent" },
    { metric: "Sauvegarde", value: 100, status: "excellent" },
  ]

  const recentActivities = [
    { action: "Nouveau marché créé", user: "Ahmed Benali", time: "Il y a 2 heures", type: "create" },
    { action: "Décompte validé", user: "Fatima Zahra", time: "Il y a 4 heures", type: "approve" },
    { action: "Utilisateur connecté", user: "Mohammed Alami", time: "Il y a 6 heures", type: "login" },
    { action: "Rapport généré", user: "Amina Tazi", time: "Il y a 8 heures", type: "report" },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
      case "good":
        return <Badge className="bg-blue-100 text-blue-800">Bon</Badge>
      case "average":
        return <Badge className="bg-yellow-100 text-yellow-800">Moyen</Badge>
      case "poor":
        return <Badge className="bg-red-100 text-red-800">Faible</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case "create":
        return <FileText className="w-4 h-4 text-green-600" />
      case "approve":
        return <Shield className="w-4 h-4 text-blue-600" />
      case "login":
        return <Users className="w-4 h-4 text-purple-600" />
      case "report":
        return <BarChart3 className="w-4 h-4 text-orange-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de Bord Administrateur</h1>
        <p className="text-muted-foreground">Bienvenue, {user?.name || 'Administrateur'}. Vue d'ensemble du système.</p>
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
            <p className="text-xs text-muted-foreground">Tous les contrats</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Sur {stats.totalUsers} total</p>
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
            <p className="text-xs text-muted-foreground">Portefeuille total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Système</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.monthlyProgress}%</div>
            <Progress value={stats.monthlyProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* System Health and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>Santé du Système</CardTitle>
            <CardDescription>Métriques de performance système</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((item) => (
                <div key={item.metric} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">{item.metric}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">{item.value}%</div>
                    {getStatusBadge(item.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Activités Récentes</CardTitle>
            <CardDescription>Dernières actions du système</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <div className="text-sm font-medium">{activity.action}</div>
                    <div className="text-xs text-muted-foreground">
                      par {activity.user} • {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Administratives</CardTitle>
          <CardDescription>Gérez le système et les utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              Gérer Utilisateurs
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Settings className="h-6 w-6" />
              Configuration
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              Rapports Système
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Shield className="h-6 w-6" />
              Sécurité
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 