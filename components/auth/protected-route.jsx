"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/auth-context'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { AlertTriangle } from 'lucide-react'

export function ProtectedRoute({ children }) {
  const { user, loading, isConfigured } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user && isConfigured) {
      router.push('/')
    }
  }, [user, loading, isConfigured, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Supabase n'est pas configuré. Veuillez configurer vos variables d'environnement pour accéder à cette page.
            </AlertDescription>
          </Alert>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Retournez à la <a href="/" className="text-primary hover:underline">page de connexion</a> pour configurer Supabase.</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
} 