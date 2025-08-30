"use client"

import { useAuth } from "../../lib/auth-context"
import { DashboardLayout } from "../../components/layout/dashboard-layout"
import { ProtectedRoute } from "../../components/auth/protected-route"
import { AdminDashboard } from "../../components/dashboard/admin-dashboard"

export default function AdminPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <AdminDashboard user={user} />
      </DashboardLayout>
    </ProtectedRoute>
  )
} 