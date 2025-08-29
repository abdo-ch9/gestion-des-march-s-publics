"use client"

import { useAuth } from "../../lib/auth-context"
import { DashboardLayout } from "../../components/layout/dashboard-layout"
import { ProtectedRoute } from "../../components/auth/protected-route"
import { EnhancedAdminDashboard } from "../../components/admin/enhanced-admin-dashboard"

export default function AdminPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <EnhancedAdminDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  )
} 