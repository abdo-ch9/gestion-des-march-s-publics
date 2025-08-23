"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Settings,
  Database,
  Shield,
  Mail,
  Server,
  HardDrive,
  Wifi,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

interface User {
  email: string
  role: "agent" | "manager" | "admin"
  name: string
}

interface SystemSettingsProps {
  user: User
}

export function SystemSettings({ user }: SystemSettingsProps) {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [autoBackup, setAutoBackup] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // Mock system status data
  const systemStatus = {
    server: { status: "online", uptime: "99.9%", lastRestart: "2024-01-15" },
    database: { status: "healthy", connections: 45, maxConnections: 100 },
    storage: { used: 2.4, total: 10, unit: "TB" },
    network: { status: "stable", latency: "12ms", bandwidth: "1Gbps" },
  }

  const backupHistory = [
    { id: 1, date: "2024-01-20", type: "Automatique", size: "1.2 GB", status: "success" },
    { id: 2, date: "2024-01-19", type: "Automatique", size: "1.1 GB", status: "success" },
    { id: 3, date: "2024-01-18", type: "Manuel", size: "1.3 GB", status: "success" },
    { id: 4, date: "2024-01-17", type: "Automatique", size: "1.0 GB", status: "failed" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
      case "healthy":
      case "stable":
      case "success":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            {status === "success" ? "Réussi" : "En ligne"}
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Attention
          </Badge>
        )
      case "failed":
      case "offline":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {status === "failed" ? "Échec" : "Hors ligne"}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const storagePercentage = (systemStatus.storage.used / systemStatus.storage.total) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Paramètres Système</h1>
        <p className="text-muted-foreground">Configuration et administration du système ORMVAO</p>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Serveur</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getStatusBadge(systemStatus.server.status)}
              <p className="text-xs text-muted-foreground">Uptime: {systemStatus.server.uptime}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base de Données</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getStatusBadge(systemStatus.database.status)}
              <p className="text-xs text-muted-foreground">
                {systemStatus.database.connections}/{systemStatus.database.maxConnections} connexions
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stockage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={storagePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {systemStatus.storage.used} / {systemStatus.storage.total} {systemStatus.storage.unit}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réseau</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getStatusBadge(systemStatus.network.status)}
              <p className="text-xs text-muted-foreground">Latence: {systemStatus.network.latency}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="backup">Sauvegardes</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Générale</CardTitle>
                <CardDescription>Paramètres de base du système</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="system-name">Nom du Système</Label>
                  <Input id="system-name" defaultValue="ORMVAO - Gestion des Contrats" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email Administrateur</Label>
                  <Input id="admin-email" type="email" defaultValue="admin@ormvao.ma" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau Horaire</Label>
                  <Select defaultValue="africa/casablanca">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="africa/casablanca">Africa/Casablanca (GMT+1)</SelectItem>
                      <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Langue par Défaut</Label>
                  <Select defaultValue="fr">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Sauvegarder les Paramètres</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limites du Système</CardTitle>
                <CardDescription>Configuration des limites et quotas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="max-users">Nombre Maximum d'Utilisateurs</Label>
                  <Input id="max-users" type="number" defaultValue="100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-contracts">Contrats par Utilisateur</Label>
                  <Input id="max-contracts" type="number" defaultValue="50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file-size">Taille Maximum des Fichiers (MB)</Label>
                  <Input id="file-size" type="number" defaultValue="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Timeout de Session (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue="60" />
                </div>
                <Button>Appliquer les Limites</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Notification</CardTitle>
              <CardDescription>Configuration des alertes et notifications système</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notifications Email</Label>
                  <p className="text-sm text-muted-foreground">Recevoir les alertes par email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notifications SMS</Label>
                  <p className="text-sm text-muted-foreground">Recevoir les alertes critiques par SMS</p>
                </div>
                <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
              </div>

              <div className="space-y-4">
                <Label>Configuration SMTP</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-server">Serveur SMTP</Label>
                    <Input id="smtp-server" placeholder="smtp.ormvao.ma" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">Port</Label>
                    <Input id="smtp-port" type="number" placeholder="587" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-user">Utilisateur</Label>
                    <Input id="smtp-user" placeholder="notifications@ormvao.ma" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">Mot de passe</Label>
                    <Input id="smtp-password" type="password" placeholder="••••••••" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-template">Modèle de Notification</Label>
                <Textarea id="notification-template" placeholder="Modèle HTML pour les notifications..." rows={4} />
              </div>

              <Button>
                <Mail className="w-4 h-4 mr-2" />
                Tester la Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Politique de Sécurité</CardTitle>
                <CardDescription>Configuration des règles de sécurité</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password-length">Longueur Minimum du Mot de Passe</Label>
                  <Input id="password-length" type="number" defaultValue="8" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-attempts">Tentatives de Connexion Maximum</Label>
                  <Input id="login-attempts" type="number" defaultValue="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockout-duration">Durée de Verrouillage (minutes)</Label>
                  <Input id="lockout-duration" type="number" defaultValue="30" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="two-factor" />
                  <Label htmlFor="two-factor">Authentification à Deux Facteurs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="password-expiry" />
                  <Label htmlFor="password-expiry">Expiration des Mots de Passe (90 jours)</Label>
                </div>
                <Button>
                  <Shield className="w-4 h-4 mr-2" />
                  Appliquer la Politique
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Journaux de Sécurité</CardTitle>
                <CardDescription>Surveillance des événements de sécurité</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">Tentative de connexion échouée</p>
                      <p className="text-sm text-muted-foreground">IP: 192.168.1.100 - Il y a 2h</p>
                    </div>
                    <Badge variant="destructive">Critique</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">Connexion administrateur</p>
                      <p className="text-sm text-muted-foreground">admin@ormvao.ma - Il y a 4h</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Normal
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">Modification de permissions</p>
                      <p className="text-sm text-muted-foreground">Utilisateur: Ahmed Benali - Il y a 6h</p>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Attention
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Voir Tous les Journaux
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration des Sauvegardes</CardTitle>
                <CardDescription>Paramètres de sauvegarde automatique</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Sauvegarde Automatique</Label>
                    <p className="text-sm text-muted-foreground">Sauvegarde quotidienne à 2h00</p>
                  </div>
                  <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Fréquence</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Toutes les heures</SelectItem>
                      <SelectItem value="daily">Quotidienne</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backup-retention">Rétention (jours)</Label>
                  <Input id="backup-retention" type="number" defaultValue="30" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backup-location">Emplacement</Label>
                  <Input id="backup-location" defaultValue="/var/backups/ormvao" />
                </div>

                <div className="flex gap-2">
                  <Button>
                    <Download className="w-4 h-4 mr-2" />
                    Sauvegarde Manuelle
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    <Upload className="w-4 h-4 mr-2" />
                    Restaurer
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historique des Sauvegardes</CardTitle>
                <CardDescription>Dernières sauvegardes effectuées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {backupHistory.map((backup) => (
                    <div
                      key={backup.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{new Date(backup.date).toLocaleDateString("fr-FR")}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {backup.type} - {backup.size}
                        </p>
                      </div>
                      {getStatusBadge(backup.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mode Maintenance</CardTitle>
              <CardDescription>Contrôle de l'accès au système pour maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Le mode maintenance empêchera tous les utilisateurs (sauf les administrateurs) d'accéder au système.
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Mode Maintenance</Label>
                  <p className="text-sm text-muted-foreground">
                    {maintenanceMode ? "Système en maintenance" : "Système opérationnel"}
                  </p>
                </div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>

              {maintenanceMode && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maintenance-message">Message de Maintenance</Label>
                    <Textarea
                      id="maintenance-message"
                      placeholder="Le système est temporairement indisponible pour maintenance..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maintenance-end">Fin Prévue</Label>
                    <Input id="maintenance-end" type="datetime-local" />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="font-medium">Outils de Maintenance</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start bg-transparent">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Redémarrer le Système
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <Database className="w-4 h-4 mr-2" />
                    Optimiser la Base de Données
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <HardDrive className="w-4 h-4 mr-2" />
                    Nettoyer les Fichiers Temporaires
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <Settings className="w-4 h-4 mr-2" />
                    Vérifier la Configuration
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
