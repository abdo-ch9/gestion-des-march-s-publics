"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts"

export function MarketsCharts() {
  const [selectedMarket, setSelectedMarket] = useState("all")
  const [chartPeriod, setChartPeriod] = useState("6months")

  // Mock data for charts
  const marketsData = [
    {
      id: "MP-2024-001",
      name: "Installation Système d'Irrigation",
      progress: 65,
      amount: 2500000,
      settlements: 2,
      extensions: 1,
      delays: 0
    },
    {
      id: "MP-2024-002",
      name: "Formation Techniques Agricoles",
      progress: 100,
      amount: 850000,
      settlements: 3,
      extensions: 0,
      delays: 0
    },
    {
      id: "MP-2024-003",
      name: "Maintenance Équipements",
      progress: 45,
      amount: 1200000,
      settlements: 1,
      extensions: 0,
      delays: 1
    },
    {
      id: "MP-2024-004",
      name: "Construction Bâtiment Administratif",
      progress: 25,
      amount: 15000000,
      settlements: 1,
      extensions: 0,
      delays: 0
    },
    {
      id: "MP-2024-005",
      name: "Fourniture Matériel Informatique",
      progress: 0,
      amount: 750000,
      settlements: 0,
      extensions: 0,
      delays: 0
    }
  ]

  const settlementsTimeline = [
    { month: "Jan", validated: 2, pending: 1, rejected: 0 },
    { month: "Fév", validated: 3, pending: 2, rejected: 1 },
    { month: "Mar", validated: 4, pending: 1, rejected: 0 },
    { month: "Avr", validated: 2, pending: 3, rejected: 0 },
    { month: "Mai", validated: 1, pending: 2, rejected: 1 },
    { month: "Juin", validated: 0, pending: 1, rejected: 0 }
  ]

  const deadlinesData = [
    { month: "Jan", onTrack: 8, extended: 2, delayed: 1 },
    { month: "Fév", onTrack: 7, extended: 3, delayed: 2 },
    { month: "Mar", onTrack: 9, extended: 1, delayed: 1 },
    { month: "Avr", onTrack: 6, extended: 4, delayed: 2 },
    { month: "Mai", onTrack: 8, extended: 2, delayed: 1 },
    { month: "Juin", onTrack: 7, extended: 3, delayed: 0 }
  ]

  const progressByService = [
    { service: "Irrigation", progress: 75, markets: 3 },
    { service: "Formation", progress: 100, markets: 2 },
    { service: "Équipement", progress: 60, markets: 4 },
    { service: "Infrastructure", progress: 45, markets: 2 },
    { service: "Informatique", progress: 30, markets: 3 }
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const filteredMarketsData = selectedMarket === "all" 
    ? marketsData 
    : marketsData.filter(m => m.id === selectedMarket)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Graphiques de Suivi</h2>
          <p className="text-muted-foreground">Visualisation des délais et décomptes pour chaque marché</p>
        </div>
        
        <div className="flex gap-4">
          <div>
            <label className="text-sm font-medium">Marché</label>
            <Select value={selectedMarket} onValueChange={setSelectedMarket}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tous les marchés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les marchés</SelectItem>
                {marketsData.map(market => (
                  <SelectItem key={market.id} value={market.id}>
                    {market.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Période</label>
            <Select value={chartPeriod} onValueChange={setChartPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 mois</SelectItem>
                <SelectItem value="6months">6 mois</SelectItem>
                <SelectItem value="1year">1 an</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="progress">Progression</TabsTrigger>
          <TabsTrigger value="financial">Financier</TabsTrigger>
          <TabsTrigger value="deadlines">Délais</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress by Service */}
            <Card>
              <CardHeader>
                <CardTitle>Progression par Service</CardTitle>
                <CardDescription>État d'avancement des marchés par service</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={progressByService}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="service" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="progress" fill="#8884d8" name="Progression (%)" />
                    <Bar dataKey="markets" fill="#82ca9d" name="Nombre de marchés" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Market Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Statuts</CardTitle>
                <CardDescription>Distribution des marchés par statut</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Dans les délais', value: 12, color: '#10B981' },
                        { name: 'Prolongés', value: 8, color: '#3B82F6' },
                        { name: 'En retard', value: 3, color: '#EF4444' },
                        { name: 'Terminés', value: 7, color: '#6B7280' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Dans les délais', value: 12, color: '#10B981' },
                        { name: 'Prolongés', value: 8, color: '#3B82F6' },
                        { name: 'En retard', value: 3, color: '#EF4444' },
                        { name: 'Terminés', value: 7, color: '#6B7280' }
                      ].map((entry, index) => (
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

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Individual Market Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Progression des Marchés</CardTitle>
                <CardDescription>État d'avancement détaillé par marché</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={filteredMarketsData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="progress" fill="#8884d8" name="Progression (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Progress Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution de la Progression</CardTitle>
                <CardDescription>Suivi de l'avancement dans le temps</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={[
                    { month: "Jan", MP001: 20, MP002: 40, MP003: 15, MP004: 10 },
                    { month: "Fév", MP001: 35, MP002: 60, MP003: 25, MP004: 15 },
                    { month: "Mar", MP001: 50, MP002: 80, MP003: 35, MP004: 20 },
                    { month: "Avr", MP001: 65, MP002: 100, MP003: 45, MP004: 25 },
                    { month: "Mai", MP001: 75, MP002: 100, MP003: 50, MP004: 30 },
                    { month: "Juin", MP001: 85, MP002: 100, MP003: 55, MP004: 35 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="MP001" stackId="1" stroke="#8884d8" fill="#8884d8" name="MP-001" />
                    <Area type="monotone" dataKey="MP002" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="MP-002" />
                    <Area type="monotone" dataKey="MP003" stackId="1" stroke="#ffc658" fill="#ffc658" name="MP-003" />
                    <Area type="monotone" dataKey="MP004" stackId="1" stroke="#ff7300" fill="#ff7300" name="MP-004" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Settlements Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Décomptes</CardTitle>
                <CardDescription>Suivi des décomptes financiers par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={settlementsTimeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="validated" stroke="#10B981" strokeWidth={2} name="Validés" />
                    <Line type="monotone" dataKey="pending" stroke="#F59E0B" strokeWidth={2} name="En attente" />
                    <Line type="monotone" dataKey="rejected" stroke="#EF4444" strokeWidth={2} name="Rejetés" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Financial Summary by Market */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé Financier par Marché</CardTitle>
                <CardDescription>Montants et décomptes par marché</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={filteredMarketsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} MAD`} />
                    <Legend />
                    <Bar dataKey="amount" fill="#8884d8" name="Montant (MAD)" />
                    <Bar dataKey="settlements" fill="#82ca9d" name="Décomptes" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Deadlines Tab */}
        <TabsContent value="deadlines" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deadlines Status Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Délais</CardTitle>
                <CardDescription>Suivi des statuts des délais par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={deadlinesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="onTrack" stroke="#10B981" strokeWidth={2} name="Dans les délais" />
                    <Line type="monotone" dataKey="extended" stroke="#3B82F6" strokeWidth={2} name="Prolongés" />
                    <Line type="monotone" dataKey="delayed" stroke="#EF4444" strokeWidth={2} name="En retard" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Extensions and Delays Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé des Prolongations et Retards</CardTitle>
                <CardDescription>Comparaison des marchés avec extensions et retards</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={filteredMarketsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="extensions" fill="#3B82F6" name="Prolongations" />
                    <Bar dataKey="delays" fill="#EF4444" name="Retards" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Marchés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{marketsData.length}</div>
            <p className="text-xs text-muted-foreground">Marchés actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression Moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(marketsData.reduce((sum, m) => sum + m.progress, 0) / marketsData.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Moyenne générale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Décomptes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {marketsData.reduce((sum, m) => sum + m.settlements, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Décomptes enregistrés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prolongations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {marketsData.reduce((sum, m) => sum + m.extensions, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Demandes approuvées</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 