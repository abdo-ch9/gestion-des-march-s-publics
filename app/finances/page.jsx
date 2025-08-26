"use client"

import { useAuth } from "../../lib/auth-context"
import { DashboardLayout } from "../../components/layout/dashboard-layout"
import { ProtectedRoute } from "../../components/auth/protected-route"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import { useState, useEffect } from "react"

// Dynamically import the FinancialDashboard to prevent SSR issues
const FinancialDashboard = dynamic(
  () => import("../../components/finances/financial-dashboard").then(mod => ({ default: mod.FinancialDashboard })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
)

// Client-only wrapper to prevent hydration issues
function ClientOnly({ children, fallback = null }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return fallback
  }

  return children
}

export default function FinancesPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ClientOnly fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }>
            <FinancialDashboard user={user} />
          </Suspense>
        </ClientOnly>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 