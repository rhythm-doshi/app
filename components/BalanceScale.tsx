'use client'

import { useState, useEffect } from 'react'
import { Move, Minus, Plus, Check } from 'lucide-react'

interface BalanceScaleProps {
  equation: string
  onSolved: (isCorrect: boolean) => void
  correctOperation: string
}

interface Token {
  id: string
  value: string | number
  type: 'variable' | 'number' | 'operator'
}

export function BalanceScale({ equation, onSolved, correctOperation }: BalanceScaleProps) {
  const [leftTokens, setLeftTokens] = useState<Token[]>([])
  const [rightTokens, setRightTokens] = useState<Token[]>([])
  const [feedback, setFeedback] = useState<string>('')
  const [isBalanced, setIsBalanced] = useState(false)
  const [draggedToken, setDraggedToken] = useState<Token | null>(null)

  useEffect(() => {
    parseEquation()
  }, [equation])

  const parseEquation = () => {
    const [left, right] = equation.split('=').map(side => side.trim())
    
    setLeftTokens(parseTokens(left, 'left'))
    setRightTokens(parseTokens(right, 'right'))
    setFeedback('')
    setIsBalanced(false)
  }

  const parseTokens = (expression: string, side: 'left' | 'right'): Token[] => {
    const tokens: Token[] = []
    
    // Simple parsing for demo equations like "x + 3", "2x", "x/3"
    if (expression.includes('x')) {
      if (expression.includes('/')) {
        // Handle x/3 = 5 case
        tokens.push({ id: `${side}-x`, value: 'x', type: 'variable' })
        tokens.push({ id: `${side}-div`, value: '÷', type: 'operator' })
        const number = expression.replace('x/', '')
        tokens.push({ id: `${side}-${number}`, value: parseInt(number), type: 'number' })
      } else if (expression.includes('*') || /^\d+x$/.test(expression.replace(' ', ''))) {
        // Handle 2x = 8 case
        const coefficient = expression.replace('x', '').replace('*', '') || '1'
        if (coefficient !== '1') {
          tokens.push({ id: `${side}-${coefficient}`, value: parseInt(coefficient), type: 'number' })
          tokens.push({ id: `${side}-mult`, value: '×', type: 'operator' })
        }
        tokens.push({ id: `${side}-x`, value: 'x', type: 'variable' })
      } else {
        // Handle x + 3 case
        tokens.push({ id: `${side}-x`, value: 'x', type: 'variable' })
        if (expression.includes('+')) {
          tokens.push({ id: `${side}-plus`, value: '+', type: 'operator' })
          const number = expression.split('+')[1].trim()
          tokens.push({ id: `${side}-${number}`, value: parseInt(number), type: 'number' })
        } else if (expression.includes('-')) {
          tokens.push({ id: `${side}-minus`, value: '-', type: 'operator' })
          const number = expression.split('-')[1].trim()
          tokens.push({ id: `${side}-${number}`, value: parseInt(number), type: 'number' })
        }
      }
    } else {
      // Just a number
      tokens.push({ id: `${side}-${expression}`, value: parseInt(expression), type: 'number' })
    }
    
    return tokens
  }

  const handleDragStart = (token: Token) => {
    setDraggedToken(token)
  }

  const handleDrop = (targetSide: 'left' | 'right') => {
    if (!draggedToken) return

    // For demo, we'll use button-based operations instead of complex drag logic
    setDraggedToken(null)
  }

  const applyOperation = (operation: 'subtract' | 'add' | 'divide' | 'multiply', value: number) => {
    const operationMap = {
      'subtract': `Subtract ${value} from both sides`,
      'add': `Add ${value} to both sides`, 
      'divide': `Divide both sides by ${value}`,
      'multiply': `Multiply both sides by ${value}`
    }

    setFeedback(operationMap[operation])
    
    // Simulate the equation solving
    setTimeout(() => {
      const isCorrect = checkSolution(operation, value)
      setIsBalanced(isCorrect)
      onSolved(isCorrect)
    }, 1000)
  }

  const checkSolution = (operation: string, value: number): boolean => {
    const correctValue = parseInt(correctOperation)
    
    if (equation === 'x + 3 = 7') {
      return operation === 'subtract' && value === 3
    } else if (equation === '2x = 8') {
      return operation === 'divide' && value === 2  
    } else if (equation === 'x/3 = 5') {
      return operation === 'multiply' && value === 3
    }
    
    return false
  }

  const getOperationOptions = () => {
    if (equation === 'x + 3 = 7') {
      return [
        { operation: 'subtract' as const, value: 3, label: 'Subtract 3' },
        { operation: 'subtract' as const, value: 1, label: 'Subtract 1' },
        { operation: 'add' as const, value: 2, label: 'Add 2' }
      ]
    } else if (equation === '2x = 8') {
      return [
        { operation: 'divide' as const, value: 2, label: 'Divide by 2' },
        { operation: 'divide' as const, value: 4, label: 'Divide by 4' },
        { operation: 'multiply' as const, value: 2, label: 'Multiply by 2' }
      ]
    } else if (equation === 'x/3 = 5') {
      return [
        { operation: 'multiply' as const, value: 3, label: 'Multiply by 3' },
        { operation: 'multiply' as const, value: 5, label: 'Multiply by 5' },
        { operation: 'divide' as const, value: 3, label: 'Divide by 3' }
      ]
    }
    return []
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Balance Scale</h3>
        <div className="text-2xl font-mono font-bold text-blue-600 mb-4">
          {equation}
        </div>
        {feedback && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
            {feedback}
          </div>
        )}
      </div>

      {/* Balance Scale Visual */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-end gap-8">
          {/* Left Pan */}
          <div 
            className={`balance-pan flex flex-col items-center ${
              isBalanced ? 'transform translate-y-0' : 'transform translate-y-2'
            }`}
          >
            <div 
              className="w-32 h-16 bg-yellow-200 border-2 border-yellow-400 rounded-lg flex items-center justify-center gap-1 p-2"
              onDrop={() => handleDrop('left')}
              onDragOver={(e) => e.preventDefault()}
            >
              {leftTokens.map((token) => (
                <div
                  key={token.id}
                  className={`token px-2 py-1 rounded cursor-move text-sm font-semibold ${
                    token.type === 'variable' 
                      ? 'bg-red-100 text-red-800 border-red-300 border'
                      : token.type === 'number'
                      ? 'bg-blue-100 text-blue-800 border-blue-300 border'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(token)}
                >
                  {token.value}
                </div>
              ))}
            </div>
            <div className="w-1 h-8 bg-gray-400 mt-2"></div>
          </div>

          {/* Balance Point */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-2 bg-gray-600 rounded"></div>
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mt-1">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Right Pan */}
          <div 
            className={`balance-pan flex flex-col items-center ${
              isBalanced ? 'transform translate-y-0' : 'transform translate-y-2'
            }`}
          >
            <div 
              className="w-32 h-16 bg-yellow-200 border-2 border-yellow-400 rounded-lg flex items-center justify-center gap-1 p-2"
              onDrop={() => handleDrop('right')}
              onDragOver={(e) => e.preventDefault()}
            >
              {rightTokens.map((token) => (
                <div
                  key={token.id}
                  className={`token px-2 py-1 rounded cursor-move text-sm font-semibold ${
                    token.type === 'variable' 
                      ? 'bg-red-100 text-red-800 border-red-300 border'
                      : token.type === 'number'
                      ? 'bg-blue-100 text-blue-800 border-blue-300 border'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(token)}
                >
                  {token.value}
                </div>
              ))}
            </div>
            <div className="w-1 h-8 bg-gray-400 mt-2"></div>
          </div>
        </div>
      </div>

      {/* Operation Buttons */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">
            What operation should we apply to both sides?
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {getOperationOptions().map((option, index) => (
              <button
                key={index}
                onClick={() => applyOperation(option.operation, option.value)}
                disabled={isBalanced}
                className={`px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isBalanced 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
                aria-label={`Apply operation: ${option.label} to both sides`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {isBalanced && (
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-green-800">
              <Check className="w-5 h-5" />
              <span className="font-medium">Great! The equation is now balanced.</span>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">How to solve:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Both sides of the equation must stay equal</li>
          <li>• Whatever you do to one side, do to the other</li>
          <li>• Try to get the variable (x) by itself</li>
        </ul>
      </div>
    </div>
  )
}