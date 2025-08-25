"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  CalendarDays
} from "lucide-react"

export function DeadlinesTracking() {
  const [isAddExtensionOpen, setIsAddExtensionOpen] = useState(false)
  const [selectedDeadline, setSelectedDeadline] = useState(null)

  // Mock data for deadlines tracking
  const deadlines = [
    {
      id: "DL-001",
      marketNumber: "MP-2024-001",
      marketObject: "Installation Système d'Irrigation",
      originalEndDate: "2024-06-15",
      currentEndDate: "2024-07-15",
      extensionDays: 30,
      extensionReason: "Retard dans la livraison des matériaux",
      status: "extended",
      progress: 65,
      daysRemaining: 45,
      isDelayed: false
    },
    {
      id: "DL-002",
      marketNumber: "MP-2024-003",
      marketObject: "Maintenance Équipements",
      originalEndDate: "2024-05-01",
      currentEndDate: "2024-05-01",
      extensionDays: 0,
      extensionReason: null,
      status: "delayed",
      progress: 45,
      daysRemaining: -15,
      isDelayed: true
    },
    {
      id: "DL-003",
      marketNumber: "MP-2024-004",
      marketObject: "Construction Bâtiment Administratif",
      originalEndDate: "2025-03-01",
      currentEndDate: "2025-03-01",
      extensionDays: 0,
      extensionReason: null,
      status: "on_track",
      progress: 25,
      daysRemaining: 320,
      isDelayed: false
    },
    {
      id: "DL-004",
      marketNumber: "MP-2024-002",
      marketObject: "Formation Techniques Agricoles",
      originalEndDate: "2024-02-28",
      currentEndDate: "2024-02-28",
      extensionDays: 0,
      extensionReason: null,
      status: "completed",
      progress: 100,
      daysRemaining: 0,
      isDelayed: false
    }
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case "on_track":
        return <Badge className="bg-green-100 text-green-800">Dans les délais</Badge>
      case "extended":
        return <Badge className="bg-blue-100 text-blue-800">Prolongé</Badge>
      case "delayed":
        return <Badge className="bg-red-100 text-red-800">En retard</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Terminé</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "on_track":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "extended":
        return <CalendarDays className="w-4 h-4 text-blue-600" />
      case "delayed":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-gray-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  // Calculate totals
  const totalMarkets = deadlines.length
  const onTrackMarkets = deadlines.filter(d => d.status === "on_track").length
  const extendedMarkets = deadlines.filter(d => d.status === "extended").length
  const delayedMarkets = deadlines.filter(d => d.status === "delayed").length
  const completedMarkets = deadlines.filter(d => d.status === "completed").length

  const getDaysRemainingColor = (days) => {
    if (days < 0) return "text-red-600"
    if (days <= 30) return "text-orange-600"
    if (days <= 90) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Suivi des Délais</h2>
          <p className="text-muted-foreground">Gestion des échéances et prolongations des marchés</p>
        </div>
        <Dialog open={isAddExtensionOpen} onOpenChange={setIsAddExtensionOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Demande de Prolongation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Demande de Prolongation</DialogTitle>
              <DialogDescription>
                Demandez une prolongation pour un marché
              </DialogDescription>
            </DialogHeader>
            <AddExtensionForm onSuccess={() => setIsAddExtensionOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Deadlines Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Marchés</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalMarkets}</div>
            <p className="text-xs text-muted-foreground">Marchés actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dans les Délais</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{onTrackMarkets}</div>
            <p className="text-xs text-muted-foreground">Sur la bonne voie</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prolongés</CardTitle>
            <CalendarDays className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{extendedMarkets}</div>
            <p className="text-xs text-muted-foreground">Avec prolongation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Retard</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{delayedMarkets}</div>
            <p className="text-xs text-muted-foreground">Délais dépassés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminés</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{completedMarkets}</div>
            <p className="text-xs text-muted-foreground">Marchés achevés</p>
          </CardContent>
        </Card>
      </div>

      {/* Deadlines Table */}
      <Card>
        <CardHeader>
          <CardTitle>Suivi des Échéances</CardTitle>
          <CardDescription>
            Détails des délais et prolongations pour chaque marché
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Marché</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Prolongation</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Jours Restants</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deadlines.map((deadline) => (
                <TableRow key={deadline.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{deadline.marketNumber}</div>
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {deadline.marketObject}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="text-muted-foreground">Original:</span>
                        <br />
                        {new Date(deadline.originalEndDate).toLocaleDateString("fr-FR")}
                      </div>
                      {deadline.extensionDays > 0 && (
                        <div>
                          <span className="text-muted-foreground">Actuel:</span>
                          <br />
                          {new Date(deadline.currentEndDate).toLocaleDateString("fr-FR")}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {deadline.extensionDays > 0 ? (
                      <div className="text-sm">
                        <div className="font-medium">+{deadline.extensionDays} jours</div>
                        <div className="text-muted-foreground text-xs">
                          {deadline.extensionReason}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Aucune</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(deadline.status)}
                      {getStatusBadge(deadline.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${deadline.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{deadline.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`font-medium ${getDaysRemainingColor(deadline.daysRemaining)}`}>
                      {deadline.daysRemaining > 0 ? (
                        <span>{deadline.daysRemaining} jours</span>
                      ) : deadline.daysRemaining < 0 ? (
                        <span>{Math.abs(deadline.daysRemaining)} jours de retard</span>
                      ) : (
                        <span>Échéance aujourd'hui</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDeadline(deadline)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Deadline Details Dialog */}
      {selectedDeadline && (
        <Dialog open={!!selectedDeadline} onOpenChange={() => setSelectedDeadline(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails des Délais</DialogTitle>
              <DialogDescription>
                {selectedDeadline.marketNumber} - {selectedDeadline.marketObject}
              </DialogDescription>
            </DialogHeader>
            <DeadlineDetails deadline={selectedDeadline} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Add Extension Form Component
function AddExtensionForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    marketNumber: "",
    extensionDays: "",
    extensionReason: "",
    newEndDate: "",
    justification: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would save the extension request to your database
    console.log("Adding extension request:", formData)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="marketNumber">Numéro du Marché</Label>
          <Input
            id="marketNumber"
            value={formData.marketNumber}
            onChange={(e) => setFormData({...formData, marketNumber: e.target.value})}
            placeholder="MP-2024-001"
            required
          />
        </div>
        <div>
          <Label htmlFor="extensionDays">Jours de Prolongation</Label>
          <Input
            id="extensionDays"
            type="number"
            value={formData.extensionDays}
            onChange={(e) => setFormData({...formData, extensionDays: e.target.value})}
            placeholder="30"
            required
          />
        </div>
        <div>
          <Label htmlFor="newEndDate">Nouvelle Date de Fin</Label>
          <Input
            id="newEndDate"
            type="date"
            value={formData.newEndDate}
            onChange={(e) => setFormData({...formData, newEndDate: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="extensionReason">Raison de la Prolongation</Label>
          <Select value={formData.extensionReason} onValueChange={(value) => setFormData({...formData, extensionReason: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une raison" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retard_materiaux">Retard dans la livraison des matériaux</SelectItem>
              <SelectItem value="conditions_climatiques">Conditions climatiques défavorables</SelectItem>
              <SelectItem value="modifications_techniques">Modifications techniques demandées</SelectItem>
              <SelectItem value="force_majeure">Force majeure</SelectItem>
              <SelectItem value="autre">Autre raison</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="justification">Justification Détaillée</Label>
        <textarea
          id="justification"
          value={formData.justification}
          onChange={(e) => setFormData({...formData, justification: e.target.value})}
          placeholder="Justifiez en détail la demande de prolongation..."
          className="w-full p-3 border border-input rounded-md min-h-[100px]"
          required
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Annuler
        </Button>
        <Button type="submit">
          Soumettre la Demande
        </Button>
      </div>
    </form>
  )
}

// Deadline Details Component
function DeadlineDetails({ deadline }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Marché:</span>
          <p>{deadline.marketNumber}</p>
        </div>
        <div>
          <span className="font-medium">Objet:</span>
          <p>{deadline.marketObject}</p>
        </div>
        <div>
          <span className="font-medium">Date de fin originale:</span>
          <p>{new Date(deadline.originalEndDate).toLocaleDateString("fr-FR")}</p>
        </div>
        <div>
          <span className="font-medium">Date de fin actuelle:</span>
          <p>{new Date(deadline.currentEndDate).toLocaleDateString("fr-FR")}</p>
        </div>
        <div>
          <span className="font-medium">Prolongation:</span>
          <p>{deadline.extensionDays > 0 ? `+${deadline.extensionDays} jours` : "Aucune"}</p>
        </div>
        <div>
          <span className="font-medium">Statut:</span>
          <p>{deadline.status}</p>
        </div>
        <div>
          <span className="font-medium">Progression:</span>
          <p>{deadline.progress}%</p>
        </div>
        <div>
          <span className="font-medium">Jours restants:</span>
          <p className={deadline.daysRemaining < 0 ? "text-red-600" : ""}>
            {deadline.daysRemaining > 0 ? `${deadline.daysRemaining} jours` : 
             deadline.daysRemaining < 0 ? `${Math.abs(deadline.daysRemaining)} jours de retard` : 
             "Échéance aujourd'hui"}
          </p>
        </div>
      </div>
      
      {deadline.extensionReason && (
        <div>
          <span className="font-medium">Raison de la prolongation:</span>
          <p className="mt-1 text-sm text-muted-foreground">{deadline.extensionReason}</p>
        </div>
      )}
    </div>
  )
} 