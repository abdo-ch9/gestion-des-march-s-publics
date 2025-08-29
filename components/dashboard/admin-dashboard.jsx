"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Progress } from "../../components/ui/progress"
import { FileText, Calendar, DollarSign, TrendingUp, Users, Clock, BarChart3, Settings, Shield, RefreshCw, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { useDashboard } from "../../lib/hooks/use-dashboard"
import { SimpleSkeleton } from "../../components/ui/simple-skeleton"
import { StatsWidget, ProgressWidget, StatusWidget } from "./dashboard-widget"
import { ActivityFeed } from "./activity-feed"
import { useRealtimeUpdates } from "../../lib/hooks/use-realtime-updates"
import { useState, useEffect } from "react"

export function AdminDashboard({ user }) {
  const { 
    stats, 
    recentActivities, 
    systemHealth, 
    loading, 
    error, 
    refreshDashboard 
  } = useDashboard()

  const [isOnline, setIsOnline] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [realTimeStatus, setRealTimeStatus] = useState('connecting')

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Update last update time when data refreshes
  useEffect(() => {
    if (!loading && !error) {
      setLastUpdate(new Date())
    }
  }, [loading, error])

  // Real-time connection status
  const { isConnected } = useRealtimeUpdates((table, payload) => {
    console.log(`Real-time update received in admin dashboard for ${table}:`, payload)
    setRealTimeStatus('active')
    
    // Auto-refresh dashboard when real-time updates are received
    if (table === 'contracts' || table === 'markets' || table === 'users') {
      setTimeout(() => refreshDashboard(), 1000) // Small delay to avoid conflicts
    }
  })

  // Update real-time status
  useEffect(() => {
    if (isConnected) {
      setRealTimeStatus('active')
    } else {
      setRealTimeStatus('inactive')
    }
  }, [isConnected])

  const getStatusBadge = (status) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
      case "good":
        return <Badge className="bg-green-100 text-green-800">Bon</Badge>
      case "average":
        return <Badge className="bg-yellow-100 text-yellow-800">Moyen</Badge>
      case "poor":
        return <Badge className="bg-red-100 text-red-800">Faible</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatLastUpdate = (date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'À l\'instant'
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`
    
    return date.toLocaleDateString('fr-FR')
  }

  const getRealTimeStatusColor = () => {
    switch (realTimeStatus) {
      case 'active': return 'text-green-600'
      case 'connecting': return 'text-yellow-600'
      case 'inactive': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getRealTimeStatusText = () => {
    switch (realTimeStatus) {
      case 'active': return 'Temps réel actif'
      case 'connecting': return 'Connexion...'
      case 'inactive': return 'Temps réel inactif'
      default: return 'Statut inconnu'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <SimpleSkeleton className="h-10 w-80 mb-2" />
          <SimpleSkeleton className="h-5 w-96" />
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <SimpleSkeleton className="h-6 w-32 mb-2" />
                <SimpleSkeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex items-center justify-between">
                      <SimpleSkeleton className="h-4 w-24" />
                      <SimpleSkeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tableau de Bord Administrateur</h1>
            <p className="text-muted-foreground">Bienvenue, {user?.name || 'Administrateur'}. Vue d'ensemble du système.</p>
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
      {/* Header with Real-time Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tableau de Bord Administrateur</h1>
          <p className="text-muted-foreground">Bienvenue, {user?.name || 'Administrateur'}. Vue d'ensemble du système en temps réel.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Real-time Status Indicators */}
          <div className="flex items-center gap-2 text-sm">
            <div className={`flex items-center gap-1 ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span>{isOnline ? 'En ligne' : 'Hors ligne'}</span>
            </div>
            <div className={`flex items-center gap-1 ${getRealTimeStatusColor()}`}>
              <div className={`w-2 h-2 rounded-full ${
                realTimeStatus === 'active' ? 'bg-green-500' : 
                realTimeStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span>{getRealTimeStatusText()}</span>
            </div>
          </div>
          
          <Button onClick={refreshDashboard} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Last Update Info */}
      <div className="text-xs text-muted-foreground text-center">
        Dernière mise à jour: {formatLastUpdate(lastUpdate)} • 
        Données mises à jour en temps réel
      </div>

      {/* Dynamic Alerts */}
      {stats.delayedContracts > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3 text-orange-800">
              <Clock className="w-5 h-5" />
              <div>
                <h3 className="font-medium">Attention: Contrats en Retard</h3>
                <p className="text-sm">
                  {stats.delayedContracts} contrat{stats.delayedContracts > 1 ? 's' : ''} en retard 
                  nécessitent une attention immédiate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsWidget
          title="Total Contrats"
          value={stats.totalContracts}
          icon={FileText}
          description="Tous les contrats"
          onRefresh={refreshDashboard}
        />
        
        <StatsWidget
          title="Utilisateurs Actifs"
          value={stats.activeUsers}
          icon={Users}
          description={`Sur ${stats.totalUsers} total`}
          color="green"
          onRefresh={refreshDashboard}
        />
        
        <StatsWidget
          title="Valeur Totale"
          value={`${stats.totalValue.toLocaleString()} MAD`}
          icon={DollarSign}
          description="Portefeuille total"
          color="blue"
          onRefresh={refreshDashboard}
        />
        
        <ProgressWidget
          title="Performance Système"
          progress={stats.monthlyProgress}
          icon={BarChart3}
          description="Progression mensuelle"
          onRefresh={refreshDashboard}
        />
      </div>

      {/* Additional Dynamic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <CardTitle className="text-sm font-medium">Contrats Terminés</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.completedContracts}</div>
            <p className="text-xs text-muted-foreground">Réussis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contrats en Retard</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.delayedContracts}</div>
            <p className="text-xs text-muted-foreground">Nécessitent attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalContracts > 0 ? Math.round((stats.completedContracts / stats.totalContracts) * 100) : 0}%
            </div>
            <Progress 
              value={stats.totalContracts > 0 ? (stats.completedContracts / stats.totalContracts) * 100 : 0} 
              className="h-2 mt-2" 
            />
          </CardContent>
        </Card>
      </div>

      {/* System Health and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Santé du Système
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            </CardTitle>
            <CardDescription>Métriques de performance système en temps réel</CardDescription>
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

        {/* Real-time Activity Feed */}
        <ActivityFeed
          title="Activités Récentes"
          description="Dernières actions du système en temps réel"
          maxItems={5}
          onRefresh={refreshDashboard}
        />
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