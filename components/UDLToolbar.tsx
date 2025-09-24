'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { 
  Settings, 
  Type, 
  Eye, 
  Palette, 
  Volume2, 
  Timer,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export function UDLToolbar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { settings, updateSettings } = useStore()

  const toggleExpanded = () => setIsExpanded(!isExpanded)

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      {/* Compact Header */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-sm">Accessibility Tools</span>
        </div>
        <button
          onClick={toggleExpanded}
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Hide accessibility tools' : 'Show accessibility tools'}
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            
            {/* Font Mode */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Type className="w-4 h-4" />
                Font Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSettings({ fontMode: 'default' })}
                  className={`px-3 py-1 text-xs rounded ${
                    settings.fontMode === 'default'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Default
                </button>
                <button
                  onClick={() => updateSettings({ fontMode: 'dyslexia' })}
                  className={`px-3 py-1 text-xs rounded ${
                    settings.fontMode === 'dyslexia'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Dyslexia
                </button>
              </div>
            </div>

            {/* Text Size */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                Text Size
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateSettings({ textSize: Math.max(0.75, settings.textSize - 0.1) })}
                  className="p-1 rounded hover:bg-gray-100"
                  aria-label="Decrease text size"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm min-w-[3rem] text-center">
                  {settings.textSize.toFixed(1)}rem
                </span>
                <button
                  onClick={() => updateSettings({ textSize: Math.min(2, settings.textSize + 0.1) })}
                  className="p-1 rounded hover:bg-gray-100"
                  aria-label="Increase text size"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Letter Spacing */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                Letter Spacing
              </label>
              <input
                type="range"
                min="0"
                max="0.2"
                step="0.01"
                value={settings.letterSpacing}
                onChange={(e) => updateSettings({ letterSpacing: parseFloat(e.target.value) })}
                className="w-full"
                aria-label="Adjust letter spacing"
              />
              <span className="text-xs text-gray-600 text-center block">
                {settings.letterSpacing.toFixed(2)}em
              </span>
            </div>

            {/* Line Height */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                Line Height
              </label>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.1"
                value={settings.lineHeight}
                onChange={(e) => updateSettings({ lineHeight: parseFloat(e.target.value) })}
                className="w-full"
                aria-label="Adjust line height"
              />
              <span className="text-xs text-gray-600 text-center block">
                {settings.lineHeight.toFixed(1)}
              </span>
            </div>

            {/* Reading Ruler */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Eye className="w-4 h-4" />
                Reading Ruler
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSettings({ 
                    readingRuler: { ...settings.readingRuler, enabled: !settings.readingRuler.enabled }
                  })}
                  className={`px-3 py-1 text-xs rounded ${
                    settings.readingRuler.enabled
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {settings.readingRuler.enabled ? 'On' : 'Off'}
                </button>
                {settings.readingRuler.enabled && (
                  <select
                    value={settings.readingRuler.direction}
                    onChange={(e) => updateSettings({ 
                      readingRuler: { 
                        ...settings.readingRuler, 
                        direction: e.target.value as 'horizontal' | 'vertical'
                      }
                    })}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="horizontal">↔</option>
                    <option value="vertical">↕</option>
                  </select>
                )}
              </div>
            </div>

            {/* Color Overlay */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Palette className="w-4 h-4" />
                Color Overlay
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSettings({ 
                    colorOverlay: { ...settings.colorOverlay, enabled: !settings.colorOverlay.enabled }
                  })}
                  className={`px-3 py-1 text-xs rounded ${
                    settings.colorOverlay.enabled
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {settings.colorOverlay.enabled ? 'On' : 'Off'}
                </button>
                {settings.colorOverlay.enabled && (
                  <div className="flex gap-1">
                    {['#fef3c7', '#dbeafe', '#dcfce7', '#fce7f3'].map((color) => (
                      <button
                        key={color}
                        onClick={() => updateSettings({ 
                          colorOverlay: { ...settings.colorOverlay, color }
                        })}
                        className={`w-6 h-6 rounded border-2 ${
                          settings.colorOverlay.color === color
                            ? 'border-gray-800'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color} overlay`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* TTS Rate */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Volume2 className="w-4 h-4" />
                Speech Rate
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.ttsRate}
                onChange={(e) => updateSettings({ ttsRate: parseFloat(e.target.value) })}
                className="w-full"
                aria-label="Adjust speech rate"
              />
              <span className="text-xs text-gray-600 text-center block">
                {settings.ttsRate.toFixed(1)}x
              </span>
            </div>

            {/* Additional Toggles */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Options</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(e) => updateSettings({ highContrast: e.target.checked })}
                    className="rounded"
                  />
                  High Contrast
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                    className="rounded"
                  />
                  Reduced Motion
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.distractionFree}
                    onChange={(e) => updateSettings({ distractionFree: e.target.checked })}
                    className="rounded"
                  />
                  Distraction Free
                </label>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}