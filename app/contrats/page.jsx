"use client"

import { DashboardLayout } from "../../components/layout/dashboard-layout"
import { ContractsDashboard } from "../../components/contrats/contracts-dashboard"
import { ProtectedRoute } from "../../components/auth/protected-route"

export default function ContratsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ContractsDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  )
} 