"use client"

import { useAuth } from "../../lib/auth-context"
import { DashboardLayout } from "../../components/layout/dashboard-layout"
import { ProtectedRoute } from "../../components/auth/protected-route"
import { SystemSettings } from "../../components/admin/system-settings"

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <SystemSettings user={user} />
      </DashboardLayout>
    </ProtectedRoute>
  )
} 