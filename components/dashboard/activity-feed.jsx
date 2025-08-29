"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { RefreshCw, FileText, Users, Shield, BarChart3, Clock, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useRealtimeUpdates } from "../../lib/hooks/use-realtime-updates"

export function ActivityFeed({ 
  title = "Activités Récentes", 
  description = "Dernières actions du système",
  maxItems = 10,
  showRefresh = true,
  onRefresh,
  className = ""
}) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Handle real-time updates
  const handleRealtimeUpdate = (table, payload) => {
    console.log(`Activity feed received update for ${table}:`, payload)
    
    const newActivity = createActivityFromPayload(table, payload)
    if (newActivity) {
      setActivities(prev => [newActivity, ...prev.slice(0, maxItems - 1)])
    }
  }

  // Use real-time updates
  useRealtimeUpdates(handleRealtimeUpdate)

  // Create activity from real-time payload
  const createActivityFromPayload = (table, payload) => {
    const now = new Date()
    
    switch (table) {
      case 'contracts':
        if (payload.eventType === 'INSERT') {
          return {
            id: `contract-${payload.new.id}`,
            action: 'Nouveau contrat créé',
            user: payload.new.awardee || 'Utilisateur',
            time: 'À l\'instant',
            type: 'create',
            details: payload.new.subject,
            timestamp: now
          }
        } else if (payload.eventType === 'UPDATE') {
          if (payload.new.status !== payload.old.status) {
            return {
              id: `contract-${payload.new.id}-${now.getTime()}`,
              action: `Contrat ${getStatusLabel(payload.new.status)}`,
              user: payload.new.awardee || 'Utilisateur',
              time: 'À l\'instant',
              type: payload.new.status === 'completed' ? 'approve' : 'update',
              details: payload.new.subject,
              timestamp: now
            }
          }
        }
        break
        
      case 'markets':
        if (payload.eventType === 'INSERT') {
          return {
            id: `market-${payload.new.id}`,
            action: 'Nouveau marché créé',
            user: 'Système',
            time: 'À l\'instant',
            type: 'create',
            details: payload.new.object,
            timestamp: now
          }
        }
        break
        
      case 'users':
        if (payload.eventType === 'INSERT') {
          return {
            id: `user-${payload.new.id}`,
            action: 'Nouvel utilisateur inscrit',
            user: payload.new.full_name || 'Utilisateur',
            time: 'À l\'instant',
            type: 'user',
            details: 'Nouvelle inscription',
            timestamp: now
          }
        }
        break
    }
    
    return null
  }

  const getStatusLabel = (status) => {
    const statusLabels = {
      'draft': 'mis en brouillon',
      'active': 'activé',
      'completed': 'terminé',
      'cancelled': 'annulé',
      'pending': 'mis en attente'
    }
    return statusLabels[status] || status
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case "create":
        return <FileText className="w-4 h-4 text-green-600" />
      case "approve":
        return <Shield className="w-4 h-4 text-blue-600" />
      case "update":
        return <BarChart3 className="w-4 h-4 text-purple-600" />
      case "user":
        return <Users className="w-4 h-4 text-orange-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'À l\'instant'
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`
    
    return timestamp.toLocaleDateString('fr-FR')
  }

  const handleRefresh = async () => {
    if (onRefresh) {
      setLoading(true)
      try {
        await onRefresh()
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
  }

  // Update timestamps every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => 
        prev.map(activity => ({
          ...activity,
          time: formatTimeAgo(activity.timestamp)
        }))
      )
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  if (error) {
    return (
      <Card className={`border-red-200 bg-red-50 ${className}`}>
        <CardHeader>
          <CardTitle className="text-red-800">{title}</CardTitle>
          <CardDescription className="text-red-700">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <div>
              <h3 className="font-medium">Erreur de chargement</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
          {onRefresh && (
            <Button onClick={handleRefresh} className="mt-4" size="sm">
              Réessayer
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {showRefresh && onRefresh && (
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{activity.action}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    par {activity.user} • {activity.time}
                  </div>
                  {activity.details && (
                    <div className="text-xs text-muted-foreground truncate mt-1">
                      {activity.details}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Aucune activité récente</p>
              <p className="text-sm">Les activités apparaîtront ici en temps réel</p>
            </div>
          )}
        </div>
        
        {activities.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              Mise à jour en temps réel • {activities.length} activité{activities.length > 1 ? 's' : ''}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 