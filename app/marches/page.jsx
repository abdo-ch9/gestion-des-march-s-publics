"use client"

import { useAuth } from "../../lib/auth-context"
import { DashboardLayout } from "../../components/layout/dashboard-layout"
import { ProtectedRoute } from "../../components/auth/protected-route"
import { PublicMarketsDashboard } from "../../components/marches/public-markets-dashboard"

export default function MarchesPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PublicMarketsDashboard user={user} />
      </DashboardLayout>
    </ProtectedRoute>
  )
} 