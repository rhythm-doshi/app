'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { Play, Pause, Volume2, Settings } from 'lucide-react'
import { speak, stopSpeaking } from '@/lib/utils'

interface TTSButtonProps {
  text: string
  className?: string
}

export function TTSButton({ text, className = '' }: TTSButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const { settings } = useStore()

  useEffect(() => {
    setIsSupported('speechSynthesis' in window)
  }, [])

  const handleSpeak = () => {
    if (!isSupported) return

    if (isPlaying) {
      stopSpeaking()
      setIsPlaying(false)
    } else {
      const utterance = speak(text, settings.ttsRate, () => {
        setIsPlaying(false)
      })
      if (utterance) {
        setIsPlaying(true)
      }
    }
  }

  if (!isSupported) {
    return (
      <button
        disabled
        className={`inline-flex items-center gap-2 px-3 py-1 text-sm text-gray-400 ${className}`}
        title="Text-to-speech not supported in this browser"
      >
        <Volume2 className="w-4 h-4" />
        TTS unavailable
      </button>
    )
  }

  return (
    <button
      onClick={handleSpeak}
      className={`inline-flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      title={isPlaying ? 'Stop reading' : 'Read aloud'}
      aria-label={isPlaying ? 'Stop reading' : 'Read aloud'}
    >
      {isPlaying ? (
        <Pause className="w-4 h-4" />
      ) : (
        <Play className="w-4 h-4" />
      )}
      <span className="sr-only sm:not-sr-only">
        {isPlaying ? 'Stop' : 'Listen'}
      </span>
    </button>
  )
}