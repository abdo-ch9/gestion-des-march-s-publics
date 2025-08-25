"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Edit, Eye, Calendar, DollarSign, Clock, FileText } from "lucide-react"
import { Label } from "../../components/ui/label"

export function MarketsList({ searchTerm, statusFilter, onMarketSelect }) {
  const [isEditMarketOpen, setIsEditMarketOpen] = useState(false)
  const [selectedMarketForEdit, setSelectedMarketForEdit] = useState(null)

  // Mock data for demonstration
  const markets = [
    {
      id: "MP-001",
      number: "MP-2024-001",
      object: "Installation Système d'Irrigation",
      attributaire: "Entreprise Al Amal SARL",
      amount: 2500000,
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-06-15",
      progress: 65,
      service: "Irrigation",
      contractType: "Travaux"
    },
    {
      id: "MP-002",
      number: "MP-2024-002",
      object: "Formation Techniques Agricoles",
      attributaire: "Institut de Formation Agricole",
      amount: 850000,
      status: "completed",
      startDate: "2023-09-01",
      endDate: "2024-02-28",
      progress: 100,
      service: "Formation",
      contractType: "Services"
    },
    {
      id: "MP-003",
      number: "MP-2024-003",
      object: "Maintenance Équipements",
      attributaire: "Techni-Maintenance",
      amount: 1200000,
      status: "delayed",
      startDate: "2024-02-01",
      endDate: "2024-05-01",
      progress: 45,
      service: "Équipement",
      contractType: "Maintenance"
    },
    {
      id: "MP-004",
      number: "MP-2024-004",
      object: "Construction Bâtiment Administratif",
      attributaire: "Construction Plus",
      amount: 15000000,
      status: "active",
      startDate: "2024-03-01",
      endDate: "2025-03-01",
      progress: 25,
      service: "Infrastructure",
      contractType: "Travaux"
    },
    {
      id: "MP-005",
      number: "MP-2024-005",
      object: "Fourniture Matériel Informatique",
      attributaire: "Tech Solutions",
      amount: 750000,
      status: "pending",
      startDate: "2024-04-01",
      endDate: "2024-07-01",
      progress: 0,
      service: "Informatique",
      contractType: "Fournitures"
    }
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">En cours</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Terminé</Badge>
      case "delayed":
        return <Badge className="bg-red-100 text-red-800">En retard</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getContractTypeBadge = (type) => {
    switch (type) {
      case "Travaux":
        return <Badge variant="outline" className="bg-blue-50">Travaux</Badge>
      case "Services":
        return <Badge variant="outline" className="bg-green-50">Services</Badge>
      case "Fournitures":
        return <Badge variant="outline" className="bg-purple-50">Fournitures</Badge>
      case "Maintenance":
        return <Badge variant="outline" className="bg-orange-50">Maintenance</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const filteredMarkets = markets.filter(market => {
    const matchesSearch = 
      market.object.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.attributaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.service.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || market.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleMarketSelect = (market) => {
    onMarketSelect(market)
  }

  const handleEditMarket = (market) => {
    setSelectedMarketForEdit(market)
    setIsEditMarketOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Statut</label>
              <Select value={statusFilter} onValueChange={statusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="delayed">En retard</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Service</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les services</SelectItem>
                  <SelectItem value="irrigation">Irrigation</SelectItem>
                  <SelectItem value="formation">Formation</SelectItem>
                  <SelectItem value="equipement">Équipement</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Type de Contrat</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="travaux">Travaux</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="fournitures">Fournitures</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Montant</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les montants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les montants</SelectItem>
                  <SelectItem value="small">&lt; 1M MAD</SelectItem>
                  <SelectItem value="medium">1M - 5M MAD</SelectItem>
                  <SelectItem value="large">5M - 20M MAD</SelectItem>
                  <SelectItem value="xlarge">&gt; 20M MAD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Markets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Marchés Publics</CardTitle>
          <CardDescription>
            {filteredMarkets.length} marché(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Objet</TableHead>
                <TableHead>Attributaire</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMarkets.map((market) => (
                <TableRow key={market.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="font-medium">{market.number}</div>
                    <div className="text-sm text-muted-foreground">{market.service}</div>
                    {getContractTypeBadge(market.contractType)}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="font-medium">{market.object}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{market.attributaire}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {market.amount.toLocaleString()} MAD
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(market.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${market.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{market.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(market.endDate).toLocaleDateString("fr-FR")}
                      </div>
                      <div className="text-muted-foreground">
                        {market.status === "active" && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {Math.ceil((new Date(market.endDate) - new Date()) / (1000 * 60 * 60 * 24))} jours restants
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarketSelect(market)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditMarket(market)}
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

      {/* Edit Market Dialog */}
      <Dialog open={isEditMarketOpen} onOpenChange={setIsEditMarketOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le Marché</DialogTitle>
            <DialogDescription>
              Modifiez les détails du marché {selectedMarketForEdit?.number}
            </DialogDescription>
          </DialogHeader>
          {selectedMarketForEdit && (
            <EditMarketForm 
              market={selectedMarketForEdit}
              onSuccess={() => setIsEditMarketOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Edit Market Form Component
function EditMarketForm({ market, onSuccess }) {
  const [formData, setFormData] = useState({
    object: market.object,
    attributaire: market.attributaire,
    amount: market.amount,
    status: market.status,
    startDate: market.startDate,
    endDate: market.endDate,
    service: market.service,
    contractType: market.contractType
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would update the market in your database
    console.log("Updating market:", formData)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="object">Objet du Marché</Label>
          <Input
            id="object"
            value={formData.object}
            onChange={(e) => setFormData({...formData, object: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="attributaire">Attributaire</Label>
          <Input
            id="attributaire"
            value={formData.attributaire}
            onChange={(e) => setFormData({...formData, attributaire: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="amount">Montant (MAD)</Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})}
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Statut</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="active">En cours</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="delayed">En retard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="startDate">Date de Début</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">Date de Fin</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Annuler
        </Button>
        <Button type="submit">
          Sauvegarder les Modifications
        </Button>
      </div>
    </form>
  )
} 