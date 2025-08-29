"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { Menu, FileText, BarChart3, Users, Settings, LogOut, Home, DollarSign, Building2 } from "lucide-react"
import { useAuth } from "../../lib/auth-context"


export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  const navigationItems = [
    { icon: Home, label: "Tableau de bord", href: "/dashboard" },
    { icon: Building2, label: "Marchés Publics", href: "/marches" },
    { icon: FileText, label: "Contrats", href: "/contrats" },
    { icon: DollarSign, label: "Finances", href: "/finances" },
    { icon: BarChart3, label: "Rapports", href: "/reports" },
    ...(user?.role === "admin"
      ? [
          { icon: Users, label: "Utilisateurs", href: "/users" },
          { icon: Settings, label: "Paramètres", href: "/settings" },
        ]
      : []),
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="text-xl font-bold text-sidebar-foreground">ORMVAO</h2>
        <p className="text-sm text-muted-foreground mt-1">Gestion des Contrats</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={() => router.push(item.href)}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="mb-4">
          <p className="text-sm font-medium text-sidebar-foreground">{user?.name || 'Utilisateur'}</p>
          <p className="text-xs text-muted-foreground capitalize">{user?.role || 'Utilisateur'}</p>
        </div>
        <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-lg font-semibold">ORMVAO</h1>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* Configuration Status for Mobile */}
      <div className="lg:hidden">

      </div>
    </>
  )
} 