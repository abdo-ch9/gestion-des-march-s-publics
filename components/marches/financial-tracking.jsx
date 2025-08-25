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
  DollarSign, 
  Calendar, 
  Plus, 
  Edit, 
  Eye, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"

export function FinancialTracking() {
  const [isAddSettlementOpen, setIsAddSettlementOpen] = useState(false)
  const [selectedSettlement, setSelectedSettlement] = useState(null)

  // Mock data for financial settlements
  const settlements = [
    {
      id: "SET-001",
      marketNumber: "MP-2024-001",
      marketObject: "Installation Système d'Irrigation",
      settlementNumber: "Décompte 1",
      amount: 850000,
      percentage: 34,
      status: "validated",
      submissionDate: "2024-03-15",
      validationDate: "2024-03-20",
      validator: "Ahmed Benali",
      notes: "Décompte validé pour la première phase"
    },
    {
      id: "SET-002",
      marketNumber: "MP-2024-001",
      marketObject: "Installation Système d'Irrigation",
      settlementNumber: "Décompte 2",
      amount: 1200000,
      percentage: 48,
      status: "pending",
      submissionDate: "2024-04-01",
      validationDate: null,
      validator: null,
      notes: "En attente de validation"
    },
    {
      id: "SET-003",
      marketNumber: "MP-2024-003",
      marketObject: "Maintenance Équipements",
      settlementNumber: "Décompte 1",
      amount: 450000,
      percentage: 37.5,
      status: "rejected",
      submissionDate: "2024-03-10",
      validationDate: "2024-03-12",
      validator: "Fatima Zahra",
      notes: "Rejeté - documents incomplets"
    },
    {
      id: "SET-004",
      marketNumber: "MP-2024-004",
      marketObject: "Construction Bâtiment Administratif",
      settlementNumber: "Décompte 1",
      amount: 3750000,
      percentage: 25,
      status: "validated",
      submissionDate: "2024-03-25",
      validationDate: "2024-03-28",
      validator: "Mohammed Alami",
      notes: "Validation pour la fondation"
    }
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case "validated":
        return <Badge className="bg-green-100 text-green-800">Validé</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>
      case "draft":
        return <Badge variant="outline">Brouillon</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "validated":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "rejected":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  // Calculate totals
  const totalAmount = settlements.reduce((sum, s) => sum + s.amount, 0)
  const validatedAmount = settlements.filter(s => s.status === "validated").reduce((sum, s) => sum + s.amount, 0)
  const pendingAmount = settlements.filter(s => s.status === "pending").reduce((sum, s) => sum + s.amount, 0)
  const rejectedAmount = settlements.filter(s => s.status === "rejected").reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Suivi Financier</h2>
          <p className="text-muted-foreground">Gestion des décomptes financiers et validations</p>
        </div>
        <Dialog open={isAddSettlementOpen} onOpenChange={setIsAddSettlementOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Décompte
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un Décompte Financier</DialogTitle>
              <DialogDescription>
                Enregistrez un nouveau décompte pour un marché
              </DialogDescription>
            </DialogHeader>
            <AddSettlementForm onSuccess={() => setIsAddSettlementOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Décomptes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {totalAmount.toLocaleString()} MAD
            </div>
            <p className="text-xs text-muted-foreground">
              {settlements.length} décompte(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {validatedAmount.toLocaleString()} MAD
            </div>
            <p className="text-xs text-muted-foreground">
              {settlements.filter(s => s.status === "validated").length} décompte(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingAmount.toLocaleString()} MAD
            </div>
            <p className="text-xs text-muted-foreground">
              {settlements.filter(s => s.status === "pending").length} décompte(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejetés</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {rejectedAmount.toLocaleString()} MAD
            </div>
            <p className="text-xs text-muted-foreground">
              {settlements.filter(s => s.status === "rejected").length} décompte(s)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Settlements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Décomptes Financiers</CardTitle>
          <CardDescription>
            Suivi de tous les décomptes et leurs statuts de validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Marché</TableHead>
                <TableHead>Décompte</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Pourcentage</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Validateur</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settlements.map((settlement) => (
                <TableRow key={settlement.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{settlement.marketNumber}</div>
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {settlement.marketObject}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{settlement.settlementNumber}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {settlement.amount.toLocaleString()} MAD
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${settlement.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{settlement.percentage}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(settlement.status)}
                      {getStatusBadge(settlement.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="text-muted-foreground">Soumis:</span>
                        <br />
                        {new Date(settlement.submissionDate).toLocaleDateString("fr-FR")}
                      </div>
                      {settlement.validationDate && (
                        <div>
                          <span className="text-muted-foreground">Validé:</span>
                          <br />
                          {new Date(settlement.validationDate).toLocaleDateString("fr-FR")}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {settlement.validator || (
                        <span className="text-muted-foreground">Non assigné</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSettlement(settlement)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSettlement(settlement)
                          setIsAddSettlementOpen(true)
                        }}
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

      {/* Settlement Details Dialog */}
      {selectedSettlement && (
        <Dialog open={!!selectedSettlement} onOpenChange={() => setSelectedSettlement(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails du Décompte</DialogTitle>
              <DialogDescription>
                {selectedSettlement.settlementNumber} - {selectedSettlement.marketNumber}
              </DialogDescription>
            </DialogHeader>
            <SettlementDetails settlement={selectedSettlement} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Add Settlement Form Component
function AddSettlementForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    marketNumber: "",
    settlementNumber: "",
    amount: "",
    percentage: "",
    notes: "",
    submissionDate: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would save the settlement to your database
    console.log("Adding new settlement:", formData)
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
          <Label htmlFor="settlementNumber">Numéro du Décompte</Label>
          <Input
            id="settlementNumber"
            value={formData.settlementNumber}
            onChange={(e) => setFormData({...formData, settlementNumber: e.target.value})}
            placeholder="Décompte 1"
            required
          />
        </div>
        <div>
          <Label htmlFor="amount">Montant (MAD)</Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            placeholder="850000"
            required
          />
        </div>
        <div>
          <Label htmlFor="percentage">Pourcentage (%)</Label>
          <Input
            id="percentage"
            type="number"
            value={formData.percentage}
            onChange={(e) => setFormData({...formData, percentage: e.target.value})}
            placeholder="34"
            required
          />
        </div>
        <div>
          <Label htmlFor="submissionDate">Date de Soumission</Label>
          <Input
            id="submissionDate"
            type="date"
            value={formData.submissionDate}
            onChange={(e) => setFormData({...formData, submissionDate: e.target.value})}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Notes sur le décompte..."
          className="w-full p-3 border border-input rounded-md min-h-[100px]"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Annuler
        </Button>
        <Button type="submit">
          Créer le Décompte
        </Button>
      </div>
    </form>
  )
}

// Settlement Details Component
function SettlementDetails({ settlement }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Marché:</span>
          <p>{settlement.marketNumber}</p>
        </div>
        <div>
          <span className="font-medium">Décompte:</span>
          <p>{settlement.settlementNumber}</p>
        </div>
        <div>
          <span className="font-medium">Montant:</span>
          <p>{settlement.amount.toLocaleString()} MAD</p>
        </div>
        <div>
          <span className="font-medium">Pourcentage:</span>
          <p>{settlement.percentage}%</p>
        </div>
        <div>
          <span className="font-medium">Statut:</span>
          <p>{settlement.status}</p>
        </div>
        <div>
          <span className="font-medium">Date de soumission:</span>
          <p>{new Date(settlement.submissionDate).toLocaleDateString("fr-FR")}</p>
        </div>
        {settlement.validationDate && (
          <div>
            <span className="font-medium">Date de validation:</span>
            <p>{new Date(settlement.validationDate).toLocaleDateString("fr-FR")}</p>
          </div>
        )}
        {settlement.validator && (
          <div>
            <span className="font-medium">Validateur:</span>
            <p>{settlement.validator}</p>
          </div>
        )}
      </div>
      
      {settlement.notes && (
        <div>
          <span className="font-medium">Notes:</span>
          <p className="mt-1 text-sm text-muted-foreground">{settlement.notes}</p>
        </div>
      )}
    </div>
  )
} 