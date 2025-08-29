"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Calendar, DollarSign, FileText, Building, User, MapPin, Loader2 } from "lucide-react"
import { useMarkets } from "../../lib/hooks/use-markets"
import { useAuth } from "../../lib/auth-context"
import { toast } from "sonner"

export function AddMarketForm({ onSuccess }) {
  const { user } = useAuth()
  const { addMarket, loading, error } = useMarkets()
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState({
    // Basic Information
    number: "",
    object: "",
    service: "",
    contract_type: "",
    procurement_method: "",
    status: "draft", // Add status field
    
    // Financial Information
    estimated_amount: "",
    budget_source: "",
    currency: "MAD",
    
    // Dates and Deadlines
    publication_date: "",
    submission_deadline: "",
    expected_start_date: "",
    expected_end_date: "",
    
    // Contractor Information
    attributaire: "",
    attributaire_address: "",
    attributaire_phone: "",
    attributaire_email: "",
    
    // Technical Details
    technical_specifications: "",
    requirements: "",
    deliverables: "",
    
    // Additional Information
    notes: ""
  })

  const cleanFormData = (data) => {
    // Define the valid database fields based on the schema
    const validFields = [
      'number', 'object', 'service', 'contract_type', 'procurement_method', 'status',
      'estimated_amount', 'budget_source', 'currency',
      'publication_date', 'submission_deadline', 'expected_start_date', 'expected_end_date',
      'attributaire', 'attributaire_address', 'attributaire_phone', 'attributaire_email',
      'technical_specifications', 'requirements', 'deliverables', 'notes'
    ]
    
    const cleaned = {}
    
    Object.entries(data).forEach(([key, value]) => {
      // Only include valid database fields
      if (validFields.includes(key)) {
        // Only include non-empty strings and valid values
        if (value !== '' && value !== null && value !== undefined) {
          cleaned[key] = value
        }
      }
    })
    
    return cleaned
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error("Vous devez être connecté pour créer un marché")
      return
    }

    try {
      // Validate required fields
      if (!formData.number || !formData.object || !formData.service || !formData.contract_type || !formData.procurement_method) {
        toast.error("Veuillez remplir tous les champs obligatoires")
        return
      }

      // Clean up the data and remove fields that don't exist in the database
      const cleanedData = cleanFormData(formData)
      
      // Convert estimated_amount to number
      const marketData = {
        ...cleanedData,
        estimated_amount: cleanedData.estimated_amount ? parseFloat(cleanedData.estimated_amount) : null
      }

      // Add timeout protection to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La création du marché prend trop de temps')), 30000)
      })

      const addMarketPromise = addMarket(marketData)
      
      const result = await Promise.race([addMarketPromise, timeoutPromise])
      
      if (result.success) {
        toast.success("Marché créé avec succès!")
        onSuccess()
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err)
      
      let errorMessage = "Erreur lors de la création du marché"
      
      if (err.message.includes('Timeout')) {
        errorMessage = "La création du marché prend trop de temps. Vérifiez votre connexion à la base de données."
      } else if (err.message.includes('Table markets does not exist')) {
        errorMessage = "La table des marchés n'existe pas. Veuillez exécuter le script SQL de configuration."
      } else if (err.message.includes('Client Supabase non configuré')) {
        errorMessage = "Erreur de configuration Supabase. Vérifiez vos variables d'environnement."
      } else {
        errorMessage = err.message || errorMessage
      }
      
      toast.error(errorMessage)
    }
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
                  <Label htmlFor="number">Numéro du Marché *</Label>
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
                  <Label htmlFor="service">Service Responsable *</Label>
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
                  <Label htmlFor="contract_type">Type de Contrat *</Label>
                  <Select value={formData.contract_type} onValueChange={(value) => handleInputChange('contract_type', value)}>
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
                  <Label htmlFor="procurement_method">Méthode de Passation *</Label>
                  <Select value={formData.procurement_method} onValueChange={(value) => handleInputChange('procurement_method', value)}>
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
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
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
                  <Label htmlFor="budget_source">Source du Budget</Label>
                  <Select value={formData.budget_source} onValueChange={(value) => handleInputChange('budget_source', value)}>
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
          <Button type="button" variant="outline" onClick={onSuccess}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              "Créer le Marché"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
} 