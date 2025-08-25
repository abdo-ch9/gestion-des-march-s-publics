"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Switch } from "../../components/ui/switch"
import { 
  Settings, 
  Database, 
  Shield, 
  Bell, 
  Globe, 
  Users, 
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

export function SystemSettings() {
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)

  // Mock system settings data
  const systemSettings = {
    general: {
      siteName: "ORMVAO",
      siteDescription: "Office Régional de Mise en Valeur Agricole de Ouarzazate",
      timezone: "Africa/Casablanca",
      language: "fr",
      maintenanceMode: false
    },
    database: {
      backupFrequency: "daily",
      backupRetention: 30,
      autoOptimization: true,
      connectionPool: 10
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordPolicy: "strong",
      twoFactorAuth: true,
      ipWhitelist: []
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      adminAlerts: true
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    // Show success message
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Paramètres Système</h1>
          <p className="text-muted-foreground">Configurez les paramètres généraux du système</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="database">Base de Données</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Paramètres Généraux
              </CardTitle>
              <CardDescription>Configuration de base du système</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Nom du Site</Label>
                  <Input
                    id="siteName"
                    defaultValue={systemSettings.general.siteName}
                    placeholder="Nom de votre organisation"
                  />
                </div>
                <div>
                  <Label htmlFor="siteDescription">Description</Label>
                  <Input
                    id="siteDescription"
                    defaultValue={systemSettings.general.siteDescription}
                    placeholder="Description du site"
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Fuseau Horaire</Label>
                  <Select defaultValue={systemSettings.general.timezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Casablanca">Casablanca (UTC+0/+1)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (UTC+1/+2)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Langue</Label>
                  <Select defaultValue={systemSettings.general.language}>
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
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="maintenanceMode" defaultChecked={systemSettings.general.maintenanceMode} />
                <Label htmlFor="maintenanceMode">Mode Maintenance</Label>
                <Badge variant="outline" className="ml-2">Danger</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Paramètres Base de Données
              </CardTitle>
              <CardDescription>Configuration de la base de données</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="backupFrequency">Fréquence de Sauvegarde</Label>
                  <Select defaultValue={systemSettings.database.backupFrequency}>
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
                <div>
                  <Label htmlFor="backupRetention">Rétention des Sauvegardes (jours)</Label>
                  <Input
                    id="backupRetention"
                    type="number"
                    defaultValue={systemSettings.database.backupRetention}
                    min="1"
                    max="365"
                  />
                </div>
                <div>
                  <Label htmlFor="connectionPool">Taille du Pool de Connexions</Label>
                  <Input
                    id="connectionPool"
                    type="number"
                    defaultValue={systemSettings.database.connectionPool}
                    min="1"
                    max="100"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="autoOptimization" defaultChecked={systemSettings.database.autoOptimization} />
                <Label htmlFor="autoOptimization">Optimisation Automatique</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Paramètres de Sécurité
              </CardTitle>
              <CardDescription>Configuration de la sécurité du système</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Timeout de Session (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    defaultValue={systemSettings.security.sessionTimeout}
                    min="5"
                    max="480"
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Tentatives de Connexion Max</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    defaultValue={systemSettings.security.maxLoginAttempts}
                    min="3"
                    max="10"
                  />
                </div>
                <div>
                  <Label htmlFor="passwordPolicy">Politique de Mots de Passe</Label>
                  <Select defaultValue={systemSettings.security.passwordPolicy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weak">Faible</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="strong">Forte</SelectItem>
                      <SelectItem value="very_strong">Très forte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="twoFactorAuth" defaultChecked={systemSettings.security.twoFactorAuth} />
                <Label htmlFor="twoFactorAuth">Authentification à Deux Facteurs</Label>
                <Badge variant="outline" className="ml-2">Recommandé</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Paramètres de Notifications
              </CardTitle>
              <CardDescription>Configuration des notifications système</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="emailNotifications" defaultChecked={systemSettings.notifications.emailNotifications} />
                  <Label htmlFor="emailNotifications">Notifications par Email</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="smsNotifications" defaultChecked={systemSettings.notifications.smsNotifications} />
                  <Label htmlFor="smsNotifications">Notifications par SMS</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="pushNotifications" defaultChecked={systemSettings.notifications.pushNotifications} />
                  <Label htmlFor="pushNotifications">Notifications Push</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="adminAlerts" defaultChecked={systemSettings.notifications.adminAlerts} />
                  <Label htmlFor="adminAlerts">Alertes Administrateur</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>État du Système</CardTitle>
          <CardDescription>Statut actuel des services système</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium">Base de Données</div>
                <div className="text-sm text-muted-foreground">Opérationnelle</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium">API</div>
                <div className="text-sm text-muted-foreground">Opérationnelle</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium">Stockage</div>
                <div className="text-sm text-muted-foreground">Opérationnel</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 