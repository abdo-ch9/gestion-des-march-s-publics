"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/auth-context'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { ClientOnly } from '../ui/client-only'
import { Button } from '../ui/button'

export function ProtectedRoute({ children }) {
  const { user, loading, isConfigured, authError } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user && isConfigured) {
      router.push('/')
    }
  }, [user, loading, isConfigured, router])

  // Show loading state
  if (loading) {
    return (
      <ClientOnly fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      }>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement...</p>
            {authError && (
              <div className="mt-4 max-w-md mx-auto">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Erreur d'authentification: {authError}
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
              </div>
            )}
          </div>
        </div>
      </ClientOnly>
    )
  }

  // Show configuration error
  if (!isConfigured) {
    return (
      <ClientOnly fallback={
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-8 h-8 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Configuration...</p>
          </div>
        </div>
      }>
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
            
            <div className="mt-6 p-4 bg-muted rounded-lg text-left text-sm">
              <p className="font-medium mb-2">Variables d'environnement requises:</p>
              <code className="block bg-background p-2 rounded text-xs">
                NEXT_PUBLIC_SUPABASE_URL=your_project_url<br/>
                NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
              </code>
            </div>
          </div>
        </div>
      </ClientOnly>
    )
  }

  // Show authentication error
  if (authError && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Erreur d'authentification: {authError}
            </AlertDescription>
          </Alert>
          
          <div className="mt-4 space-y-2">
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
            <Button onClick={() => router.push('/')} variant="ghost">
              Retour à la connexion
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // No user, redirect to login
  if (!user) {
    return null
  }

  return <>{children}</>
} 