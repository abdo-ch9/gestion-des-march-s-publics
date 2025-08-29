"use client"

import { useState } from 'react'
import { useAuth } from "../../lib/auth-context"
import { DashboardLayout } from "../../components/layout/dashboard-layout"
import { ProtectedRoute } from "../../components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { FileText, BarChart3, TrendingUp, DollarSign, Download, RefreshCw, AlertCircle } from "lucide-react"
import { useReports } from "../../lib/hooks/use-reports"
import { ReportGeneratorModal } from "../../components/reports/report-generator-modal"
import { ReportsSkeleton } from "../../components/reports/reports-skeleton"
import { useToast } from "../../hooks/use-toast"

export default function ReportsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { 
    stats, 
    performanceMetrics, 
    loading, 
    error, 
    refreshData,
    generateCustomReport,
    exportReport
  } = useReports()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [generatingReport, setGeneratingReport] = useState(false)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleGenerateReport = async (reportType, filters) => {
    try {
      setGeneratingReport(true)
      const report = await generateCustomReport(reportType, filters)
      
      toast({
        title: "Rapport généré",
        description: `Le rapport "${reportType}" a été généré avec succès.`,
        variant: "default",
      })
      
      console.log('Generated report:', report)
      setIsModalOpen(false)
      
    } catch (err) {
      toast({
        title: "Erreur",
        description: err.message || "Erreur lors de la génération du rapport",
        variant: "destructive",
      })
    } finally {
      setGeneratingReport(false)
    }
  }

  const handleExportReport = async (reportType, filters, format) => {
    try {
      setGeneratingReport(true)
      const report = await generateCustomReport(reportType, filters)
      await exportReport(report, format)
      
      toast({
        title: "Export réussi",
        description: `Le rapport a été exporté en format ${format.toUpperCase()}.`,
        variant: "default",
      })
      
    } catch (err) {
      toast({
        title: "Erreur d'export",
        description: err.message || "Erreur lors de l'export du rapport",
        variant: "destructive",
      })
    } finally {
      setGeneratingReport(false)
    }
  }

  const handleRefresh = () => {
    refreshData()
    toast({
      title: "Actualisation",
      description: "Les données ont été actualisées.",
      variant: "default",
    })
  }

  if (error) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">Erreur de chargement</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Réessayer
              </Button>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <ReportsSkeleton />
        </DashboardLayout>
      </ProtectedRoute>
    )
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
            <div className="flex gap-2">
              <Button onClick={handleRefresh} variant="outline" disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button onClick={() => setIsModalOpen(true)}>
                <FileText className="w-4 h-4 mr-2" />
                Générer un Rapport
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contrats</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalContracts}
                </div>
                <p className="text-xs text-muted-foreground">Contrats gérés</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.totalValue)}
                </div>
                <p className="text-xs text-muted-foreground">Valeur des contrats</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {`${stats.successRate}%`}
                </div>
                <p className="text-xs text-muted-foreground">Contrats réussis</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {`${stats.averageTime}j`}
                </div>
                <p className="text-xs text-muted-foreground">Durée moyenne</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Marchés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalMarkets}
                </div>
                <p className="text-xs text-muted-foreground">Total des marchés</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Dépenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.totalExpenses)}
                </div>
                <p className="text-xs text-muted-foreground">Total des dépenses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Bénéfice Net</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(stats.netProfit)}
                </div>
                <p className="text-xs text-muted-foreground">Bénéfice net</p>
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
                        {metric.value}{metric.unit}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Objectif: {metric.target}{metric.unit}</span>
                        <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>
                          {metric.trend === "up" ? "↑" : "↓"} {Math.abs(metric.value - metric.target).toFixed(1)}
                        </span>
                      </div>
                      <Progress
                        value={Math.min((metric.value / metric.target) * 100, 120)}
                        className="h-2"
                        max={120}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Generator */}
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
                  Utilisez le générateur de rapports pour créer des analyses personnalisées avec filtres avancés et options d'export.
                </p>
                <div className="flex gap-2">
                  <Button onClick={() => setIsModalOpen(true)}>
                    <FileText className="w-4 h-4 mr-2" />
                    Ouvrir le Générateur
                  </Button>
                  <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Actualiser les Données
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Generator Modal */}
        <ReportGeneratorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onGenerateReport={handleGenerateReport}
          onExportReport={handleExportReport}
          loading={generatingReport}
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
} 