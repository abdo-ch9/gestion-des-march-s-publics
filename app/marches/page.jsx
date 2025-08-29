"use client"

import { useAuth } from "../../lib/auth-context"
import { DashboardLayout } from "../../components/layout/dashboard-layout"
import { ProtectedRoute } from "../../components/auth/protected-route"
import { PublicMarketsDashboard } from "../../components/marches/public-markets-dashboard"
import { HydrationSafe } from "../../components/ui/hydration-safe"

export default function MarchesPage() {
  const { user } = useAuth()

  return (
    <HydrationSafe fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    }>
      <ProtectedRoute>
        <DashboardLayout>
          <PublicMarketsDashboard user={user} />
        </DashboardLayout>
      </ProtectedRoute>
    </HydrationSafe>
  )
} 