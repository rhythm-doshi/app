'use client'

import { useEffect, useState, useCallback } from 'react'

interface ReadingRulerProps {
  direction: 'horizontal' | 'vertical'
}

export function ReadingRuler({ direction }: ReadingRulerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  const updatePosition = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
  }, [])

  const handleKeyboard = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      const step = 10
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          setPosition(prev => ({ ...prev, y: Math.max(0, prev.y - step) }))
          break
        case 'ArrowDown':
          e.preventDefault()
          setPosition(prev => ({ ...prev, y: Math.min(window.innerHeight - 50, prev.y + step) }))
          break
        case 'ArrowLeft':
          e.preventDefault()
          setPosition(prev => ({ ...prev, x: Math.max(0, prev.x - step) }))
          break
        case 'ArrowRight':
          e.preventDefault()
          setPosition(prev => ({ ...prev, x: Math.min(window.innerWidth - 50, prev.x + step) }))
          break
      }
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    document.addEventListener('mousemove', updatePosition)
    document.addEventListener('keydown', handleKeyboard)

    return () => {
      document.removeEventListener('mousemove', updatePosition)
      document.removeEventListener('keydown', handleKeyboard)
    }
  }, [updatePosition, handleKeyboard])

  if (!mounted) return null

  return (
    <div className="reading-ruler-overlay" aria-hidden="true">
      {direction === 'horizontal' ? (
        <div
          className="reading-ruler-window"
          style={{
            left: 0,
            right: 0,
            top: position.y - 25,
            height: 50,
          }}
        />
      ) : (
        <div
          className="reading-ruler-window"
          style={{
            top: 0,
            bottom: 0,
            left: position.x - 25,
            width: 50,
          }}
        />
      )}
    </div>
  )
}