"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export function AddSettlementModal({ contractId, open, onOpenChange, userRole }) {
  const [formData, setFormData] = useState({
    number: "",
    amount: "",
    description: "",
    validationDate: "",
    status: "pending"
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // TODO: Implement settlement creation with Supabase
      console.log("Creating settlement for contract:", contractId, formData)
      
      // Reset form and close modal
      setFormData({
        number: "",
        amount: "",
        description: "",
        validationDate: "",
        status: "pending"
      })
      
      onOpenChange(false)
      
      // Show success message
      alert("Décompte ajouté avec succès!")
    } catch (error) {
      console.error("Error creating settlement:", error)
      alert("Erreur lors de l'ajout du décompte")
    }
  }

  const handleCancel = () => {
    setFormData({
      number: "",
      amount: "",
      description: "",
      validationDate: "",
      status: "pending"
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouveau Décompte</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau décompte financier pour ce contrat
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Numéro du décompte *</Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => handleInputChange("number", e.target.value)}
                placeholder="DEC-XXX"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (DH) *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="150000"
                min="0"
                step="1000"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Description détaillée des travaux ou services"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="validationDate">Date de validation</Label>
              <Input
                id="validationDate"
                type="date"
                value={formData.validationDate}
                onChange={(e) => handleInputChange("validationDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="validated">Validé</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter le décompte
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 