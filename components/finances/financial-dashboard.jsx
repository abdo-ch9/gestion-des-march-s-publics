"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Progress } from "../../components/ui/progress"
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

export function FinancialDashboard({ user }) {
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
      description: "Maintenance infrastructure routière",
      amount: 95000,
      type: "payment",
      status: "completed",
      date: "2024-01-17",
      category: "Infrastructure",
    },
    {
      id: "TXN-2024-005",
      contract: "CNT-2024-049",
      description: "Formation techniques modernes",
      amount: 28000,
      type: "allocation",
      status: "pending",
      date: "2024-01-16",
      category: "Formation",
    },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "approved":
        return <Badge className="bg-blue-100 text-blue-800">Approuvé</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type) => {
    switch (type) {
      case "payment":
        return <Badge className="bg-purple-100 text-purple-800">Paiement</Badge>
      case "allocation":
        return <Badge className="bg-indigo-100 text-indigo-800">Allocation</Badge>
      case "refund":
        return <Badge className="bg-orange-100 text-orange-800">Remboursement</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getBudgetUtilization = () => {
    return (financialStats.spentBudget / financialStats.totalBudget) * 100
  }

  const getBudgetEfficiency = () => {
    return (financialStats.spentBudget / financialStats.allocatedBudget) * 100
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tableau de Bord Financier</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble des finances et du budget pour {user?.name || 'l\'utilisateur'}
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Exporter le Rapport
        </Button>
      </div>

      {/* Financial Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialStats.totalBudget)}</div>
            <p className="text-xs text-muted-foreground">Budget approuvé pour l'année</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Alloué</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialStats.allocatedBudget)}</div>
            <p className="text-xs text-muted-foreground">
              {((financialStats.allocatedBudget / financialStats.totalBudget) * 100).toFixed(1)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Dépensé</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialStats.spentBudget)}</div>
            <p className="text-xs text-muted-foreground">
              {getBudgetUtilization().toFixed(1)}% du budget total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Restant</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialStats.remainingBudget)}</div>
            <p className="text-xs text-muted-foreground">Disponible pour allocation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements en Attente</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialStats.pendingPayments)}</div>
            <p className="text-xs text-muted-foreground">En cours de traitement</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Utilization Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisation du Budget</CardTitle>
          <CardDescription>
            Progression de l'utilisation du budget par rapport au total alloué
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Budget Total</span>
            <span>{formatCurrency(financialStats.totalBudget)}</span>
          </div>
          <Progress value={getBudgetUtilization()} className="h-3" />
          <div className="flex justify-between text-sm">
            <span>Budget Dépensé</span>
            <span>{formatCurrency(financialStats.spentBudget)}</span>
          </div>
          <Progress value={getBudgetEfficiency()} className="h-3" />
          <div className="flex justify-between text-sm">
            <span>Budget Alloué</span>
            <span>{formatCurrency(financialStats.allocatedBudget)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Tables */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'Ensemble</TabsTrigger>
          <TabsTrigger value="monthly">Dépenses Mensuelles</TabsTrigger>
          <TabsTrigger value="categories">Par Catégorie</TabsTrigger>
          <TabsTrigger value="transactions">Transactions Récentes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Monthly Spending Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Dépenses Mensuelles</CardTitle>
                <CardDescription>Évolution des dépenses par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlySpending}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="spent" fill="#ef4444" name="Dépensé" />
                    <Bar dataKey="allocated" fill="#3b82f6" name="Alloué" />
                    <Bar dataKey="budget" fill="#22c55e" name="Budget" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Budget Categories Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Budget par Catégorie</CardTitle>
                <CardDescription>Répartition du budget par secteur</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={budgetCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="allocated"
                    >
                      {budgetCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dépenses Mensuelles Détaillées</CardTitle>
              <CardDescription>Comparaison détaillée des dépenses mensuelles</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlySpending}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="spent"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Dépensé"
                  />
                  <Line
                    type="monotone"
                    dataKey="allocated"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Alloué"
                  />
                  <Line
                    type="monotone"
                    dataKey="budget"
                    stroke="#22c55e"
                    strokeWidth={2}
                    name="Budget"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget par Catégorie</CardTitle>
              <CardDescription>Détails de l'allocation et des dépenses par catégorie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetCategories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{category.name}</span>
                      <span>{formatCurrency(category.allocated)}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Dépensé: {formatCurrency(category.spent)}</span>
                        <span>{((category.spent / category.allocated) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress
                        value={(category.spent / category.allocated) * 100}
                        className="h-2"
                        style={{ backgroundColor: category.color + "20" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transactions Récentes</CardTitle>
              <CardDescription>Dernières transactions financières</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Contrat</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Catégorie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                      <TableCell className="font-mono text-sm">{transaction.contract}</TableCell>
                      <TableCell className="max-w-xs truncate">{transaction.description}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(transaction.date).toLocaleDateString("fr-FR")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.category}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 