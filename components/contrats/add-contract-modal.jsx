"use client"

import { useState } from "react"
import { useContracts } from "../../lib/hooks/use-contracts"
import { useMarkets } from "../../lib/hooks/use-markets"
import { useAuth } from "../../lib/auth-context"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { toast } from "sonner"

export function AddContractModal({ open, onOpenChange, userRole, onSuccess }) {
  const { addContract } = useContracts()
  const { markets, loading: marketsLoading } = useMarkets()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    number: "",
    market_id: "",
    subject: "",
    awardee: "",
    awardee_address: "",
    awardee_phone: "",
    awardee_email: "",
    initial_amount: "",
    currency: "MAD",
    notification_date: "",
    start_date: "",
    duration_days: "",
    service: "",
    contract_type: "",
    procurement_method: "",
    budget_source: "",
    technical_specifications: "",
    requirements: "",
    deliverables: "",
    notes: "",
    status: "draft"
  })

  const [currentTab, setCurrentTab] = useState("basic")
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error("Utilisateur non authentifié")
      return
    }

    // Validate required fields
    const requiredFields = ['number', 'market_id', 'subject', 'awardee', 'initial_amount', 'notification_date', 'start_date', 'duration_days', 'service', 'contract_type', 'procurement_method', 'budget_source']
    const missingFields = requiredFields.filter(field => !formData[field])
    
    if (missingFields.length > 0) {
      toast.error(`Champs requis manquants: ${missingFields.join(', ')}`)
      return
    }

    setLoading(true)
    
    try {
      await addContract(formData)
      
      toast.success("Contrat créé avec succès!")
      
      // Reset form and close modal
      setFormData({
        number: "",
        market_id: "",
        subject: "",
        awardee: "",
        awardee_address: "",
        awardee_phone: "",
        awardee_email: "",
        initial_amount: "",
        currency: "MAD",
        notification_date: "",
        start_date: "",
        duration_days: "",
        service: "",
        contract_type: "",
        procurement_method: "",
        budget_source: "",
        technical_specifications: "",
        requirements: "",
        deliverables: "",
        notes: "",
        status: "draft"
      })
      
      setCurrentTab("basic")
      onOpenChange(false)
      
      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error creating contract:", error)
      toast.error(`Erreur lors de la création du contrat: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      number: "",
      market_id: "",
      subject: "",
      awardee: "",
      awardee_address: "",
      awardee_phone: "",
      awardee_email: "",
      initial_amount: "",
      currency: "MAD",
      notification_date: "",
      start_date: "",
      duration_days: "",
      service: "",
      contract_type: "",
      procurement_method: "",
      budget_source: "",
      technical_specifications: "",
      requirements: "",
      deliverables: "",
      notes: "",
      status: "draft"
    })
    setCurrentTab("basic")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouveau Contrat</DialogTitle>
          <DialogDescription>
            Créez un nouveau contrat avec toutes les informations nécessaires
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Informations de base</TabsTrigger>
              <TabsTrigger value="financial">Financier</TabsTrigger>
              <TabsTrigger value="technical">Technique</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de base</CardTitle>
                  <CardDescription>
                    Informations essentielles du contrat
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="number">Numéro du contrat *</Label>
                      <Input
                        id="number"
                        value={formData.number}
                        onChange={(e) => handleInputChange("number", e.target.value)}
                        placeholder="CTR-2024-XXX"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="market_id">Marché associé *</Label>
                      <Select value={formData.market_id} onValueChange={(value) => handleInputChange("market_id", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un marché" />
                        </SelectTrigger>
                        <SelectContent>
                          {marketsLoading ? (
                                                    <SelectItem value="loading" disabled>Chargement des marchés...</SelectItem>
                      ) : markets.length === 0 ? (
                        <SelectItem value="no_markets" disabled>Aucun marché disponible</SelectItem>
                          ) : (
                            markets.map((market) => (
                              <SelectItem key={market.id} value={market.id}>
                                {market.number} - {market.object}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="service">Service *</Label>
                      <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eau">Eau</SelectItem>
                          <SelectItem value="assainissement">Assainissement</SelectItem>
                          <SelectItem value="irrigation">Irrigation</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration_days">Durée (jours) *</Label>
                      <Input
                        id="duration_days"
                        type="number"
                        value={formData.duration_days}
                        onChange={(e) => handleInputChange("duration_days", e.target.value)}
                        placeholder="180"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Objet du contrat *</Label>
                    <Textarea
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Description détaillée de l'objet du contrat"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="awardee">Attributaire *</Label>
                      <Input
                        id="awardee"
                        value={formData.awardee}
                        onChange={(e) => handleInputChange("awardee", e.target.value)}
                        placeholder="Nom de l'entreprise attributaire"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contract_type">Type de contrat *</Label>
                      <Select value={formData.contract_type} onValueChange={(value) => handleInputChange("contract_type", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="travaux">Travaux</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="fournitures">Fournitures</SelectItem>
                          <SelectItem value="etudes">Études</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="procurement_method">Méthode de passation *</Label>
                      <Select value={formData.procurement_method} onValueChange={(value) => handleInputChange("procurement_method", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une méthode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="appel_offres">Appel d'offres</SelectItem>
                          <SelectItem value="entente_directe">Entente directe</SelectItem>
                          <SelectItem value="demande_prix">Demande de prix</SelectItem>
                          <SelectItem value="concurrence_restreinte">Concurrence restreinte</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informations financières</CardTitle>
                  <CardDescription>
                    Détails financiers et conditions de paiement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="initial_amount">Montant initial (DH) *</Label>
                      <Input
                        id="initial_amount"
                        type="number"
                        value={formData.initial_amount}
                        onChange={(e) => handleInputChange("initial_amount", e.target.value)}
                        placeholder="450000"
                        min="0"
                        step="1000"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Devise</Label>
                      <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une devise" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MAD">MAD (Dirham Marocain)</SelectItem>
                          <SelectItem value="EUR">EUR (Euro)</SelectItem>
                          <SelectItem value="USD">USD (Dollar US)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="notification_date">Date de notification *</Label>
                      <Input
                        id="notification_date"
                        type="date"
                        value={formData.notification_date}
                        onChange={(e) => handleInputChange("notification_date", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Date de début *</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => handleInputChange("start_date", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget_source">Source de budget *</Label>
                    <Select value={formData.budget_source} onValueChange={(value) => handleInputChange("budget_source", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget_etat">Budget de l'État</SelectItem>
                        <SelectItem value="budget_local">Budget local</SelectItem>
                        <SelectItem value="budget_region">Budget régional</SelectItem>
                        <SelectItem value="cooperation">Coopération internationale</SelectItem>
                        <SelectItem value="prive">Secteur privé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Spécifications techniques</CardTitle>
                  <CardDescription>
                    Détails techniques et conditions d'exécution
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="technical_specifications">Spécifications techniques</Label>
                    <Textarea
                      id="technical_specifications"
                      value={formData.technical_specifications}
                      onChange={(e) => handleInputChange("technical_specifications", e.target.value)}
                      placeholder="Spécifications techniques détaillées du projet"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Exigences</Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={(e) => handleInputChange("requirements", e.target.value)}
                      placeholder="Exigences et conditions d'exécution"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliverables">Livrables</Label>
                    <Textarea
                      id="deliverables"
                      value={formData.deliverables}
                      onChange={(e) => handleInputChange("deliverables", e.target.value)}
                      placeholder="Livrables attendus du contrat"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes et observations</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Notes additionnelles et observations"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contacts et références</CardTitle>
                  <CardDescription>
                    Informations de contact pour le suivi du contrat
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="awardee_address">Adresse de l'attributaire</Label>
                      <Input
                        id="awardee_address"
                        value={formData.awardee_address}
                        onChange={(e) => handleInputChange("awardee_address", e.target.value)}
                        placeholder="Adresse complète"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="awardee_phone">Téléphone de l'attributaire</Label>
                      <Input
                        id="awardee_phone"
                        value={formData.awardee_phone}
                        onChange={(e) => handleInputChange("awardee_phone", e.target.value)}
                        placeholder="+212 6XX XX XX XX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="awardee_email">Email de l'attributaire</Label>
                    <Input
                      id="awardee_email"
                      type="email"
                      value={formData.awardee_email}
                      onChange={(e) => handleInputChange("awardee_email", e.target.value)}
                      placeholder="contact@entreprise.ma"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              Annuler
            </Button>
            <div className="flex gap-2">
              {currentTab !== "basic" && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentTab(currentTab === "financial" ? "basic" : currentTab === "technical" ? "financial" : "technical")}
                  disabled={loading}
                >
                  Précédent
                </Button>
              )}
              {currentTab !== "contacts" ? (
                <Button 
                  type="button" 
                  onClick={() => setCurrentTab(currentTab === "basic" ? "financial" : currentTab === "financial" ? "technical" : "contacts")}
                  disabled={loading}
                >
                  Suivant
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? "Création en cours..." : "Créer le contrat"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 