"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Calendar, DollarSign, FileText, Building, User, MapPin } from "lucide-react"

export function AddMarketForm({ onSuccess }) {
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState({
    // Basic Information
    number: "",
    object: "",
    service: "",
    contractType: "",
    procurementMethod: "",
    
    // Financial Information
    estimatedAmount: "",
    budgetSource: "",
    currency: "MAD",
    
    // Dates and Deadlines
    publicationDate: "",
    submissionDeadline: "",
    expectedStartDate: "",
    expectedEndDate: "",
    
    // Contractor Information
    attributaire: "",
    attributaireAddress: "",
    attributairePhone: "",
    attributaireEmail: "",
    
    // Technical Details
    technicalSpecifications: "",
    requirements: "",
    deliverables: "",
    
    // Additional Information
    notes: "",
    attachments: []
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would save the market to your database
    console.log("Adding new market:", formData)
    onSuccess()
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateMarketNumber = () => {
    const year = new Date().getFullYear()
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const marketNumber = `MP-${year}-${randomNum}`
    handleInputChange('number', marketNumber)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Informations de Base</TabsTrigger>
          <TabsTrigger value="financial">Financier</TabsTrigger>
          <TabsTrigger value="dates">Dates</TabsTrigger>
          <TabsTrigger value="contractor">Attributaire</TabsTrigger>
          <TabsTrigger value="technical">Technique</TabsTrigger>
          <TabsTrigger value="additional">Autres</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Informations de Base
              </CardTitle>
              <CardDescription>Informations essentielles du marché public</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="number">Numéro du Marché</Label>
                  <div className="flex gap-2">
                    <Input
                      id="number"
                      value={formData.number}
                      onChange={(e) => handleInputChange('number', e.target.value)}
                      placeholder="MP-2024-001"
                      required
                    />
                    <Button type="button" variant="outline" onClick={generateMarketNumber}>
                      Générer
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="service">Service Responsable</Label>
                  <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="irrigation">Irrigation</SelectItem>
                      <SelectItem value="formation">Formation</SelectItem>
                      <SelectItem value="equipement">Équipement</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="informatique">Informatique</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contractType">Type de Contrat</Label>
                  <Select value={formData.contractType} onValueChange={(value) => handleInputChange('contractType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="travaux">Travaux</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="fournitures">Fournitures</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="conseil">Conseil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="procurementMethod">Méthode de Passation</Label>
          <Select value={formData.procurementMethod} onValueChange={(value) => handleInputChange('procurementMethod', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner la méthode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appel_offres">Appel d'Offres</SelectItem>
              <SelectItem value="entente_directe">Entente Directe</SelectItem>
              <SelectItem value="demande_prix">Demande de Prix</SelectItem>
              <SelectItem value="concurrence_restreinte">Concurrence Restreinte</SelectItem>
            </SelectContent>
          </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="object">Objet du Marché</Label>
                <Textarea
                  id="object"
                  value={formData.object}
                  onChange={(e) => handleInputChange('object', e.target.value)}
                  placeholder="Description détaillée de l'objet du marché..."
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Information Tab */}
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Informations Financières
              </CardTitle>
              <CardDescription>Détails financiers du marché</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimatedAmount">Montant Estimé</Label>
                  <Input
                    id="estimatedAmount"
                    type="number"
                    value={formData.estimatedAmount}
                    onChange={(e) => handleInputChange('estimatedAmount', e.target.value)}
                    placeholder="2500000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Devise</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAD">MAD (Dirham Marocain)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      <SelectItem value="USD">USD (Dollar US)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budgetSource">Source du Budget</Label>
                  <Select value={formData.budgetSource} onValueChange={(value) => handleInputChange('budgetSource', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget_etat">Budget de l'État</SelectItem>
                      <SelectItem value="budget_local">Budget Local</SelectItem>
                      <SelectItem value="don_international">Don International</SelectItem>
                      <SelectItem value="pret">Prêt</SelectItem>
                      <SelectItem value="autofinancement">Autofinancement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dates and Deadlines Tab */}
        <TabsContent value="dates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Dates et Échéances
              </CardTitle>
              <CardDescription>Planification temporelle du marché</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="publicationDate">Date de Publication</Label>
                  <Input
                    id="publicationDate"
                    type="date"
                    value={formData.publicationDate}
                    onChange={(e) => handleInputChange('publicationDate', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="submissionDeadline">Date Limite de Soumission</Label>
                  <Input
                    id="submissionDeadline"
                    type="date"
                    value={formData.submissionDeadline}
                    onChange={(e) => handleInputChange('submissionDeadline', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="expectedStartDate">Date de Début Prévue</Label>
                  <Input
                    id="expectedStartDate"
                    type="date"
                    value={formData.expectedStartDate}
                    onChange={(e) => handleInputChange('expectedStartDate', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="expectedEndDate">Date de Fin Prévue</Label>
                  <Input
                    id="expectedEndDate"
                    type="date"
                    value={formData.expectedEndDate}
                    onChange={(e) => handleInputChange('expectedEndDate', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contractor Information Tab */}
        <TabsContent value="contractor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Informations sur l'Attributaire
              </CardTitle>
              <CardDescription>Détails de l'entreprise attributaire</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="attributaire">Nom de l'Attributaire</Label>
                  <Input
                    id="attributaire"
                    value={formData.attributaire}
                    onChange={(e) => handleInputChange('attributaire', e.target.value)}
                    placeholder="Nom de l'entreprise"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="attributaireEmail">Email</Label>
                  <Input
                    id="attributaireEmail"
                    type="email"
                    value={formData.attributaireEmail}
                    onChange={(e) => handleInputChange('attributaireEmail', e.target.value)}
                    placeholder="contact@entreprise.ma"
                  />
                </div>
                <div>
                  <Label htmlFor="attributairePhone">Téléphone</Label>
                  <Input
                    id="attributairePhone"
                    value={formData.attributairePhone}
                    onChange={(e) => handleInputChange('attributairePhone', e.target.value)}
                    placeholder="+212 6 XX XX XX XX"
                  />
                </div>
                <div>
                  <Label htmlFor="attributaireAddress">Adresse</Label>
                  <Input
                    id="attributaireAddress"
                    value={formData.attributaireAddress}
                    onChange={(e) => handleInputChange('attributaireAddress', e.target.value)}
                    placeholder="Adresse complète"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Details Tab */}
        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Spécifications Techniques
              </CardTitle>
              <CardDescription>Détails techniques et exigences du marché</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="technicalSpecifications">Spécifications Techniques</Label>
                <Textarea
                  id="technicalSpecifications"
                  value={formData.technicalSpecifications}
                  onChange={(e) => handleInputChange('technicalSpecifications', e.target.value)}
                  placeholder="Spécifications techniques détaillées..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="requirements">Exigences et Conditions</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="Exigences particulières, conditions..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="deliverables">Livrables Attendus</Label>
                <Textarea
                  id="deliverables"
                  value={formData.deliverables}
                  onChange={(e) => handleInputChange('deliverables', e.target.value)}
                  placeholder="Livrables, documents, rapports..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional Information Tab */}
        <TabsContent value="additional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Informations Supplémentaires
              </CardTitle>
              <CardDescription>Notes et documents additionnels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Notes et Observations</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Notes additionnelles, observations..."
                  rows={4}
                />
              </div>
              <div>
                <Label>Documents Joints</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">
                    Glissez-déposez vos documents ici ou cliquez pour sélectionner
                  </p>
                  <Button type="button" variant="outline" className="mt-2">
                    Sélectionner des Fichiers
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-between items-center pt-6 border-t">
        <div className="flex gap-2">
          {activeTab !== "basic" && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setActiveTab(activeTab === "financial" ? "basic" : 
                                        activeTab === "dates" ? "financial" :
                                        activeTab === "contractor" ? "dates" :
                                        activeTab === "technical" ? "contractor" : "technical")}
            >
              Précédent
            </Button>
          )}
          {activeTab !== "additional" && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setActiveTab(activeTab === "basic" ? "financial" : 
                                        activeTab === "financial" ? "dates" :
                                        activeTab === "dates" ? "contractor" :
                                        activeTab === "contractor" ? "technical" : "additional")}
            >
              Suivant
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Annuler
          </Button>
          <Button type="submit">
            Créer le Marché
          </Button>
        </div>
      </div>
    </form>
  )
} 