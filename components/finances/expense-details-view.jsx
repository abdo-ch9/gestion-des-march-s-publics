"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { 
  DollarSign, Calendar, Package, User, Briefcase, 
  MoreHorizontal, Building2, FileText, MessageSquare, Edit, Trash2 
} from "lucide-react"

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
  { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'approved', label: 'Approuvé', color: 'bg-blue-100 text-blue-800' },
  { value: 'paid', label: 'Payé', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Annulé', color: 'bg-red-100 text-red-800' }
]

export function ExpenseDetailsView({ open, onOpenChange, expense, onEdit, onDelete, userRole }) {
  if (!expense) return null

  const getCategoryInfo = (category) => {
    return expenseCategories.find(c => c.value === category) || expenseCategories[4]
  }

  const getPaymentMethodInfo = (method) => {
    return paymentMethods.find(m => m.value === method) || paymentMethods[0]
  }

  const getStatusInfo = (status) => {
    return expenseStatuses.find(s => s.value === status) || expenseStatuses[0]
  }

  const categoryInfo = getCategoryInfo(expense.category)
  const paymentMethodInfo = getPaymentMethodInfo(expense.paymentMethod)
  const statusInfo = getStatusInfo(expense.status)

  const canEdit = userRole === "admin" || userRole === "manager"
  const canDelete = userRole === "admin" || userRole === "manager"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-red-600" />
            Détails de la Dépense
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur la dépense sélectionnée
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${categoryInfo.color}20` }}
              >
                <categoryInfo.icon 
                  className="h-6 w-6" 
                  style={{ color: categoryInfo.color }} 
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{expense.description}</h3>
                <p className="text-sm text-muted-foreground">
                  ID: {expense.id}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {canEdit && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(expense)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              )}
              {canDelete && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onDelete(expense)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              )}
            </div>
          </div>

          {/* Amount and Status */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-red-600" />
                <span className="font-medium text-gray-700">Montant</span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {expense.amount?.toLocaleString('fr-FR')} DH
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="font-medium text-gray-700">Statut</span>
              </div>
              <Badge className={statusInfo.color}>
                {statusInfo.label}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Informations de base</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="h-4 w-4" />
                  Catégorie
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryInfo.color }}
                  ></div>
                  <span className="font-medium capitalize">{categoryInfo.label}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Date
                </div>
                <span className="font-medium">
                  {expense.date ? new Date(expense.date).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4" />
                  Fournisseur
                </div>
                <span className="font-medium">
                  {expense.supplier || 'Non spécifié'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  Méthode de paiement
                </div>
                <span className="font-medium">{paymentMethodInfo.label}</span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(expense.invoice_number || expense.notes) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Informations supplémentaires</h4>
                
                {expense.invoice_number && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      Numéro de facture
                    </div>
                    <span className="font-medium">{expense.invoice_number}</span>
                  </div>
                )}

                {expense.notes && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MessageSquare className="h-4 w-4" />
                      Notes
                    </div>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg">
                      {expense.notes}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Metadata */}
          <Separator />
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Métadonnées</h4>
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div className="space-y-2">
                <div className="text-gray-600">Créé le</div>
                <div className="font-medium">
                  {expense.created_at ? new Date(expense.created_at).toLocaleString('fr-FR') : 'Non spécifié'}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-gray-600">Modifié le</div>
                <div className="font-medium">
                  {expense.updated_at ? new Date(expense.updated_at).toLocaleString('fr-FR') : 'Non spécifié'}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 