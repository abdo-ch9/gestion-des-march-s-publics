"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export function AddDeadlineModal({ contractId, open, onOpenChange, userRole }) {
  const [formData, setFormData] = useState({
    type: "extension",
    startDate: "",
    endDate: "",
    reason: "",
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
      // TODO: Implement deadline creation with Supabase
      console.log("Creating deadline for contract:", contractId, formData)
      
      // Reset form and close modal
      setFormData({
        type: "extension",
        startDate: "",
        endDate: "",
        reason: "",
        status: "pending"
      })
      
      onOpenChange(false)
      
      // Show success message
      alert("Délai ajouté avec succès!")
    } catch (error) {
      console.error("Error creating deadline:", error)
      alert("Erreur lors de l'ajout du délai")
    }
  }

  const handleCancel = () => {
    setFormData({
      type: "extension",
      startDate: "",
      endDate: "",
      reason: "",
      status: "pending"
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouveau Délai</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau délai ou une prolongation pour ce contrat
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type de délai *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="initial">Délai initial</SelectItem>
                  <SelectItem value="extension">Prolongation</SelectItem>
                  <SelectItem value="suspension">Suspension</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="expired">Expiré</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motif</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              placeholder="Raison de la prolongation ou suspension"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter le délai
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 