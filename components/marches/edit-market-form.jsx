"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Calendar, DollarSign, FileText, Building, Loader2 } from "lucide-react"
import { useMarkets } from "../../lib/hooks/use-markets"
import { toast } from "sonner"

export function EditMarketForm({ market, onSuccess, onCancel }) {
  const { updateMarket, loading } = useMarkets()
  const [activeTab, setActiveTab] = useState("basic")
  const [isFormReady, setIsFormReady] = useState(false)
  
  // Initialize form data directly from market prop
  const getInitialFormData = (marketData) => {
    if (!marketData || !marketData.id) {
      return {
        number: "",
        object: "",
        service: "",
        contract_type: "",
        procurement_method: "",
        estimated_amount: "",
        budget_source: "",
        currency: "MAD",
        publication_date: "",
        submission_deadline: "",
        expected_start_date: "",
        expected_end_date: "",
        attributaire: "",
        attributaire_address: "",
        attributaire_phone: "",
        attributaire_email: "",
        technical_specifications: "",
        requirements: "",
        deliverables: "",
        notes: "",
        status: "draft"
      }
    }
    
    return {
      number: marketData.number || "",
      object: marketData.object || "",
      service: marketData.service || "irrigation",
      contract_type: marketData.contract_type || "travaux",
      procurement_method: marketData.procurement_method || "appel_offres",
      estimated_amount: marketData.estimated_amount || "",
      budget_source: marketData.budget_source || "budget_etat",
      currency: marketData.currency || "MAD",
      publication_date: marketData.publication_date || "",
      submission_deadline: marketData.submission_deadline || "",
      expected_start_date: marketData.expected_start_date || "",
      expected_end_date: marketData.expected_end_date || "",
      attributaire: marketData.attributaire || "",
      attributaire_address: marketData.attributaire_address || "",
      attributaire_phone: marketData.attributaire_phone || "",
      attributaire_email: marketData.attributaire_email || "",
      technical_specifications: marketData.technical_specifications || "",
      requirements: marketData.requirements || "",
      deliverables: marketData.deliverables || "",
      notes: marketData.notes || "",
      status: marketData.status || "draft"
    }
  }
  
  // Initialize with empty data first, then update when market prop is available
  const [formData, setFormData] = useState({
    number: "",
    object: "",
    service: "",
    contract_type: "",
    procurement_method: "",
    estimated_amount: "",
    budget_source: "",
    currency: "MAD",
    publication_date: "",
    submission_deadline: "",
    expected_start_date: "",
    expected_end_date: "",
    attributaire: "",
    attributaire_address: "",
    attributaire_phone: "",
    attributaire_email: "",
    technical_specifications: "",
    requirements: "",
    deliverables: "",
    notes: "",
    status: "draft"
  })

  // Initialize form data when market prop changes
  useEffect(() => {
    console.log("useEffect triggered with market:", market)
    console.log("useEffect triggered with market.id:", market?.id)
    
    if (market && market.id) {
      console.log("Initializing form data with market:", market)
      console.log("Market service:", market.service)
      console.log("Market contract_type:", market.contract_type)
      console.log("Market status:", market.status)
      
      // Get fresh initial data
      const initialData = getInitialFormData(market)
      
      console.log("Setting initial form data:", initialData)
      console.log("Initial service value:", initialData.service)
      console.log("Initial contract_type value:", initialData.contract_type)
      
      // Force a complete state update
      setFormData(initialData)
      setIsFormReady(true)
      
      // Also log the current state after setting
      setTimeout(() => {
        console.log("Form data after setState:", initialData)
        console.log("Current formData state should be:", initialData)
      }, 0)
    } else {
      console.log("No market data provided or market.id is missing")
      setIsFormReady(false)
    }
  }, [market?.id]) // Use market.id as dependency instead of the entire market object

  // Add another useEffect to monitor formData changes
  useEffect(() => {
    console.log("formData changed to:", formData)
  }, [formData])

  // Force update form data when market changes (backup mechanism)
  useEffect(() => {
    if (market && market.id) {
      const freshData = getInitialFormData(market)
      console.log("Force update - setting fresh data:", freshData)
      setFormData(freshData)
      setIsFormReady(true)
    }
  }, [market])

  const cleanFormData = (data) => {
    // Define the valid database fields based on the schema
    const validFields = [
      'number', 'object', 'service', 'contract_type', 'procurement_method',
      'estimated_amount', 'budget_source', 'currency',
      'publication_date', 'submission_deadline', 'expected_start_date', 'expected_end_date',
      'attributaire', 'attributaire_address', 'attributaire_phone', 'attributaire_email',
      'technical_specifications', 'requirements', 'deliverables', 'notes', 'status'
    ]
    
    const cleaned = {}
    
    Object.entries(data).forEach(([key, value]) => {
      // Only include valid database fields
      if (validFields.includes(key)) {
        // Special handling for status - always include it
        if (key === 'status') {
          cleaned[key] = value
        }
        // For other fields, only include non-empty strings and valid values
        else if (value !== '' && value !== null && value !== undefined) {
          cleaned[key] = value
        }
      }
    })
    
    return cleaned
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      console.log("Edit form submission started")
      console.log("Original market:", market)
      console.log("Current form data:", formData)
      
      // Validate required fields
      if (!formData.number || !formData.object || !formData.service || !formData.contract_type || !formData.procurement_method) {
        toast.error("Veuillez remplir tous les champs obligatoires")
        return
      }

      // Clean up the data and remove fields that don't exist in the database
      const cleanedData = cleanFormData(formData)
      console.log("Cleaned data:", cleanedData)
      
      // Convert estimated_amount to number
      const marketData = {
        ...cleanedData,
        estimated_amount: cleanedData.estimated_amount ? parseFloat(cleanedData.estimated_amount) : null
      }

      console.log("Final market data to send:", marketData)
      console.log("Status value being sent:", marketData.status)
      
      const result = await updateMarket(market.id, marketData)
      
      console.log("updateMarket result:", result)
      
      if (result.success) {
        toast.success("Marché modifié avec succès!")
        onSuccess()
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err)
      console.error("Error details:", {
        message: err.message,
        stack: err.stack,
        name: err.name
      })
      
      const errorMessage = err.message || "Erreur lors de la modification du marché"
      toast.error(errorMessage)
    }
  }

  const handleInputChange = (field, value) => {
    console.log(`Updating ${field} to:`, value)
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSelectChange = (field, value) => {
    console.log(`Select updating ${field} to:`, value)
    console.log(`Previous formData:`, formData)
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      console.log(`New formData after update:`, newData)
      return newData
    })
  }

  if (!market) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun marché sélectionné pour modification</p>
      </div>
    )
  }

  if (!isFormReady) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-muted-foreground">Chargement des données du marché...</p>
        </div>
      </div>
    )
  }

  return (
    <form key={market?.id} onSubmit={handleSubmit} className="space-y-6">
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
                  <Label htmlFor="number">Numéro du Marché *</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => handleInputChange('number', e.target.value)}
                    placeholder="MP-2024-001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="service">Service Responsable *</Label>
                  <Select value={formData.service || "irrigation"} onValueChange={(value) => handleSelectChange('service', value)}>
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
                  <div className="text-xs text-gray-500 mt-1">
                    Current value: {formData.service || "undefined"}
                  </div>
                </div>
                <div>
                  <Label htmlFor="contract_type">Type de Contrat *</Label>
                  <Select value={formData.contract_type || "travaux"} onValueChange={(value) => handleSelectChange('contract_type', value)}>
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
                  <div className="text-xs text-gray-500 mt-1">
                    Current value: {formData.contract_type || "undefined"}
                  </div>
                </div>
                <div>
                  <Label htmlFor="procurement_method">Méthode de Passation *</Label>
                  <Select value={formData.procurement_method || "appel_offres"} onValueChange={(value) => handleSelectChange('procurement_method', value)}>
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
                <div>
                  <Label htmlFor="status">Statut du Marché</Label>
                  <Select 
                    value={formData.status || "draft"} 
                    onValueChange={(value) => {
                      console.log("Status Select onValueChange called with:", value)
                      console.log("Previous formData.status:", formData.status)
                      handleSelectChange('status', value)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="published">Publié</SelectItem>
                      <SelectItem value="in_progress">En cours</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-gray-500 mt-1">
                    Current value: {formData.status || "undefined"}
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="object">Objet du Marché *</Label>
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
                  <Label htmlFor="estimated_amount">Montant Estimé</Label>
                  <Input
                    id="estimated_amount"
                    type="number"
                    value={formData.estimated_amount}
                    onChange={(e) => handleInputChange('estimated_amount', e.target.value)}
                    placeholder="2500000"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Devise</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleSelectChange('currency', value)}>
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
                  <Label htmlFor="budget_source">Source du Budget</Label>
                  <Select value={formData.budget_source} onValueChange={(value) => handleSelectChange('budget_source', value)}>
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
                  <Label htmlFor="publication_date">Date de Publication</Label>
                  <Input
                    id="publication_date"
                    type="date"
                    value={formData.publication_date}
                    onChange={(e) => handleInputChange('publication_date', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="submission_deadline">Date Limite de Soumission</Label>
                  <Input
                    id="submission_deadline"
                    type="date"
                    value={formData.submission_deadline}
                    onChange={(e) => handleInputChange('submission_deadline', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="expected_start_date">Date de Début Prévue</Label>
                  <Input
                    id="expected_start_date"
                    type="date"
                    value={formData.expected_start_date}
                    onChange={(e) => handleInputChange('expected_start_date', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="expected_end_date">Date de Fin Prévue</Label>
                  <Input
                    id="expected_end_date"
                    type="date"
                    value={formData.expected_end_date}
                    onChange={(e) => handleInputChange('expected_end_date', e.target.value)}
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
                  />
                </div>
                <div>
                  <Label htmlFor="attributaire_email">Email</Label>
                  <Input
                    id="attributaire_email"
                    type="email"
                    value={formData.attributaire_email}
                    onChange={(e) => handleInputChange('attributaire_email', e.target.value)}
                    placeholder="contact@entreprise.ma"
                  />
                </div>
                <div>
                  <Label htmlFor="attributaire_phone">Téléphone</Label>
                  <Input
                    id="attributaire_phone"
                    value={formData.attributaire_phone}
                    onChange={(e) => handleInputChange('attributaire_phone', e.target.value)}
                    placeholder="+212 6 XX XX XX XX"
                  />
                </div>
                <div>
                  <Label htmlFor="attributaire_address">Adresse</Label>
                  <Input
                    id="attributaire_address"
                    value={formData.attributaire_address}
                    onChange={(e) => handleInputChange('attributaire_address', e.target.value)}
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
                <Label htmlFor="technical_specifications">Spécifications Techniques</Label>
                <Textarea
                  id="technical_specifications"
                  value={formData.technical_specifications}
                  onChange={(e) => handleInputChange('technical_specifications', e.target.value)}
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
              <CardDescription>Notes et observations additionnelles</CardDescription>
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Modification...
              </>
            ) : (
              "Modifier le Marché"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
} 