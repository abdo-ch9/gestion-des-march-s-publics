"use client"

import { useEffect, useState } from "react"

export function HydrationSafe({ children, fallback = null, delay = 100 }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Small delay to ensure browser extensions have finished modifying the DOM
    const timer = setTimeout(() => {
      setIsClient(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  if (!isClient) {
    return fallback
  }

  return children
}

// Special wrapper for components that might have dynamic content
export function DynamicContentWrapper({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is fully ready
    const frame = requestAnimationFrame(() => {
      setMounted(true)
    })

    return () => cancelAnimationFrame(frame)
  }, [])

  if (!mounted) {
    return fallback
  }

  return children
} 