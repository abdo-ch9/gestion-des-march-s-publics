"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { CalendarIcon, Download, FileText, Filter, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export function ReportGeneratorModal({ isOpen, onClose, onGenerateReport, onExportReport, loading }) {
  const [reportType, setReportType] = useState('summary')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [status, setStatus] = useState('all')
  const [service, setService] = useState('all')
  const [exportFormat, setExportFormat] = useState('json')

  const reportTypes = [
    { value: 'summary', label: 'Résumé Général' },
    { value: 'contracts', label: 'Rapport des Contrats' },
    { value: 'markets', label: 'Rapport des Marchés' },
    { value: 'financial', label: 'Rapport Financier' },
    { value: 'performance', label: 'Rapport de Performance' }
  ]

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'draft', label: 'Brouillon' },
    { value: 'pending', label: 'En attente' },
    { value: 'active', label: 'Actif' },
    { value: 'completed', label: 'Terminé' },
    { value: 'cancelled', label: 'Annulé' }
  ]

  const serviceOptions = [
    { value: 'all', label: 'Tous les services' },
    { value: 'construction', label: 'Construction' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'consulting', label: 'Consultation' },
    { value: 'supplies', label: 'Fournitures' },
    { value: 'other', label: 'Autre' }
  ]

  const exportFormats = [
    { value: 'json', label: 'JSON' },
    { value: 'csv', label: 'CSV' }
  ]

  const handleGenerateReport = () => {
    const filters = {
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null,
      status: status === 'all' ? null : status,
      service: service === 'all' ? null : service
    }

    onGenerateReport(reportType, filters)
  }

  const handleExportReport = () => {
    const filters = {
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null,
      status: status === 'all' ? null : status,
      service: service === 'all' ? null : service
    }

    onExportReport(reportType, filters, exportFormat)
  }

  const handleReset = () => {
    setReportType('summary')
    setStartDate(null)
    setEndDate(null)
    setStatus('all')
    setService('all')
    setExportFormat('json')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Générateur de Rapports
          </DialogTitle>
          <DialogDescription>
            Créez des rapports personnalisés selon vos besoins et exportez-les dans différents formats.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Report Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="reportType">Type de Rapport</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type de rapport" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP', { locale: fr }) : 'Sélectionner une date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Date de fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP', { locale: fr }) : 'Sélectionner une date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {serviceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Export Format */}
          <div className="space-y-2">
            <Label htmlFor="exportFormat">Format d'export</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le format" />
              </SelectTrigger>
              <SelectContent>
                {exportFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExportReport}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          
          <Button
            onClick={handleGenerateReport}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <FileText className="w-4 h-4 mr-2" />
            {loading ? 'Génération...' : 'Générer le Rapport'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 