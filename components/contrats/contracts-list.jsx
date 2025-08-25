"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Eye, Edit, Trash2, AlertTriangle, Clock, CheckCircle } from "lucide-react"
import { EditContractModal } from "./edit-contract-modal"

export function ContractsList({ searchTerm, statusFilter, serviceFilter, sortBy, onViewDetails, userRole }) {
  const [editingContract, setEditingContract] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Debug: Log the userRole to see what's being received
  console.log("ContractsList - userRole received:", userRole)
  console.log("ContractsList - userRole type:", typeof userRole)
  console.log("ContractsList - userRole === 'admin':", userRole === "admin")
  console.log("ContractsList - userRole === 'agent':", userRole === "agent")

  // Mock data - replace with real data from Supabase
  const contracts = [
    {
      id: 1,
      number: "CTR-2024-001",
      subject: "Réhabilitation du réseau d'eau potable",
      awardee: "Entreprise ABC",
      initialAmount: 450000,
      notificationDate: "2024-01-15",
      startDate: "2024-02-01",
      duration: 180,
      status: "active",
      service: "eau",
      deadline: "2024-08-01",
      consumedDays: 45,
      remainingDays: 135,
      isOverdue: false,
      isNearDeadline: false
    },
    {
      id: 2,
      number: "CTR-2024-002",
      subject: "Construction station d'épuration",
      awardee: "Société XYZ",
      initialAmount: 1200000,
      notificationDate: "2024-01-20",
      startDate: "2024-02-15",
      duration: 365,
      status: "active",
      service: "assainissement",
      deadline: "2025-02-15",
      consumedDays: 30,
      remainingDays: 335,
      isOverdue: false,
      isNearDeadline: false
    },
    {
      id: 3,
      number: "CTR-2024-003",
      subject: "Maintenance système d'irrigation",
      awardee: "Technique Plus",
      initialAmount: 180000,
      notificationDate: "2024-01-10",
      startDate: "2024-01-25",
      duration: 90,
      status: "overdue",
      service: "irrigation",
      deadline: "2024-04-25",
      consumedDays: 90,
      remainingDays: 0,
      isOverdue: true,
      isNearDeadline: false
    },
    {
      id: 4,
      number: "CTR-2024-004",
      subject: "Rénovation pompes de relevage",
      awardee: "Mécanique Pro",
      initialAmount: 320000,
      notificationDate: "2024-01-05",
      startDate: "2024-01-20",
      duration: 120,
      status: "active",
      service: "maintenance",
      deadline: "2024-05-20",
      consumedDays: 75,
      remainingDays: 45,
      isOverdue: false,
      isNearDeadline: true
    },
    {
      id: 5,
      number: "CTR-2024-005",
      subject: "Extension réseau eau",
      awardee: "Hydraulique SA",
      initialAmount: 650000,
      notificationDate: "2024-01-25",
      startDate: "2024-02-10",
      duration: 240,
      status: "active",
      service: "eau",
      deadline: "2024-10-10",
      consumedDays: 25,
      remainingDays: 215,
      isOverdue: false,
      isNearDeadline: false
    }
  ]

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

  const handleDelete = (contractId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce contrat ?")) {
      // TODO: Implement delete functionality with Supabase
      console.log("Deleting contract:", contractId)
    }
  }

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.awardee.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter
    const matchesService = serviceFilter === "all" || contract.service === serviceFilter
    
    return matchesSearch && matchesStatus && matchesService
  })

  const sortedContracts = [...filteredContracts].sort((a, b) => {
    switch (sortBy) {
      case "amount":
        return b.initialAmount - a.initialAmount
      case "date":
        return new Date(b.startDate) - new Date(a.startDate)
      case "deadline":
        return new Date(a.deadline) - new Date(b.deadline)
      case "status":
        return a.status.localeCompare(b.status)
      default:
        return 0
    }
  })

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
                {sortedContracts.map((contract) => (
                  <TableRow 
                    key={contract.id}
                    className={contract.isOverdue ? "bg-red-50" : contract.isNearDeadline ? "bg-orange-50" : ""}
                  >
                    <TableCell className="font-medium">{contract.number}</TableCell>
                    <TableCell className="max-w-xs truncate" title={contract.subject}>
                      {contract.subject}
                    </TableCell>
                    <TableCell>{contract.awardee}</TableCell>
                    <TableCell>
                      {contract.initialAmount.toLocaleString('fr-FR')} DH
                    </TableCell>
                    <TableCell>
                      {new Date(contract.startDate).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>{contract.duration} jours</TableCell>
                    <TableCell>
                      {getDeadlineStatus(contract)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getStatusBadge(contract.status, contract.isOverdue, contract.isNearDeadline)}
                        {getServiceBadge(contract.service)}
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
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Supprimer</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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