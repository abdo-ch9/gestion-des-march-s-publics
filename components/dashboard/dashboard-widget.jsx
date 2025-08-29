"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react"
import { useState, useEffect } from "react"

export function DashboardWidget({ 
  title, 
  description, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  progress, 
  status, 
  loading = false,
  onRefresh,
  className = "",
  children 
}) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
  }

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />
    return null
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600'
    if (trend === 'down') return 'text-red-600'
    return 'text-gray-600'
  }

  const getStatusBadge = (status) => {
    if (!status) return null
    
    const statusConfig = {
      excellent: { className: "bg-green-100 text-green-800", label: "Excellent" },
      good: { className: "bg-blue-100 text-blue-800", label: "Bon" },
      average: { className: "bg-yellow-100 text-yellow-800", label: "Moyen" },
      poor: { className: "bg-red-100 text-red-800", label: "Faible" },
      active: { className: "bg-green-100 text-green-800", label: "Actif" },
      completed: { className: "bg-blue-100 text-blue-800", label: "Terminé" },
      pending: { className: "bg-yellow-100 text-yellow-800", label: "En attente" },
      draft: { className: "bg-gray-100 text-gray-800", label: "Brouillon" }
    }

    const config = statusConfig[status] || { className: "bg-gray-100 text-gray-800", label: status }
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card className={`animate-pulse ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl font-bold text-primary">{value}</div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {progress !== undefined && (
          <div className="mt-2">
            <Progress value={progress} className="h-2" />
          </div>
        )}
        {status && (
          <div className="mt-2">
            {getStatusBadge(status)}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  )
}

// Specialized widget for statistics
export function StatsWidget({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  trendValue, 
  color = "primary",
  onRefresh 
}) {
  const colorClasses = {
    primary: "text-primary",
    green: "text-green-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    orange: "text-orange-600"
  }

  return (
    <DashboardWidget
      title={title}
      value={value}
      icon={Icon}
      description={description}
      trend={trend}
      trendValue={trendValue}
      onRefresh={onRefresh}
      className="h-full"
    >
      <div className={`text-2xl font-bold ${colorClasses[color] || colorClasses.primary}`}>
        {value}
      </div>
    </DashboardWidget>
  )
}

// Specialized widget for progress
export function ProgressWidget({ 
  title, 
  value, 
  progress, 
  icon: Icon, 
  description, 
  onRefresh 
}) {
  return (
    <DashboardWidget
      title={title}
      value={`${progress}%`}
      icon={Icon}
      description={description}
      progress={progress}
      onRefresh={onRefresh}
      className="h-full"
    />
  )
}

// Specialized widget for status
export function StatusWidget({ 
  title, 
  value, 
  status, 
  icon: Icon, 
  description, 
  onRefresh 
}) {
  return (
    <DashboardWidget
      title={title}
      value={value}
      icon={Icon}
      description={description}
      status={status}
      onRefresh={onRefresh}
      className="h-full"
    />
  )
} 