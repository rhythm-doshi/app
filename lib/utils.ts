import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout | null = null
  
  return ((...args: any[]) => {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }) as T
}

export function speak(text: string, rate = 1, onEnd?: () => void) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.onend = onEnd
    speechSynthesis.speak(utterance)
    return utterance
  }
  return null
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel()
  }
}