"use client"

import { useAuth } from "../../lib/auth-context"
import { DashboardLayout } from "../../components/layout/dashboard-layout"
import { ProtectedRoute } from "../../components/auth/protected-route"
import { AgentDashboard } from "../../components/dashboard/agent-dashboard"
import { ManagerDashboard } from "../../components/dashboard/manager-dashboard"
import { AdminDashboard } from "../../components/dashboard/admin-dashboard"

export default function DashboardPage() {
  const { user } = useAuth()

  // Determine which dashboard to show based on user role
  const getDashboardComponent = () => {
    if (!user) return null
    
    switch (user.role) {
      case "admin":
        return <AdminDashboard />
      case "manager":
        return <ManagerDashboard />
      case "agent":
      default:
        return <AgentDashboard />
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {getDashboardComponent()}
      </DashboardLayout>
    </ProtectedRoute>
  )
} 