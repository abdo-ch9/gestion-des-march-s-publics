"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { FileText, Users, DollarSign, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface User {
  email: string
  role: "agent" | "manager" | "admin"
  name: string
}

interface ManagerDashboardProps {
  user: User
}

export function ManagerDashboard({ user }: ManagerDashboardProps) {
  // Mock data for manager dashboard
  const stats = {
    totalContracts: 156,
    pendingApproval: 23,
    totalValue: 2450000,
    activeAgents: 12,
  }

  const monthlyData = [
    { month: "Jan", contracts: 12, value: 180000 },
    { month: "Fév", contracts: 19, value: 320000 },
    { month: "Mar", contracts: 15, value: 250000 },
    { month: "Avr", contracts: 22, value: 410000 },
    { month: "Mai", contracts: 18, value: 290000 },
    { month: "Jun", contracts: 25, value: 480000 },
  ]

  const statusData = [
    { name: "Approuvés", value: 89, color: "#22c55e" },
    { name: "En attente", value: 23, color: "#eab308" },
    { name: "Rejetés", value: 12, color: "#ef4444" },
    { name: "En révision", value: 32, color: "#3b82f6" },
  ]

  const pendingContracts = [
    {
      id: "CNT-2024-045",
      title: "Système d'irrigation moderne - Secteur D",
      agent: "Ahmed Benali",
      amount: 320000,
      priority: "high",
      date: "2024-01-20",
    },
    {
      id: "CNT-2024-046",
      title: "Formation en agriculture biologique",
      agent: "Fatima Zahra",
      amount: 45000,
      priority: "medium",
      date: "2024-01-19",
    },
    {
      id: "CNT-2024-047",
      title: "Équipement de stockage - Coopérative E",
      agent: "Mohamed Alami",
      amount: 180000,
      priority: "high",
      date: "2024-01-18",
    },
  ]

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Urgent
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Moyen
          </Badge>
        )
      case "low":
        return <Badge variant="outline">Faible</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de Bord Manager</h1>
        <p className="text-muted-foreground">Vue d'ensemble des contrats et performance de l'équipe</p>
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
            <p className="text-xs text-muted-foreground">+12% ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingApproval}</div>
            <p className="text-xs text-muted-foreground">Nécessitent approbation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalValue.toLocaleString()} MAD</div>
            <p className="text-xs text-muted-foreground">+8% ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agents Actifs</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.activeAgents}</div>
            <p className="text-xs text-muted-foreground">Équipe complète</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="pending">En Attente</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution Mensuelle</CardTitle>
                <CardDescription>Nombre de contrats par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="contracts" fill="var(--color-primary)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Statut</CardTitle>
                <CardDescription>Distribution des contrats</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Valeur Mensuelle des Contrats</CardTitle>
              <CardDescription>Évolution de la valeur en MAD</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} MAD`, "Valeur"]} />
                  <Bar dataKey="value" fill="var(--color-secondary)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contrats en Attente d'Approbation</CardTitle>
              <CardDescription>Contrats nécessitant votre validation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingContracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{contract.title}</h4>
                        {getPriorityBadge(contract.priority)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>ID: {contract.id}</span>
                        <span>Agent: {contract.agent}</span>
                        <span>{contract.amount.toLocaleString()} MAD</span>
                        <span>{new Date(contract.date).toLocaleDateString("fr-FR")}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Réviser
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approuver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
