"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AgentDashboard } from "@/components/dashboard/agent-dashboard"
import { ManagerDashboard } from "@/components/dashboard/manager-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

interface User {
  email: string
  role: "agent" | "manager" | "admin"
  name: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (err) {
      router.push("/")
      return
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const renderDashboard = () => {
    switch (user.role) {
      case "agent":
        return <AgentDashboard user={user} />
      case "manager":
        return <ManagerDashboard user={user} />
      case "admin":
        return <AdminDashboard user={user} />
      default:
        return <AgentDashboard user={user} />
    }
  }

  return <DashboardLayout user={user}>{renderDashboard()}</DashboardLayout>
}
