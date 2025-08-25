"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

export function AddContractModal({ open, onOpenChange, userRole }) {
  const [formData, setFormData] = useState({
    number: "",
    subject: "",
    awardee: "",
    initialAmount: "",
    notificationDate: "",
    startDate: "",
    duration: "",
    service: "",
    description: "",
    technicalSpecs: "",
    paymentTerms: "",
    penaltyClause: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: ""
  })

  const [currentTab, setCurrentTab] = useState("basic")

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // TODO: Implement contract creation with Supabase
      console.log("Creating contract:", formData)
      
      // Reset form and close modal
      setFormData({
        number: "",
        subject: "",
        awardee: "",
        initialAmount: "",
        notificationDate: "",
        startDate: "",
        duration: "",
        service: "",
        description: "",
        technicalSpecs: "",
        paymentTerms: "",
        penaltyClause: "",
        contactPerson: "",
        contactPhone: "",
        contactEmail: ""
      })
      
      onOpenChange(false)
      setCurrentTab("basic")
      
      // Show success message
      alert("Contrat créé avec succès!")
    } catch (error) {
      console.error("Error creating contract:", error)
      alert("Erreur lors de la création du contrat")
    }
  }

  const handleCancel = () => {
    setFormData({
      number: "",
      subject: "",
      awardee: "",
      initialAmount: "",
      notificationDate: "",
      startDate: "",
      duration: "",
      service: "",
      description: "",
      technicalSpecs: "",
      paymentTerms: "",
      penaltyClause: "",
      contactPerson: "",
      contactPhone: "",
      contactEmail: ""
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

                  <div className="space-y-2">
                    <Label htmlFor="description">Description détaillée</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Description complète du projet ou service"
                      rows={4}
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
                      <Label htmlFor="duration">Durée (jours) *</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => handleInputChange("duration", e.target.value)}
                        placeholder="180"
                        min="1"
                        required
                      />
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
                      <Label htmlFor="initialAmount">Montant initial (DH) *</Label>
                      <Input
                        id="initialAmount"
                        type="number"
                        value={formData.initialAmount}
                        onChange={(e) => handleInputChange("initialAmount", e.target.value)}
                        placeholder="450000"
                        min="0"
                        step="1000"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notificationDate">Date de notification *</Label>
                      <Input
                        id="notificationDate"
                        type="date"
                        value={formData.notificationDate}
                        onChange={(e) => handleInputChange("notificationDate", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Conditions de paiement</Label>
                    <Textarea
                      id="paymentTerms"
                      value={formData.paymentTerms}
                      onChange={(e) => handleInputChange("paymentTerms", e.target.value)}
                      placeholder="Détails des conditions de paiement (avances, décomptes, etc.)"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="penaltyClause">Clause pénale</Label>
                    <Textarea
                      id="penaltyClause"
                      value={formData.penaltyClause}
                      onChange={(e) => handleInputChange("penaltyClause", e.target.value)}
                      placeholder="Conditions de pénalités en cas de retard"
                      rows={3}
                    />
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
                    <Label htmlFor="technicalSpecs">Spécifications techniques</Label>
                    <Textarea
                      id="technicalSpecs"
                      value={formData.technicalSpecs}
                      onChange={(e) => handleInputChange("technicalSpecs", e.target.value)}
                      placeholder="Spécifications techniques détaillées du projet"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Date de début *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      required
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
                      <Label htmlFor="contactPerson">Personne de contact</Label>
                      <Input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                        placeholder="Nom et prénom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Téléphone</Label>
                      <Input
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                        placeholder="+212 6 XX XX XX XX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      placeholder="contact@entreprise.ma"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <div className="flex gap-2">
              {currentTab !== "basic" && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentTab(currentTab === "financial" ? "basic" : currentTab === "technical" ? "financial" : "technical")}
                >
                  Précédent
                </Button>
              )}
              {currentTab !== "contacts" ? (
                <Button 
                  type="button" 
                  onClick={() => setCurrentTab(currentTab === "basic" ? "financial" : currentTab === "financial" ? "technical" : "contacts")}
                >
                  Suivant
                </Button>
              ) : (
                <Button type="submit">
                  Créer le contrat
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 