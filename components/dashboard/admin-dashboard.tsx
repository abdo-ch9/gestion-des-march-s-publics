"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Users, FileText, DollarSign, TrendingUp, Shield, Settings, UserPlus, Activity } from "lucide-react"

interface User {
  email: string
  role: "agent" | "manager" | "admin"
  name: string
}

interface AdminDashboardProps {
  user: User
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  // Mock data for admin dashboard
  const systemStats = {
    totalUsers: 45,
    totalContracts: 1247,
    systemValue: 15750000,
    activeProjects: 89,
  }

  const performanceData = [
    { month: "Jan", contracts: 98, users: 42, value: 1200000 },
    { month: "Fév", contracts: 112, users: 43, value: 1450000 },
    { month: "Mar", contracts: 89, users: 44, value: 1100000 },
    { month: "Avr", contracts: 134, users: 45, value: 1680000 },
    { month: "Mai", contracts: 156, users: 45, value: 1920000 },
    { month: "Jun", contracts: 178, users: 45, value: 2200000 },
  ]

  const userActivity = [
    { name: "Ahmed Benali", role: "Agent", contracts: 24, lastActive: "2024-01-20", status: "active" },
    { name: "Fatima Zahra", role: "Agent", contracts: 19, lastActive: "2024-01-20", status: "active" },
    { name: "Mohamed Alami", role: "Manager", contracts: 156, lastActive: "2024-01-19", status: "active" },
    { name: "Aicha Bennani", role: "Agent", contracts: 31, lastActive: "2024-01-18", status: "active" },
    { name: "Youssef Tazi", role: "Agent", contracts: 15, lastActive: "2024-01-15", status: "inactive" },
  ]

  const systemAlerts = [
    { type: "warning", message: "5 contrats nécessitent une validation urgente", time: "Il y a 2h" },
    { type: "info", message: "Mise à jour système programmée pour demain", time: "Il y a 4h" },
    { type: "success", message: "Sauvegarde automatique effectuée", time: "Il y a 6h" },
    { type: "error", message: "Échec de synchronisation avec le système externe", time: "Il y a 8h" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Actif
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Inactif
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "error":
        return <Badge variant="destructive">Erreur</Badge>
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Attention
          </Badge>
        )
      case "success":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Succès
          </Badge>
        )
      case "info":
        return <Badge variant="outline">Info</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Administration Système</h1>
          <p className="text-muted-foreground">Gestion complète du système ORMVAO</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </Button>
          <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Nouvel Utilisateur
          </Button>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{systemStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+3 ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contrats Total</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{systemStats.totalContracts}</div>
            <p className="text-xs text-muted-foreground">+15% ce trimestre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Système</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemStats.systemValue.toLocaleString()} MAD</div>
            <p className="text-xs text-muted-foreground">+22% ce trimestre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets Actifs</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{systemStats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">En cours</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="system">Système</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Système</CardTitle>
                <CardDescription>Évolution des métriques clés</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="contracts" stroke="var(--color-primary)" strokeWidth={2} />
                    <Line type="monotone" dataKey="users" stroke="var(--color-secondary)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertes Système</CardTitle>
                <CardDescription>Notifications et événements récents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemAlerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getAlertBadge(alert.type)}
                        <span className="text-sm">{alert.message}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Utilisateurs</CardTitle>
              <CardDescription>Liste des utilisateurs et leur activité</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Contrats</TableHead>
                    <TableHead>Dernière Activité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userActivity.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.contracts}</TableCell>
                      <TableCell>{new Date(user.lastActive).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
                          <Button variant="outline" size="sm">
                            <Shield className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>État du Système</CardTitle>
                <CardDescription>Santé et performance du système</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Serveur Principal</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    En ligne
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Base de Données</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Opérationnelle
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Système de Fichiers</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Attention
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>API Externe</span>
                  <Badge variant="destructive">Hors ligne</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance</CardTitle>
                <CardDescription>Outils d'administration système</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Settings className="w-4 h-4 mr-2" />
                  Configuration Système
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Shield className="w-4 h-4 mr-2" />
                  Sauvegardes
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Activity className="w-4 h-4 mr-2" />
                  Logs Système
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Rapports de Performance
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Valeur Mensuelle du Système</CardTitle>
              <CardDescription>Évolution de la valeur totale des contrats</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} MAD`, "Valeur"]} />
                  <Bar dataKey="value" fill="var(--color-primary)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
