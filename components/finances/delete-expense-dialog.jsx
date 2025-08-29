"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { AlertTriangle, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useFinances } from "../../lib/hooks/use-finances"

export function DeleteExpenseDialog({ open, onOpenChange, expense, onSuccess }) {
  const { deleteExpense } = useFinances()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!expense) return

    setLoading(true)

    try {
      await deleteExpense(expense.id)
      
      toast.success("Dépense supprimée avec succès")
      
      // Close dialog and refresh
      onOpenChange(false)
      if (onSuccess) onSuccess()
      
    } catch (error) {
      console.error('Error deleting expense:', error)
      toast.error("Erreur lors de la suppression de la dépense")
    } finally {
      setLoading(false)
    }
  }

  if (!expense) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmer la suppression
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Expense details */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Détails de la dépense</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Description:</span>
                <span className="font-medium">{expense.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Montant:</span>
                <span className="font-medium text-red-600">
                  {expense.amount?.toLocaleString('fr-FR')} DH
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Catégorie:</span>
                <span className="font-medium capitalize">{expense.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Statut:</span>
                <span className="font-medium">{expense.status}</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Attention : Cette action ne peut pas être annulée
              </span>
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
              type="button" 
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Suppression en cours...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 