"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Plus, Edit, Calendar, DollarSign, AlertTriangle, CheckCircle, Clock, Eye } from "lucide-react"
import { AddSettlementModal } from "./add-settlement-modal"
import { AddDeadlineModal } from "./add-deadline-modal"

export function ContractDetails({ contract, open, onOpenChange, userRole }) {
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false)
  const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState(false)

  if (!contract) return null

  // Mock data - replace with real data from Supabase
  const settlements = [
    {
      id: 1,
      number: "DEC-001",
      amount: 150000,
      validationDate: "2024-03-15",
      status: "validated",
      description: "Décompte des travaux de terrassement"
    },
    {
      id: 2,
      number: "DEC-002",
      amount: 200000,
      validationDate: "2024-04-01",
      status: "pending",
      description: "Décompte des travaux de maçonnerie"
    }
  ]

  const deadlines = [
    {
      id: 1,
      type: "initial",
      startDate: "2024-02-01",
      endDate: "2024-08-01",
      consumedDays: 45,
      remainingDays: 135,
      status: "active"
    },
    {
      id: 2,
      type: "extension",
      startDate: "2024-08-01",
      endDate: "2024-09-01",
      consumedDays: 0,
      remainingDays: 30,
      status: "pending"
    }
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case "validated":
        return <Badge variant="default">Validé</Badge>
      case "pending":
        return <Badge variant="outline">En attente</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejeté</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDeadlineStatus = (deadline) => {
    if (deadline.status === "pending") {
      return <Badge variant="outline" className="text-blue-600">En attente</Badge>
    }
    if (deadline.remainingDays <= 0) {
      return <Badge variant="destructive">Expiré</Badge>
    }
    if (deadline.remainingDays <= 30) {
      return <Badge variant="outline" className="text-orange-600">Proche expiration</Badge>
    }
    return <Badge variant="default">Actif</Badge>
  }

  const totalSettlements = settlements.reduce((sum, s) => sum + s.amount, 0)
  const pendingSettlements = settlements.filter(s => s.status === "pending").length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails du Contrat {contract.number}</DialogTitle>
          <DialogDescription>
            Informations complètes, décomptes et délais du contrat
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contract Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Vue d'ensemble</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Objet</p>
                  <p className="font-medium">{contract.subject}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Attributaire</p>
                  <p className="font-medium">{contract.awardee}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Montant initial</p>
                  <p className="font-medium">{contract.initialAmount.toLocaleString('fr-FR')} DH</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Durée</p>
                  <p className="font-medium">{contract.duration} jours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="settlements">Décomptes</TabsTrigger>
              <TabsTrigger value="deadlines">Délais</TabsTrigger>
              <TabsTrigger value="charts">Graphiques</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Résumé financier
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Montant initial</span>
                        <span className="font-medium">{contract.initialAmount.toLocaleString('fr-FR')} DH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Décomptes validés</span>
                        <span className="font-medium text-green-600">{totalSettlements.toLocaleString('fr-FR')} DH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Solde restant</span>
                        <span className="font-medium text-blue-600">{(contract.initialAmount - totalSettlements).toLocaleString('fr-FR')} DH</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span>Décomptes en attente</span>
                        <Badge variant="outline">{pendingSettlements}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Suivi des délais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Date de début</span>
                        <span className="font-medium">{new Date(contract.startDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Délai initial</span>
                        <span className="font-medium">{contract.duration} jours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jours consommés</span>
                        <span className="font-medium">{contract.consumedDays} jours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jours restants</span>
                        <span className={`font-medium ${contract.remainingDays <= 30 ? 'text-orange-600' : 'text-green-600'}`}>
                          {contract.remainingDays} jours
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span>Statut</span>
                        {contract.isOverdue ? (
                          <Badge variant="destructive">En retard</Badge>
                        ) : contract.isNearDeadline ? (
                          <Badge variant="outline" className="text-orange-600">Délai proche</Badge>
                        ) : (
                          <Badge variant="default">Dans les délais</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settlements" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Décomptes financiers</CardTitle>
                    <CardDescription>
                      Suivi des décomptes et validations
                    </CardDescription>
                  </div>
                  {(userRole === "admin" || userRole === "agent") && (
                    <Button onClick={() => setIsSettlementModalOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau décompte
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Numéro</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Date de validation</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {settlements.map((settlement) => (
                          <TableRow key={settlement.id}>
                            <TableCell className="font-medium">{settlement.number}</TableCell>
                            <TableCell>{settlement.description}</TableCell>
                            <TableCell>{settlement.amount.toLocaleString('fr-FR')} DH</TableCell>
                            <TableCell>
                              {settlement.validationDate ? new Date(settlement.validationDate).toLocaleDateString('fr-FR') : '-'}
                            </TableCell>
                            <TableCell>{getStatusBadge(settlement.status)}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  title="Voir détails"
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  <span className="hidden sm:inline">Détails</span>
                                </Button>
                                {(userRole === "admin" || userRole === "agent") && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    title="Modifier"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  >
                                    <Edit className="w-4 h-4 mr-1" />
                                    <span className="hidden sm:inline">Modifier</span>
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
            </TabsContent>

            <TabsContent value="deadlines" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Gestion des délais</CardTitle>
                    <CardDescription>
                      Suivi des délais et prolongations
                    </CardDescription>
                  </div>
                  {(userRole === "admin" || userRole === "agent") && (
                    <Button onClick={() => setIsDeadlineModalOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau délai
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Période</TableHead>
                          <TableHead>Jours consommés</TableHead>
                          <TableHead>Jours restants</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deadlines.map((deadline) => (
                          <TableRow key={deadline.id}>
                            <TableCell className="font-medium capitalize">{deadline.type}</TableCell>
                            <TableCell>
                              {new Date(deadline.startDate).toLocaleDateString('fr-FR')} - {new Date(deadline.endDate).toLocaleDateString('fr-FR')}
                            </TableCell>
                            <TableCell>{deadline.consumedDays} jours</TableCell>
                            <TableCell>{deadline.remainingDays} jours</TableCell>
                            <TableCell>{getDeadlineStatus(deadline)}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  title="Voir détails"
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  <span className="hidden sm:inline">Détails</span>
                                </Button>
                                {(userRole === "admin" || userRole === "agent") && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    title="Modifier"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  >
                                    <Edit className="w-4 h-4 mr-1" />
                                    <span className="hidden sm:inline">Modifier</span>
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
            </TabsContent>

            <TabsContent value="charts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Graphiques de suivi</CardTitle>
                  <CardDescription>
                    Visualisation de l'évolution des décomptes et délais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <h4 className="font-medium">Progression des décomptes</h4>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(totalSettlements / contract.initialAmount) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {((totalSettlements / contract.initialAmount) * 100).toFixed(1)}% du montant initial
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Consommation des délais</h4>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(contract.consumedDays / contract.duration) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {((contract.consumedDays / contract.duration) * 100).toFixed(1)}% du délai initial
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-muted-foreground text-center">
                        Les graphiques détaillés avec Chart.js ou Recharts seront intégrés ici pour afficher 
                        l'évolution temporelle des décomptes et la consommation des délais.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Modals */}
        <AddSettlementModal
          contractId={contract.id}
          open={isSettlementModalOpen}
          onOpenChange={setIsSettlementModalOpen}
          userRole={userRole}
        />

        <AddDeadlineModal
          contractId={contract.id}
          open={isDeadlineModalOpen}
          onOpenChange={setIsDeadlineModalOpen}
          userRole={userRole}
        />
      </DialogContent>
    </Dialog>
  )
} 