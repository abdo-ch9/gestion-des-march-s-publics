"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Edit, Eye, Calendar, DollarSign, Clock, FileText, Loader2, RefreshCw } from "lucide-react"
import { Label } from "../../components/ui/label"
import { useMarkets } from "../../lib/hooks/use-markets"
import { toast } from "sonner"
import { EditMarketForm } from "./edit-market-form"

export function MarketsList({ searchTerm, statusFilter, onMarketSelect, onRefresh }) {
  const [isEditMarketOpen, setIsEditMarketOpen] = useState(false)
  const [selectedMarketForEdit, setSelectedMarketForEdit] = useState(null)
  const [filteredMarkets, setFilteredMarkets] = useState([])
  
  const { markets, loading, error, fetchMarkets, deleteMarket } = useMarkets()

  // Filter markets based on search term and status
  useEffect(() => {
    let filtered = markets

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(market => 
        market.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        market.object?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        market.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        market.attributaire?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(market => market.status === statusFilter)
    }

    setFilteredMarkets(filtered)
  }, [markets, searchTerm, statusFilter])

  // Handle market deletion
  const handleDeleteMarket = async (marketId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce marché ?')) {
      try {
        await deleteMarket(marketId)
        toast.success('Marché supprimé avec succès')
      } catch (err) {
        toast.error('Erreur lors de la suppression du marché')
      }
    }
  }

  // Format currency
  const formatCurrency = (amount, currency = 'MAD') => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Brouillon</Badge>
      case "published":
        return <Badge className="bg-blue-100 text-blue-800">Publié</Badge>
      case "in_progress":
        return <Badge className="bg-green-100 text-green-800">En cours</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Annulé</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get service badge
  const getServiceBadge = (service) => {
    const serviceColors = {
      irrigation: "bg-blue-100 text-blue-800",
      formation: "bg-green-100 text-green-800",
      equipement: "bg-purple-100 text-purple-800",
      infrastructure: "bg-orange-100 text-orange-800",
      informatique: "bg-indigo-100 text-indigo-800",
      maintenance: "bg-red-100 text-red-800"
    }
    
    return (
      <Badge className={serviceColors[service] || "bg-gray-100 text-gray-800"}>
        {service}
      </Badge>
    )
  }

  // Calculate progress based on dates
  const calculateProgress = (startDate, endDate) => {
    if (!startDate || !endDate) return 0
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    const now = new Date()
    
    if (now < start) return 0
    if (now > end) return 100
    
    const total = end - start
    const elapsed = now - start
    return Math.round((elapsed / total) * 100)
  }

  if (loading && markets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement des marchés...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-600 mb-4">Erreur lors du chargement des marchés: {error}</p>
        <Button onClick={fetchMarkets} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Markets Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Liste des Marchés ({filteredMarkets.length})
            </div>
            <Button onClick={fetchMarkets} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </CardTitle>
          <CardDescription>
            Gestion des marchés publics et suivi des contrats
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredMarkets.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Aucun marché trouvé</p>
              {searchTerm || statusFilter !== 'all' ? (
                <p className="text-sm text-gray-500 mt-2">
                  Essayez de modifier vos filtres de recherche
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  Commencez par créer votre premier marché
                </p>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Objet</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Attributaire</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Progression</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMarkets.map((market) => {
                  const progress = calculateProgress(market.expected_start_date, market.expected_end_date)
                  
                  return (
                    <TableRow key={market.id}>
                      <TableCell className="font-mono text-sm">
                        {market.number}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={market.object}>
                          {market.object}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getServiceBadge(market.service)}
                      </TableCell>
                      <TableCell>
                        {market.attributaire || 'Non attribué'}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(market.estimated_amount, market.currency)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(market.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Début: {formatDate(market.expected_start_date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Fin: {formatDate(market.expected_end_date)}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onMarketSelect(market)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedMarketForEdit(market)
                              setIsEditMarketOpen(true)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteMarket(market.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Supprimer
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Market Dialog */}
      <Dialog open={isEditMarketOpen} onOpenChange={setIsEditMarketOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le Marché</DialogTitle>
            <DialogDescription>
              Modifiez les informations du marché sélectionné
            </DialogDescription>
          </DialogHeader>
          <EditMarketForm 
            market={selectedMarketForEdit}
            onSuccess={() => {
              setIsEditMarketOpen(false)
              setSelectedMarketForEdit(null)
              // Refresh the markets list
              if (onRefresh) onRefresh()
            }}
            onCancel={() => {
              setIsEditMarketOpen(false)
              setSelectedMarketForEdit(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
} 