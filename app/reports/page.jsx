"use client"

import { useAuth } from "../../lib/auth-context"
import { DashboardLayout } from "../../components/layout/dashboard-layout"
import { ProtectedRoute } from "../../components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { FileText, BarChart3, TrendingUp, DollarSign } from "lucide-react"

export default function ReportsPage() {
  const { user } = useAuth()

  // Mock report data
  const reportStats = {
    totalContracts: 156,
    activeContracts: 89,
    completedContracts: 67,
    totalValue: 45000000,
    averageCompletionTime: 45,
    successRate: 94.2,
  }

  const performanceMetrics = [
    {
      category: "Contrats",
      metric: "Taux de Réussite",
      value: 94.2,
      target: 90,
      trend: "up",
      color: "text-green-600",
    },
    {
      category: "Finances",
      metric: "Efficacité Budgétaire",
      value: 87.5,
      target: 85,
      trend: "up",
      color: "text-blue-600",
    },
    {
      category: "Marchés",
      metric: "Temps de Traitement",
      value: 12.3,
      target: 15,
      trend: "up",
      color: "text-green-600",
    },
    {
      category: "Utilisateurs",
      metric: "Satisfaction Client",
      value: 4.2,
      target: 4.0,
      trend: "up",
      color: "text-green-600",
    },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleGenerateReport = () => {
    // Logic to generate custom report
    console.log("Generating report...")
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Rapports et Analyses</h1>
              <p className="text-muted-foreground">
                Générez et consultez des rapports détaillés sur vos activités
              </p>
            </div>
            <Button onClick={handleGenerateReport}>
              <FileText className="w-4 h-4 mr-2" />
              Générer un Rapport
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contrats</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportStats.totalContracts}</div>
                <p className="text-xs text-muted-foreground">Contrats gérés</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(reportStats.totalValue)}</div>
                <p className="text-xs text-muted-foreground">Valeur des contrats</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportStats.successRate}%</div>
                <p className="text-xs text-muted-foreground">Contrats réussis</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportStats.averageCompletionTime}j</div>
                <p className="text-xs text-muted-foreground">Durée moyenne</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Métriques de Performance</CardTitle>
              <CardDescription>
                Suivi des indicateurs clés de performance par catégorie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric) => (
                  <div key={metric.metric} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{metric.metric}</span>
                      <span className={metric.color}>
                        {metric.value}{metric.metric.includes("Temps") ? " jours" : metric.metric.includes("Satisfaction") ? "/5" : "%"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Objectif: {metric.target}{metric.metric.includes("Temps") ? " jours" : metric.metric.includes("Satisfaction") ? "/5" : "%"}</span>
                        <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>
                          {metric.trend === "up" ? "↑" : "↓"} {Math.abs(metric.value - metric.target).toFixed(1)}
                        </span>
                      </div>
                      <Progress
                        value={(metric.value / metric.target) * 100}
                        className="h-2"
                        max={120}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Simple Report Generator */}
          <Card>
            <CardHeader>
              <CardTitle>Générateur de Rapports</CardTitle>
              <CardDescription>
                Créez des rapports personnalisés selon vos besoins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Les fonctionnalités avancées de génération de rapports seront bientôt disponibles.
                </p>
                <Button onClick={handleGenerateReport} disabled>
                  <FileText className="w-4 h-4 mr-2" />
                  Générer un Rapport (Bientôt disponible)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 