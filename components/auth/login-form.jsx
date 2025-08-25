"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Loader2, Mail, Lock, AlertTriangle } from "lucide-react"
import { useAuth } from "../../lib/auth-context"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { signIn, isConfigured } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        setError(error.message || "Erreur de connexion. Veuillez vérifier vos identifiants.")
      } else {
        // Redirect to dashboard on successful login
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Erreur de connexion. Veuillez vérifier vos identifiants.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConfigured) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Supabase n'est pas configuré. Veuillez configurer vos variables d'environnement pour activer l'authentification.
          </AlertDescription>
        </Alert>
        
        <div className="text-sm text-muted-foreground text-center space-y-2">
          <p>Pour configurer Supabase :</p>
          <ol className="list-decimal list-inside space-y-1 text-left">
            <li>Créez un projet sur <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">supabase.com</a></li>
            <li>Créez un fichier <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> avec vos clés</li>
            <li>Redémarrez le serveur de développement</li>
          </ol>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="votre.email@ormvao.ma"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Se connecter
      </Button>

      <div className="text-sm text-muted-foreground text-center">
        <p>Comptes de test:</p>
        <p>agent@ormvao.ma • manager@ormvao.ma • admin@ormvao.ma</p>
        <p>Mot de passe: password</p>
        <p className="mt-2 text-xs">Note: Créez d'abord ces comptes dans votre base de données Supabase</p>
      </div>
    </form>
  )
} 