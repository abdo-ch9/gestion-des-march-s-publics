"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { useMarkets } from "../../lib/hooks/use-markets"
import { useAuth } from "../../lib/auth-context"
import { createClient } from "../../lib/supabase"

export function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { testConnection, markets, loading, error } = useMarkets()

  const testInsert = async () => {
    if (!user) {
      alert('Vous devez être connecté pour tester l\'insertion')
      return
    }
    
    try {
      const testData = {
        number: 'TEST-2024-001',
        object: 'Test de création de marché',
        service: 'test',
        contract_type: 'test',
        procurement_method: 'test',
        created_by: user.id,
        status: 'draft'
      }
      
      console.log('Testing insert with data:', testData)
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('markets')
        .insert([testData])
        .select()
        .single()
      
      if (error) {
        console.error('Test insert failed:', error)
        alert(`Test d'insertion échoué: ${error.message}`)
      } else {
        console.log('Test insert successful:', data)
        alert('Test d\'insertion réussi! Le marché a été créé.')
        
        // Clean up the test data
        await supabase.from('markets').delete().eq('id', data.id)
        console.log('Test data cleaned up')
      }
    } catch (err) {
      console.error('Test insert error:', err)
      alert(`Erreur lors du test d'insertion: ${err.message}`)
    }
  }

  const runDebugTests = async () => {
    setIsLoading(true)
    const info = {}

    try {
      // Test 1: Environment variables
      info.envVars = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'
      }

      // Test 2: Supabase client creation
      const supabase = createClient()
      info.supabaseClient = supabase ? '✅ Created' : '❌ Failed to create'

      // Test 3: User authentication
      info.userAuth = {
        isAuthenticated: !!user,
        userId: user?.id || 'Not authenticated',
        userEmail: user?.email || 'Not authenticated'
      }

      // Test 4: Table connection
      if (supabase) {
        try {
          await testConnection()
          info.tableConnection = '✅ Markets table accessible'
          
          // Test 5: Table structure
          try {
            const { data: columns, error: columnsError } = await supabase
              .from('markets')
              .select('*')
              .limit(0)
            
            if (columnsError) {
              info.tableStructure = `❌ Error getting table structure: ${columnsError.message}`
            } else {
              info.tableStructure = '✅ Table structure accessible'
            }
          } catch (err) {
            info.tableStructure = `❌ Table structure test failed: ${err.message}`
          }
          
        } catch (err) {
          info.tableConnection = `❌ ${err.message}`
        }
      } else {
        info.tableConnection = '❌ Cannot test - no Supabase client'
      }

      // Test 6: Current state
      info.currentState = {
        marketsCount: markets.length,
        isLoading: loading,
        hasError: !!error,
        errorMessage: error || 'None'
      }

    } catch (err) {
      info.generalError = err.message
    }

    setDebugInfo(info)
    setIsLoading(false)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🐛 Panel de Débogage
        </CardTitle>
        <CardDescription>
          Testez la connexion Supabase et diagnostiquez les problèmes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runDebugTests} 
          disabled={isLoading}
          variant="outline"
        >
          {isLoading ? 'Tests en cours...' : 'Lancer les Tests de Diagnostic'}
        </Button>

        <Button 
          onClick={testInsert} 
          disabled={!user}
          variant="outline"
          className="ml-2"
        >
          Tester l'Insertion
        </Button>

        {Object.keys(debugInfo).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Résultats des Tests :</h4>
            
            {debugInfo.envVars && (
              <div>
                <h5 className="text-sm font-medium mb-2">Variables d'Environnement :</h5>
                <div className="space-y-1">
                  {Object.entries(debugInfo.envVars).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Badge variant={value.includes('✅') ? 'default' : 'destructive'}>
                        {value}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {debugInfo.supabaseClient && (
              <div>
                <h5 className="text-sm font-medium mb-2">Client Supabase :</h5>
                <Badge variant={debugInfo.supabaseClient.includes('✅') ? 'default' : 'destructive'}>
                  {debugInfo.supabaseClient}
                </Badge>
              </div>
            )}

            {debugInfo.userAuth && (
              <div>
                <h5 className="text-sm font-medium mb-2">Authentification Utilisateur :</h5>
                <div className="space-y-1 text-sm">
                  <div>Statut: {debugInfo.userAuth.isAuthenticated ? '✅ Connecté' : '❌ Non connecté'}</div>
                  <div>ID: {debugInfo.userAuth.userId}</div>
                  <div>Email: {debugInfo.userAuth.userEmail}</div>
                </div>
              </div>
            )}

            {debugInfo.tableConnection && (
              <div>
                <h5 className="text-sm font-medium mb-2">Connexion à la Table :</h5>
                <Badge variant={debugInfo.tableConnection.includes('✅') ? 'default' : 'destructive'}>
                  {debugInfo.tableConnection}
                </Badge>
              </div>
            )}

            {debugInfo.tableStructure && (
              <div>
                <h5 className="text-sm font-medium mb-2">Structure de la Table :</h5>
                <Badge variant={debugInfo.tableStructure.includes('✅') ? 'default' : 'destructive'}>
                  {debugInfo.tableStructure}
                </Badge>
              </div>
            )}

            {debugInfo.currentState && (
              <div>
                <h5 className="text-sm font-medium mb-2">État Actuel :</h5>
                <div className="space-y-1 text-sm">
                  <div>Nombre de marchés: {debugInfo.currentState.marketsCount}</div>
                  <div>Chargement: {debugInfo.currentState.isLoading ? '🔄 En cours' : '✅ Terminé'}</div>
                  <div>Erreur: {debugInfo.currentState.hasError ? '❌ Oui' : '✅ Non'}</div>
                  {debugInfo.currentState.hasError && (
                    <div className="text-red-600">Message: {debugInfo.currentState.errorMessage}</div>
                  )}
                </div>
              </div>
            )}

            {debugInfo.generalError && (
              <div>
                <h5 className="text-sm font-medium mb-2 text-red-600">Erreur Générale :</h5>
                <div className="text-red-600 text-sm">{debugInfo.generalError}</div>
              </div>
            )}
          </div>
        )}

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Instructions de Résolution :</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Si les variables d'environnement sont manquantes, créez un fichier .env.local</li>
            <li>• Si la table n'existe pas, exécutez le script SQL dans Supabase</li>
            <li>• Si l'utilisateur n'est pas connecté, vérifiez l'authentification</li>
            <li>• Vérifiez la console du navigateur pour plus de détails</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 