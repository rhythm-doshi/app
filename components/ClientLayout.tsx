'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'
import { ColorOverlay } from './ColorOverlay'
import { ReadingRuler } from './ReadingRuler'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { settings } = useStore()

  useEffect(() => {
    document.documentElement.classList.toggle("dyslexia", settings.fontMode === "dyslexia")
    document.documentElement.style.setProperty("--text-size", `${settings.textSize}rem`)
    document.documentElement.style.setProperty("--letter-spacing", `${settings.letterSpacing}em`)
    document.documentElement.style.setProperty("--line-height", `${settings.lineHeight}`)
    document.documentElement.classList.toggle("reduced-motion", settings.reducedMotion)
    document.documentElement.classList.toggle("distraction-free", settings.distractionFree)
    document.documentElement.setAttribute("data-contrast", settings.highContrast ? "high" : "normal")
    
    // Update font class on body
    const body = document.body
    body.classList.remove('font-inter', 'font-lexend')
    body.classList.add(settings.fontMode === "dyslexia" ? "font-lexend" : "font-inter")
  }, [settings])

  return (
    <>
      {children}
      {settings.colorOverlay.enabled && (
        <ColorOverlay 
          color={settings.colorOverlay.color} 
          opacity={settings.colorOverlay.opacity} 
        />
      )}
      {settings.readingRuler.enabled && (
        <ReadingRuler direction={settings.readingRuler.direction} />
      )}
    </>
  )
}