"use client"

import { ProtectedRoute } from "../../components/auth/protected-route"
import { DashboardLayout } from "../../components/layout/dashboard-layout"
import { FinancialDashboard } from "../../components/finances/financial-dashboard"

export default function FinancesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <FinancialDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  )
} 