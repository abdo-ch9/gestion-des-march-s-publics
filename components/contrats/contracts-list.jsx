"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Eye, Edit, Trash2, AlertTriangle, Clock, CheckCircle, ChevronDown } from "lucide-react"
import { EditContractModal } from "./edit-contract-modal"
import { useContracts } from "../../lib/hooks/use-contracts"
import { toast } from "sonner"

export function ContractsList({ searchTerm, statusFilter, serviceFilter, sortBy, onViewDetails, userRole, contracts = [], onRefresh }) {
  const [editingContract, setEditingContract] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const [deletingContract, setDeletingContract] = useState(null)
  const { updateContractStatus, deleteContract } = useContracts()

  // Helper function to safely format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '0 DH'
    return Number(amount).toLocaleString('fr-FR') + ' DH'
  }

  // Helper function to safely format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('fr-FR')
    } catch (error) {
      return 'Date invalide'
    }
  }

  // Helper function to get contract display data with fallbacks
  const getContractDisplayData = (contract) => {
    return {
      id: contract.id,
      number: contract.number || 'N/A',
      subject: contract.subject || 'Sans objet',
      awardee: contract.awardee || 'Non attribué',
      initialAmount: contract.initial_amount || 0,
      startDate: contract.start_date || null,
      duration: contract.duration_days || 0,
      status: contract.status || 'draft',
      service: contract.service || 'non_specifie',
      deadline: contract.deadline_date || null,
      consumedDays: contract.consumed_days || 0,
      remainingDays: contract.remaining_days || 0,
      isOverdue: contract.is_overdue || false,
      isNearDeadline: contract.is_near_deadline || false
    }
  }

  const getStatusBadge = (status, isOverdue, isNearDeadline) => {
    if (isOverdue) {
      return <Badge variant="destructive">En Retard</Badge>
    }
    if (isNearDeadline) {
      return <Badge variant="outline" className="text-orange-600 border-orange-600">Délai Proche</Badge>
    }
    
    switch (status) {
      case "active":
        return <Badge variant="default">En Cours</Badge>
      case "completed":
        return <Badge variant="secondary">Terminé</Badge>
      case "suspended":
        return <Badge variant="outline">Suspendu</Badge>
      case "draft":
        return <Badge variant="outline">Brouillon</Badge>
      case "overdue":
        return <Badge variant="destructive">En Retard</Badge>
      case "cancelled":
        return <Badge variant="outline">Annulé</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getServiceBadge = (service) => {
    const serviceColors = {
      eau: "bg-blue-100 text-blue-800",
      assainissement: "bg-green-100 text-green-800",
      irrigation: "bg-yellow-100 text-yellow-800",
      maintenance: "bg-purple-100 text-purple-800"
    }
    
    return (
      <Badge className={serviceColors[service] || "bg-gray-100 text-gray-800"}>
        {service.charAt(0).toUpperCase() + service.slice(1)}
      </Badge>
    )
  }

  const getDeadlineStatus = (contract) => {
    if (contract.isOverdue) {
      return (
        <div className="flex items-center text-red-600">
          <AlertTriangle className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">Délai dépassé</span>
        </div>
      )
    }
    if (contract.isNearDeadline) {
      return (
        <div className="flex items-center text-orange-600">
          <Clock className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">{contract.remainingDays} jours restants</span>
        </div>
      )
    }
    return (
      <div className="flex items-center text-green-600">
        <CheckCircle className="w-4 h-4 mr-1" />
        <span className="text-sm font-medium">{contract.remainingDays} jours restants</span>
      </div>
    )
  }

  const handleEdit = (contract) => {
    setEditingContract(contract)
    setIsEditModalOpen(true)
  }

  const handleDelete = async (contractId) => {
    if (!userRole || userRole !== "admin") {
      toast.error("Vous n'avez pas les permissions pour supprimer des contrats")
      return
    }

    if (!confirm("Êtes-vous sûr de vouloir supprimer ce contrat ? Cette action est irréversible.")) {
      return
    }

    setDeletingContract(contractId)
    
    try {
      await deleteContract(contractId)
      toast.success("Contrat supprimé avec succès")
      
      // Refresh the contracts list if callback provided
      if (onRefresh) {
        onRefresh()
      }
    } catch (error) {
      console.error('Error deleting contract:', error)
      toast.error(`Erreur lors de la suppression: ${error.message}`)
    } finally {
      setDeletingContract(null)
    }
  }

  const handleStatusChange = async (contractId, newStatus) => {
    if (!userRole || (userRole !== "admin" && userRole !== "agent")) {
      toast.error("Vous n'avez pas les permissions pour modifier le statut")
      return
    }

    setUpdatingStatus(contractId)
    
    try {
      await updateContractStatus(contractId, newStatus)
      toast.success(`Statut du contrat mis à jour vers "${newStatus}"`)
      
      // Refresh the contracts list if callback provided
      if (onRefresh) {
        onRefresh()
      }
    } catch (error) {
      console.error('Error updating contract status:', error)
      toast.error(`Erreur lors de la mise à jour du statut: ${error.message}`)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      (contract.number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contract.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contract.awardee || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter
    const matchesService = serviceFilter === "all" || contract.service === serviceFilter
    
    return matchesSearch && matchesStatus && matchesService
  })

  const sortedContracts = [...filteredContracts].sort((a, b) => {
    switch (sortBy) {
      case "amount":
        return (b.initial_amount || 0) - (a.initial_amount || 0)
      case "date":
        return new Date(b.start_date || 0) - new Date(a.start_date || 0)
      case "deadline":
        return new Date(a.deadline_date || 0) - new Date(b.deadline_date || 0)
      case "status":
        return (a.status || '').localeCompare(b.status || '')
      default:
        return 0
    }
  })

  const statusOptions = [
    { value: 'draft', label: 'Brouillon' },
    { value: 'active', label: 'En Cours' },
    { value: 'completed', label: 'Terminé' },
    { value: 'suspended', label: 'Suspendu' },
    { value: 'cancelled', label: 'Annulé' }
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Liste des Contrats</CardTitle>
          <CardDescription>
            {filteredContracts.length} contrat(s) trouvé(s) sur {contracts.length} total
            {userRole && (
              <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                userRole === "admin" 
                  ? "bg-green-100 text-green-800 border border-green-300" 
                  : userRole === "agent" 
                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                  : "bg-gray-100 text-gray-800 border border-gray-300"
              }`}>
                Rôle: {userRole}
                {userRole === "admin" && " (Accès complet)"}
                {userRole === "agent" && " (Modification autorisée)"}
                {!userRole && " (Lecture seule)"}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Objet</TableHead>
                  <TableHead>Marché</TableHead>
                  <TableHead>Attributaire</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Début</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Délai</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedContracts.map((contract) => {
                  const displayData = getContractDisplayData(contract)
                  return (
                    <TableRow 
                      key={contract.id}
                      className={displayData.isOverdue ? "bg-red-50" : displayData.isNearDeadline ? "bg-orange-50" : ""}
                    >
                      <TableCell className="font-medium">{displayData.number}</TableCell>
                      <TableCell className="max-w-xs truncate" title={displayData.subject}>
                        {displayData.subject}
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={contract.markets ? `${contract.markets.number} - ${contract.markets.object}` : 'Non associé'}>
                        {contract.markets ? (
                          <div className="space-y-1">
                            <div className="font-medium text-sm">{contract.markets.number}</div>
                            <div className="text-xs text-muted-foreground truncate">{contract.markets.object}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Non associé</span>
                        )}
                      </TableCell>
                      <TableCell>{displayData.awardee}</TableCell>
                      <TableCell>
                        {formatCurrency(displayData.initialAmount)}
                      </TableCell>
                      <TableCell>
                        {formatDate(displayData.startDate)}
                      </TableCell>
                      <TableCell>{displayData.duration} jours</TableCell>
                      <TableCell>
                        {getDeadlineStatus(displayData)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {/* Status Badge */}
                          {getStatusBadge(displayData.status, displayData.isOverdue, displayData.isNearDeadline)}
                          
                          {/* Status Change Dropdown - Admin and Agent only */}
                          {(userRole === "admin" || userRole === "agent") && (
                            <div className="flex items-center space-x-2">
                              <Select
                                value={displayData.status}
                                onValueChange={(newStatus) => handleStatusChange(contract.id, newStatus)}
                                disabled={updatingStatus === contract.id}
                              >
                                <SelectTrigger className="w-32 h-8 text-xs">
                                  <SelectValue placeholder="Changer statut" />
                                </SelectTrigger>
                                <SelectContent>
                                  {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {updatingStatus === contract.id && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                              )}
                            </div>
                          )}
                          
                          {/* Service Badge */}
                          {getServiceBadge(displayData.service)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {/* 🔍 Voir détails - Toujours disponible */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewDetails(contract)}
                            title="Voir détails"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Détails</span>
                          </Button>
                          
                          {/* ✏️ Modifier - Admin et Agent */}
                          {(userRole === "admin" || userRole === "agent") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(contract)}
                              title="Modifier"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              <span className="hidden sm:inline">Modifier</span>
                            </Button>
                          )}
                          
                          {/* 🗑️ Supprimer - Admin uniquement */}
                          {userRole === "admin" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(contract.id)}
                              title="Supprimer"
                              disabled={deletingContract === contract.id}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingContract === contract.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                                  <span className="hidden sm:inline">Suppression...</span>
                                </>
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  <span className="hidden sm:inline">Supprimer</span>
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <EditContractModal
        contract={editingContract}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        userRole={userRole}
      />
    </div>
  )
} 