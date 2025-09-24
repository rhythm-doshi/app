'use client'

import { useEffect, useState } from 'react'

interface ColorOverlayProps {
  color: string
  opacity: number
}

export function ColorOverlay({ color, opacity }: ColorOverlayProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="color-overlay"
      style={{
        backgroundColor: color,
        opacity,
      }}
      aria-hidden="true"
    />
  )
}