import { LoginForm } from "../components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">ORMVAO</h1>
          <p className="text-muted-foreground">Office Régional de Mise en Valeur Agricole de Ouarzazate</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Connectez-vous à votre compte pour accéder au système de gestion des contrats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 