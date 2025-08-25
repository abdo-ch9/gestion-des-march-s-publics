"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Progress } from "../../components/ui/progress"
import { FileText, Calendar, DollarSign, TrendingUp, Users, Clock, BarChart3 } from "lucide-react"

export function ManagerDashboard({ user }) {
  // Mock data for demonstration
  const stats = {
    totalContracts: 45,
    activeContracts: 32,
    completedContracts: 10,
    delayedContracts: 3,
    totalValue: 2500000,
    monthlyProgress: 78,
  }

  const teamPerformance = [
    { name: "Ahmed Benali", contracts: 8, completion: 85, status: "excellent" },
    { name: "Fatima Zahra", contracts: 6, completion: 72, status: "good" },
    { name: "Mohammed Alami", contracts: 7, completion: 68, status: "average" },
    { name: "Amina Tazi", contracts: 5, completion: 90, status: "excellent" },
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de Bord Manager</h1>
        <p className="text-muted-foreground">Bienvenue, {user?.name || 'Manager'}. Vue d'ensemble de votre équipe.</p>
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
            <p className="text-xs text-muted-foreground">Contrats de l'équipe</p>
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
            <p className="text-xs text-muted-foreground">Portefeuille total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression Équipe</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.monthlyProgress}%</div>
            <Progress value={stats.monthlyProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance de l'Équipe</CardTitle>
          <CardDescription>Suivi des performances individuelles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamPerformance.map((member) => (
              <div
                key={member.name}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.contracts} contrats</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{member.completion}%</div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${member.completion}%` }}
                      ></div>
                    </div>
                  </div>
                  {getStatusBadge(member.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions de Gestion</CardTitle>
          <CardDescription>Gérez votre équipe et vos contrats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              Gérer Équipe
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              Rapports
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              Planning
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="h-6 w-6" />
              Contrats
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 