"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Progress } from "../../components/ui/progress"
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  Building, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Clock,
  CheckCircle,
  AlertTriangle,
  Edit,
  Download,
  Share2
} from "lucide-react"

export function MarketDetails({ market }) {
  // Mock detailed data for the selected market
  const marketDetails = {
    ...market,
    // Additional details
    description: "Installation complète d'un système d'irrigation moderne pour 50 hectares de terres agricoles, incluant la pose de canalisations, l'installation de pompes et la mise en place d'un système de contrôle automatisé.",
    location: "Commune rurale d'Aït Ben Haddou, Province d'Ouarzazate",
    budgetSource: "Budget de l'État",
    procurementMethod: "Appel d'Offres",
    technicalSpecifications: "Système d'irrigation goutte-à-goutte avec contrôle automatique, pompes de 50 CV, canalisations PVC de 200mm, vannes automatiques, système de filtration.",
    requirements: "Entreprise certifiée ISO 9001, expérience minimum 5 ans dans l'irrigation agricole, équipe technique qualifiée.",
    deliverables: "Système d'irrigation fonctionnel, documentation technique complète, formation du personnel, garantie 2 ans.",
    milestones: [
      { id: 1, name: "Préparation du terrain", date: "2024-01-15", status: "completed", progress: 100 },
      { id: 2, name: "Installation des canalisations", date: "2024-02-15", status: "completed", progress: 100 },
      { id: 3, name: "Installation des pompes", date: "2024-03-15", status: "completed", progress: 100 },
      { id: 4, name: "Installation du système de contrôle", date: "2024-04-15", status: "in_progress", progress: 65 },
      { id: 5, name: "Tests et mise en service", date: "2024-05-15", status: "pending", progress: 0 },
      { id: 6, name: "Formation et livraison", date: "2024-06-15", status: "pending", progress: 0 }
    ],
    documents: [
      { id: 1, name: "Cahier des charges", type: "pdf", size: "2.5 MB", uploadDate: "2024-01-10" },
      { id: 2, name: "Plans techniques", type: "dwg", size: "1.8 MB", uploadDate: "2024-01-12" },
      { id: 3, name: "Devis détaillé", type: "pdf", size: "3.2 MB", uploadDate: "2024-01-15" },
      { id: 4, name: "Contrat signé", type: "pdf", size: "1.5 MB", uploadDate: "2024-01-20" }
    ],
    contacts: [
      { name: "Ahmed Benali", role: "Chef de projet", phone: "+212 6 12 34 56 78", email: "ahmed.benali@ormvao.ma" },
      { name: "Fatima Zahra", role: "Responsable technique", phone: "+212 6 98 76 54 32", email: "fatima.zahra@ormvao.ma" }
    ],
    financialSummary: {
      totalAmount: 2500000,
      paidAmount: 850000,
      pendingAmount: 1200000,
      remainingAmount: 450000,
      settlements: [
        { id: 1, number: "Décompte 1", amount: 850000, percentage: 34, status: "validated", date: "2024-03-20" },
        { id: 2, number: "Décompte 2", amount: 1200000, percentage: 48, status: "pending", date: "2024-04-01" }
      ]
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "delayed":
        return <Badge className="bg-red-100 text-red-800">En retard</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMilestoneIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-gray-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getSettlementStatusBadge = (status) => {
    switch (status) {
      case "validated":
        return <Badge className="bg-green-100 text-green-800">Validé</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{marketDetails.object}</h2>
          <p className="text-muted-foreground">{marketDetails.number} • {marketDetails.service}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Partager
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {marketDetails.amount.toLocaleString()} MAD
            </div>
            <p className="text-xs text-muted-foreground">Budget alloué</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{marketDetails.progress}%</div>
            <Progress value={marketDetails.progress} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Échéance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Date(marketDetails.endDate).toLocaleDateString("fr-FR")}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.ceil((new Date(marketDetails.endDate) - new Date()) / (1000 * 60 * 60 * 24))} jours restants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statut</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-foreground">
              {getStatusBadge(marketDetails.status)}
            </div>
            <p className="text-xs text-muted-foreground">État actuel</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="technical">Technique</TabsTrigger>
          <TabsTrigger value="financial">Financier</TabsTrigger>
          <TabsTrigger value="timeline">Planning</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations Générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">{marketDetails.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Localisation</Label>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {marketDetails.location}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Attributaire</Label>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    {marketDetails.attributaire}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Source du Budget</Label>
                  <p className="text-sm text-muted-foreground mt-1">{marketDetails.budgetSource}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Méthode de Passation</Label>
                  <p className="text-sm text-muted-foreground mt-1">{marketDetails.procurementMethod}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dates Clés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Date de Début</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(marketDetails.startDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Date de Fin</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(marketDetails.endDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Durée Totale</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {Math.ceil((new Date(marketDetails.endDate) - new Date(marketDetails.startDate)) / (1000 * 60 * 60 * 24))} jours
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Technical Tab */}
        <TabsContent value="technical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spécifications Techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{marketDetails.technicalSpecifications}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exigences</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{marketDetails.requirements}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Livrables Attendus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{marketDetails.deliverables}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Résumé Financier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Montant Total</Label>
                    <p className="text-lg font-bold text-primary">
                      {marketDetails.financialSummary.totalAmount.toLocaleString()} MAD
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Montant Payé</Label>
                    <p className="text-lg font-bold text-green-600">
                      {marketDetails.financialSummary.paidAmount.toLocaleString()} MAD
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">En Attente</Label>
                    <p className="text-lg font-bold text-yellow-600">
                      {marketDetails.financialSummary.pendingAmount.toLocaleString()} MAD
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Restant</Label>
                    <p className="text-lg font-bold text-blue-600">
                      {marketDetails.financialSummary.remainingAmount.toLocaleString()} MAD
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Décomptes Financiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketDetails.financialSummary.settlements.map((settlement) => (
                    <div key={settlement.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{settlement.number}</div>
                        <div className="text-sm text-muted-foreground">
                          {settlement.amount.toLocaleString()} MAD ({settlement.percentage}%)
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSettlementStatusBadge(settlement.status)}
                        <span className="text-sm text-muted-foreground">
                          {new Date(settlement.date).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Planning et Jalons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketDetails.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {getMilestoneIcon(milestone.status)}
                      <div>
                        <div className="font-medium">{milestone.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(milestone.date).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${milestone.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{milestone.progress}%</span>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(milestone.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents du Marché</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketDetails.documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{document.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {document.type.toUpperCase()} • {document.size} • {new Date(document.uploadDate).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contacts du Projet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketDetails.contacts.map((contact, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-muted-foreground">{contact.role}</div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {contact.email}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Contacter
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 