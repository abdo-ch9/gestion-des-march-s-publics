"use client"

import { useState, useCallback, useMemo } from "react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Check, X, Clock, AlertCircle, DollarSign } from "lucide-react"
import { toast } from "sonner"

const paymentStatuses = [
  { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  { value: 'partial', label: 'Partiel', color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
  { value: 'paid', label: 'Payé', color: 'bg-green-100 text-green-800', icon: Check },
  { value: 'overdue', label: 'En retard', color: 'bg-red-100 text-red-800', icon: X },
  { value: 'cancelled', label: 'Annulé', color: 'bg-gray-100 text-gray-800', icon: X }
]

export function ContractPaymentStatus({ 
  contract, 
  currentStatus, 
  onStatusChange, 
  userRole 
}) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(currentStatus || 'pending')
  const [partialAmount, setPartialAmount] = useState('')
  const [showPartialInput, setShowPartialInput] = useState(false)

  // Memoize status info to avoid recalculation
  const currentStatusInfo = useMemo(() => 
    paymentStatuses.find(s => s.value === currentStatus) || paymentStatuses[0], 
    [currentStatus]
  )

  // Optimize status change handler
  const handleStatusChange = useCallback(async (newStatus) => {
    if (!userRole || (userRole !== 'admin' && userRole !== 'manager')) {
      toast.error("Vous n'avez pas les permissions pour modifier le statut de paiement")
      return
    }

    if (newStatus === currentStatus) return

    // If changing to partial, show input field
    if (newStatus === 'partial') {
      setShowPartialInput(true)
      setSelectedStatus(newStatus)
      return
    }

    // If changing from partial to another status, hide input
    if (currentStatus === 'partial' && newStatus !== 'partial') {
      setShowPartialInput(false)
      setPartialAmount('')
    }

    setIsUpdating(true)
    try {
      let updateData = { payment_status: newStatus }
      
      // If status is partial, include the partial amount
      if (newStatus === 'partial' && partialAmount) {
        updateData.partial_amount = parseFloat(partialAmount)
        updateData.remaining_amount = contract.totalValue - parseFloat(partialAmount)
      }
      
      // If status is paid, set remaining amount to 0
      if (newStatus === 'paid') {
        updateData.remaining_amount = 0
        updateData.partial_amount = contract.totalValue
      }

      await onStatusChange(contract.id, newStatus, updateData)
      setSelectedStatus(newStatus)
      toast.success(`Statut de paiement mis à jour vers "${paymentStatuses.find(s => s.value === newStatus)?.label}"`)
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut de paiement")
      setSelectedStatus(currentStatus || 'pending')
    } finally {
      setIsUpdating(false)
    }
  }, [userRole, currentStatus, partialAmount, contract.totalValue, contract.id, onStatusChange])

  // Optimize partial submit handler
  const handlePartialSubmit = useCallback(async () => {
    if (!partialAmount || parseFloat(partialAmount) <= 0) {
      toast.error("Veuillez saisir un montant valide")
      return
    }

    if (parseFloat(partialAmount) >= contract.totalValue) {
      toast.error("Le montant partiel ne peut pas être supérieur ou égal au montant total")
      return
    }

    setIsUpdating(true)
    try {
      const updateData = {
        payment_status: 'partial',
        partial_amount: parseFloat(partialAmount),
        remaining_amount: contract.totalValue - parseFloat(partialAmount)
      }

      await onStatusChange(contract.id, 'partial', updateData)
      setSelectedStatus('partial')
      setShowPartialInput(false)
      toast.success(`Paiement partiel enregistré: ${partialAmount} DH`)
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut de paiement")
      setSelectedStatus(currentStatus || 'pending')
    } finally {
      setIsUpdating(false)
    }
  }, [partialAmount, contract.totalValue, contract.id, onStatusChange, currentStatus])

  // Optimize cancel handler
  const handleCancel = useCallback(() => {
    setShowPartialInput(false)
    setPartialAmount('')
    setSelectedStatus(currentStatus || 'pending')
  }, [currentStatus])

  // Memoize icon component
  const IconComponent = useMemo(() => currentStatusInfo.icon, [currentStatusInfo.icon])

  if (!userRole || (userRole !== 'admin' && userRole !== 'manager')) {
    return (
      <div className="flex items-center gap-2">
        <Badge className={currentStatusInfo.color}>
          <IconComponent className="w-3 h-3 mr-1" />
          {currentStatusInfo.label}
        </Badge>
        {currentStatus === 'partial' && contract.partial_amount && (
          <span className="text-xs text-muted-foreground">
            ({contract.partial_amount} DH / {contract.totalValue} DH)
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Select 
        value={selectedStatus} 
        onValueChange={handleStatusChange}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-32 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {paymentStatuses.map((status) => {
            const StatusIcon = status.icon
            return (
              <SelectItem key={status.value} value={status.value}>
                <div className="flex items-center gap-2">
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
      
      {/* Partial Amount Input */}
      {showPartialInput && (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Montant"
            value={partialAmount}
            onChange={(e) => setPartialAmount(e.target.value)}
            className="w-20 h-8 text-xs"
            min="0"
            max={contract.totalValue}
            step="0.01"
          />
          <span className="text-xs text-muted-foreground">DH</span>
          <Button 
            size="sm" 
            onClick={handlePartialSubmit}
            disabled={!partialAmount || isUpdating}
            className="h-8 px-2"
          >
            <Check className="w-3 h-3" />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleCancel}
            className="h-8 px-2"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Display partial amount if status is partial */}
      {currentStatus === 'partial' && contract.partial_amount && !showPartialInput && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <DollarSign className="w-3 h-3" />
          {contract.partial_amount} / {contract.totalValue}
        </div>
      )}
      
      {isUpdating && (
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  )
} 