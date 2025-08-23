"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Download,
  FileText,
  Calendar,
  CreditCard,
} from "lucide-react"

interface User {
  email: string
  role: "agent" | "manager" | "admin"
  name: string
}

interface FinancialDashboardProps {
  user: User
}

export function FinancialDashboard({ user }: FinancialDashboardProps) {
  // Mock financial data
  const financialStats = {
    totalBudget: 25000000,
    allocatedBudget: 18750000,
    spentBudget: 12500000,
    remainingBudget: 12500000,
    pendingPayments: 2250000,
  }

  const monthlySpending = [
    { month: "Jan", spent: 1800000, allocated: 2000000, budget: 2200000 },
    { month: "Fév", spent: 2100000, allocated: 2300000, budget: 2500000 },
    { month: "Mar", spent: 1950000, allocated: 2100000, budget: 2300000 },
    { month: "Avr", spent: 2400000, allocated: 2600000, budget: 2800000 },
    { month: "Mai", spent: 2200000, allocated: 2400000, budget: 2600000 },
    { month: "Jun", spent: 2050000, allocated: 2350000, budget: 2600000 },
  ]

  const budgetCategories = [
    { name: "Irrigation", allocated: 8000000, spent: 5200000, color: "#22c55e" },
    { name: "Équipement", allocated: 6000000, spent: 4100000, color: "#3b82f6" },
    { name: "Formation", allocated: 3000000, spent: 1800000, color: "#f59e0b" },
    { name: "Infrastructure", allocated: 1750000, spent: 1400000, color: "#ef4444" },
  ]

  const recentTransactions = [
    {
      id: "TXN-2024-001",
      contract: "CNT-2024-045",
      description: "Système d'irrigation - Secteur D",
      amount: 320000,
      type: "payment",
      status: "completed",
      date: "2024-01-20",
      category: "Irrigation",
    },
    {
      id: "TXN-2024-002",
      contract: "CNT-2024-046",
      description: "Formation agriculture biologique",
      amount: 45000,
      type: "payment",
      status: "pending",
      date: "2024-01-19",
      category: "Formation",
    },
    {
      id: "TXN-2024-003",
      contract: "CNT-2024-047",
      description: "Équipement stockage - Coopérative E",
      amount: 180000,
      type: "allocation",
      status: "approved",
      date: "2024-01-18",
      category: "Équipement",
    },
    {
      id: "TXN-2024-004",
      contract: "CNT-2024-048",
      description: "Maintenance infrastructure",
      amount: 75000,
      type: "payment",
      status: "completed",
      date: "2024-01-17",
      category: "Infrastructure",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Terminé
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            En attente
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Approuvé
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rejeté</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <CreditCard className="w-4 h-4 text-red-600" />
      case "allocation":
        return <DollarSign className="w-4 h-4 text-green-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const budgetUtilization = (financialStats.spentBudget / financialStats.totalBudget) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Suivi Financier</h1>
          <p className="text-muted-foreground">Gestion budgétaire et suivi des dépenses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Période
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{financialStats.totalBudget.toLocaleString()} MAD</div>
            <p className="text-xs text-muted-foreground">Budget annuel 2024</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Alloué</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {financialStats.allocatedBudget.toLocaleString()} MAD
            </div>
            <p className="text-xs text-muted-foreground">75% du budget total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Dépensé</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{financialStats.spentBudget.toLocaleString()} MAD</div>
            <p className="text-xs text-muted-foreground">50% du budget total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Restant</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {financialStats.remainingBudget.toLocaleString()} MAD
            </div>
            <p className="text-xs text-muted-foreground">50% disponible</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements Pendants</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {financialStats.pendingPayments.toLocaleString()} MAD
            </div>
            <p className="text-xs text-muted-foreground">En attente de validation</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisation du Budget</CardTitle>
          <CardDescription>Progression de l'utilisation budgétaire annuelle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Budget utilisé</span>
                <span>{budgetUtilization.toFixed(1)}%</span>
              </div>
              <Progress value={budgetUtilization} className="h-3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Alloué:</span>
                <span className="font-medium">
                  {((financialStats.allocatedBudget / financialStats.totalBudget) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dépensé:</span>
                <span className="font-medium">
                  {((financialStats.spentBudget / financialStats.totalBudget) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Disponible:</span>
                <span className="font-medium">
                  {((financialStats.remainingBudget / financialStats.totalBudget) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution Mensuelle des Dépenses</CardTitle>
                <CardDescription>Comparaison budget vs dépenses réelles</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlySpending}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} MAD`, ""]} />
                    <Bar dataKey="budget" fill="#e5e7eb" name="Budget" />
                    <Bar dataKey="allocated" fill="var(--color-secondary)" name="Alloué" />
                    <Bar dataKey="spent" fill="var(--color-primary)" name="Dépensé" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendance des Dépenses</CardTitle>
                <CardDescription>Évolution sur 6 mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlySpending}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} MAD`, ""]} />
                    <Line
                      type="monotone"
                      dataKey="spent"
                      stroke="var(--color-primary)"
                      strokeWidth={3}
                      name="Dépensé"
                    />
                    <Line
                      type="monotone"
                      dataKey="allocated"
                      stroke="var(--color-secondary)"
                      strokeWidth={2}
                      name="Alloué"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Catégorie</CardTitle>
                <CardDescription>Distribution du budget par secteur</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={budgetCategories}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="allocated"
                      label={({ name, value }) => `${name}: ${(value / 1000000).toFixed(1)}M MAD`}
                    >
                      {budgetCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} MAD`, "Budget Alloué"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance par Catégorie</CardTitle>
                <CardDescription>Utilisation budgétaire par secteur</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetCategories.map((category) => {
                    const utilization = (category.spent / category.allocated) * 100
                    return (
                      <div key={category.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {category.spent.toLocaleString()} / {category.allocated.toLocaleString()} MAD
                          </span>
                        </div>
                        <Progress value={utilization} className="h-2" />
                        <div className="text-xs text-muted-foreground text-right">
                          {utilization.toFixed(1)}% utilisé
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transactions Récentes</CardTitle>
              <CardDescription>Historique des paiements et allocations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Transaction</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground">{transaction.contract}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(transaction.type)}
                          <span className="capitalize">
                            {transaction.type === "payment" ? "Paiement" : "Allocation"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell className="font-mono">
                        <span className={transaction.type === "payment" ? "text-red-600" : "text-green-600"}>
                          {transaction.type === "payment" ? "-" : "+"}
                          {transaction.amount.toLocaleString()} MAD
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString("fr-FR")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rapports Financiers</CardTitle>
                <CardDescription>Générer des rapports détaillés</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Rapport Mensuel
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Rapport Trimestriel
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Rapport Annuel
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Rapport par Catégorie
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertes Budgétaires</CardTitle>
                <CardDescription>Notifications et seuils</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">Seuil d'alerte atteint</p>
                      <p className="text-sm text-yellow-700">Catégorie Irrigation: 65% utilisé</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Performance optimale</p>
                      <p className="text-sm text-green-700">Budget dans les objectifs</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
