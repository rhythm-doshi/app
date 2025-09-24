'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Timer } from 'lucide-react'
import { useStore } from '@/lib/store'

interface FocusTimerProps {
  onComplete?: () => void
}

export function FocusTimer({ onComplete }: FocusTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState(25) // minutes
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { addFocusReflection } = useStore()

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false)
            onComplete?.()
            // Play completion chime (if audio context allows)
            playCompletionChime()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, timeLeft, onComplete])

  const playCompletionChime = () => {
    // Simple audio chime using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1)
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      // Fallback - no audio chime
      console.log('Focus timer completed!')
    }
  }

  const startTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(selectedDuration * 60)
    }
    setIsActive(true)
  }

  const pauseTimer = () => {
    setIsActive(false)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(0)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const progress = timeLeft > 0 ? ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100 : 0

  const showReflection = timeLeft === 0 && !isActive && selectedDuration > 0

  const handleReflection = (reflection: string) => {
    addFocusReflection(reflection)
    setSelectedDuration(25) // Reset for next session
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-sm">
      <div className="flex items-center gap-2 mb-4">
        <Timer className="w-5 h-5 text-blue-600" />
        <h3 className="font-medium">Focus Timer</h3>
      </div>

      {!showReflection ? (
        <>
          {/* Duration Selection */}
          {timeLeft === 0 && !isActive && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Focus Duration
              </label>
              <div className="flex gap-2">
                {[5, 15, 25].map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setSelectedDuration(duration)}
                    className={`px-3 py-1 text-sm rounded ${
                      selectedDuration === duration
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {duration}m
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Timer Display */}
          <div className="text-center mb-4">
            <div className="relative w-24 h-24 mx-auto mb-2">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (progress * 251.2) / 100}
                  className="focus-timer-ring"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-mono font-bold">
                  {formatTime(timeLeft || selectedDuration * 60)}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-2">
            {!isActive ? (
              <button
                onClick={startTimer}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Play className="w-4 h-4" />
                Start
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
            )}
            
            {timeLeft > 0 && (
              <button
                onClick={resetTimer}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </>
      ) : (
        /* Reflection Card */
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl mb-2">🎉</div>
            <h4 className="font-medium mb-2">Focus Session Complete!</h4>
            <p className="text-sm text-gray-600">
              You focused for {selectedDuration} minutes. How did it go?
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {[
              { emoji: '😊', text: 'Great focus!' },
              { emoji: '😐', text: 'It was okay' },
              { emoji: '🤔', text: 'Got distracted' },
              { emoji: '😴', text: 'Felt tired' }
            ].map((option) => (
              <button
                key={option.text}
                onClick={() => handleReflection(option.text)}
                className="p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border transition-colors"
              >
                <div className="text-lg mb-1">{option.emoji}</div>
                <div>{option.text}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}