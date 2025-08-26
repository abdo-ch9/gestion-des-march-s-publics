import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { AuthProvider } from '../lib/auth-context'
import { Suspense } from 'react'

export const metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

// Hydration safety wrapper component
function HydrationWrapper({ children }) {
  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body suppressHydrationWarning>
        <HydrationWrapper>
          <AuthProvider>
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </AuthProvider>
        </HydrationWrapper>
      </body>
    </html>
  )
} 