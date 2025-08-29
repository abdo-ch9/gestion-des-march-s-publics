"use client"

import { useEffect, useState } from "react"

export function ClientOnly({ children, fallback = null }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering until client-side
  if (!hasMounted) {
    return fallback
  }

  return children
} 