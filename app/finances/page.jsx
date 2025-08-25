"use client"

import { useAuth } from "../../lib/auth-context"
import { DashboardLayout } from "../../components/layout/dashboard-layout"
import { ProtectedRoute } from "../../components/auth/protected-route"
import { FinancialDashboard } from "../../components/finances/financial-dashboard"

export default function FinancesPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <FinancialDashboard user={user} />
      </DashboardLayout>
    </ProtectedRoute>
  )
} 