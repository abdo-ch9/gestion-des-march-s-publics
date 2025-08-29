"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, Copy, Download } from "lucide-react"

export function ExpenseActionsMenu({ expense, onEdit, onDelete, onView, userRole }) {
  const [open, setOpen] = useState(false)

  const handleAction = (action) => {
    setOpen(false)
    switch (action) {
      case 'edit':
        if (onEdit) onEdit(expense)
        break
      case 'delete':
        if (onDelete) onDelete(expense)
        break
      case 'view':
        if (onView) onView(expense)
        break
      case 'copy':
        // Copy expense details to clipboard
        const expenseText = `Dépense: ${expense.description}\nMontant: ${expense.amount} DH\nCatégorie: ${expense.category}\nStatut: ${expense.status}`
        navigator.clipboard.writeText(expenseText)
        break
      case 'download':
        // Generate and download expense report
        const blob = new Blob([expenseText], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `depense-${expense.id}.txt`
        a.click()
        window.URL.revokeObjectURL(url)
        break
    }
  }

  const canEdit = userRole === "admin" || userRole === "manager"
  const canDelete = userRole === "admin" || userRole === "manager"

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Ouvrir le menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleAction('view')}>
          <Eye className="mr-2 h-4 w-4" />
          Voir les détails
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleAction('copy')}>
          <Copy className="mr-2 h-4 w-4" />
          Copier les détails
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleAction('download')}>
          <Download className="mr-2 h-4 w-4" />
          Télécharger
        </DropdownMenuItem>

        {canEdit && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleAction('edit')}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
          </>
        )}

        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleAction('delete')}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 