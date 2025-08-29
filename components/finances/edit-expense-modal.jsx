"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Calendar, DollarSign, Package, User, Briefcase, MoreHorizontal, Edit } from "lucide-react"
import { toast } from "sonner"
import { useFinances } from "../../lib/hooks/use-finances"

const expenseCategories = [
  { value: 'materiaux', label: 'Matériaux', icon: Package, color: '#3b82f6' },
  { value: 'maintenance', label: 'Maintenance', icon: Package, color: '#10b981' },
  { value: 'personnel', label: 'Personnel', icon: User, color: '#f59e0b' },
  { value: 'services', label: 'Services', icon: Briefcase, color: '#8b5cf6' },
  { value: 'autres', label: 'Autres', icon: MoreHorizontal, color: '#6b7280' }
]

const paymentMethods = [
  { value: 'virement', label: 'Virement bancaire' },
  { value: 'cheque', label: 'Chèque' },
  { value: 'especes', label: 'Espèces' },
  { value: 'carte', label: 'Carte bancaire' },
  { value: 'prelevement', label: 'Prélèvement automatique' }
]

const expenseStatuses = [
  { value: 'pending', label: 'En attente' },
  { value: 'approved', label: 'Approuvé' },
  { value: 'paid', label: 'Payé' },
  { value: 'cancelled', label: 'Annulé' }
]

export function EditExpenseModal({ open, onOpenChange, expense, onSuccess, userRole }) {
  const { updateExpense } = useFinances()
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'materiaux',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    payment_method: 'virement',
    supplier: '',
    invoice_number: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)

  // Update form data when expense prop changes
  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description || '',
        amount: expense.amount?.toString() || '',
        category: expense.category || 'materiaux',
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: expense.status || 'pending',
        payment_method: expense.paymentMethod || 'virement',
        supplier: expense.supplier || '',
        invoice_number: expense.invoice_number || '',
        notes: expense.notes || ''
      })
    }
  }, [expense])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.description || !formData.amount) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (parseFloat(formData.amount) <= 0) {
      toast.error("Le montant doit être supérieur à 0")
      return
    }

    setLoading(true)

    try {
      await updateExpense(expense.id, formData)
      
      toast.success("Dépense mise à jour avec succès")
      
      // Close modal and refresh
      onOpenChange(false)
      if (onSuccess) onSuccess()
      
    } catch (error) {
      console.error('Error updating expense:', error)
      toast.error("Erreur lors de la mise à jour de la dépense")
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category) => {
    const found = expenseCategories.find(c => c.value === category)
    return found ? found.icon : MoreHorizontal
  }

  const getCategoryColor = (category) => {
    const found = expenseCategories.find(c => c.value === category)
    return found ? found.color : '#6b7280'
  }

  if (!expense) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-600" />
            Modifier la Dépense
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations de la dépense sélectionnée
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="Description de la dépense"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Montant (DH) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Catégorie et statut */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" style={{ color: category.color }} />
                          {category.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {expenseStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date et méthode de paiement */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date de la dépense</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_method">Méthode de paiement</Label>
              <Select value={formData.payment_method} onValueChange={(value) => handleInputChange('payment_method', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fournisseur et numéro de facture */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="supplier">Fournisseur</Label>
              <Input
                id="supplier"
                placeholder="Nom du fournisseur"
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice_number">Numéro de facture</Label>
              <Input
                id="invoice_number"
                placeholder="Numéro de facture"
                value={formData.invoice_number}
                onChange={(e) => handleInputChange('invoice_number', e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Notes supplémentaires..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          {/* Aperçu de la dépense */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Aperçu de la dépense</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Description:</span>
                <span className="font-medium">{formData.description || 'Non spécifiée'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Montant:</span>
                <span className="font-medium text-red-600">
                  {formData.amount ? `${parseFloat(formData.amount).toLocaleString('fr-FR')} DH` : '0 DH'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Catégorie:</span>
                <div className="flex items-center gap-2">
                  {(() => {
                    const IconComponent = getCategoryIcon(formData.category)
                    return (
                      <>
                        <IconComponent 
                          className="h-4 w-4" 
                          style={{ color: getCategoryColor(formData.category) }} 
                        />
                        <span className="font-medium capitalize">
                          {expenseCategories.find(c => c.value === formData.category)?.label || 'Autre'}
                        </span>
                      </>
                    )
                  })()}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Statut:</span>
                <span className="font-medium">
                  {expenseStatuses.find(s => s.value === formData.status)?.label || 'En attente'}
                </span>
              </div>
              {formData.supplier && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fournisseur:</span>
                  <span className="font-medium">{formData.supplier}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Mise à jour en cours...
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Mettre à Jour
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 