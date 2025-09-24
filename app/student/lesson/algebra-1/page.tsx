'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { mockLessons } from '@/lib/mockData'
import { UDLToolbar } from '@/components/UDLToolbar'
import { BalanceScale } from '@/components/BalanceScale'
import { FocusTimer } from '@/components/FocusTimer'
import { TTSButton } from '@/components/TTSButton'
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Clock,
  Home,
  Eye,
  Play
} from 'lucide-react'

export default function AlgebraLesson() {
  const router = useRouter()
  const { 
    currentUser, 
    currentRole, 
    currentLessonSteps, 
    currentStepIndex,
    updateLessonSteps,
    completeStep,
    nextStep,
    previousStep,
    startSubmission,
    updateSubmission,
    completeSubmission,
    addRecallItem,
    settings
  } = useStore()

  const [showTimer, setShowTimer] = useState(false)
  const [startTime] = useState(Date.now())
  const [currentSubmissionId, setCurrentSubmissionId] = useState<string | null>(null)

  useEffect(() => {
    if (!currentUser || currentRole !== 'student') {
      router.push('/')
      return
    }

    // Initialize lesson
    const lesson = mockLessons.find(l => l.id === 'algebra-1')
    if (lesson) {
      updateLessonSteps(lesson.content.steps)
      
      // Start a new submission
      startSubmission('assignment-1', currentUser.id)
      
      // Get the submission ID (simplified for demo)
      const newSubmissionId = `submission-${Date.now()}`
      setCurrentSubmissionId(newSubmissionId)
    }
  }, [currentUser, currentRole, router, updateLessonSteps, startSubmission])

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F' || e.key === 'f') {
        e.preventDefault()
        setShowTimer(!showTimer)
      }
      // Add more keyboard shortcuts as needed
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showTimer])

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (currentLessonSteps.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Loading lesson...</div>
  }

  const currentStep = currentLessonSteps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === currentLessonSteps.length - 1
  const completedStepsCount = currentLessonSteps.filter(step => step.completed).length

  const handleStepComplete = (isCorrect: boolean) => {
    if (isCorrect) {
      completeStep(currentStep.id)
      
      // Add to recall queue for spaced repetition
      if (currentStep.equation) {
        addRecallItem({
          question: `Solve: ${currentStep.equation}`,
          answer: currentStep.correctAnswer || 'See lesson',
          confidence: 'good'
        })
      }

      // Update submission progress
      if (currentSubmissionId) {
        const timeSpent = Math.round((Date.now() - startTime) / 1000)
        updateSubmission(currentSubmissionId, {
          timeOnTask: timeSpent,
          score: Math.round((completedStepsCount + 1) / currentLessonSteps.length * 100)
        })
      }

      // Auto-advance after a moment
      setTimeout(() => {
        if (!isLastStep) {
          nextStep()
        } else {
          // Complete the entire lesson
          if (currentSubmissionId) {
            completeSubmission(currentSubmissionId)
          }
          router.push('/student')
        }
      }, 2000)
    }
  }

  const handlePreviewSteps = () => {
    // Simple alert showing all steps - in a real app this would be a modal
    const stepsList = currentLessonSteps.map((step, index) => 
      `${index + 1}. ${step.title}`
    ).join('\n')
    
    alert(`Lesson Steps:\n\n${stepsList}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* UDL Toolbar */}
      <UDLToolbar />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/student"
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Link>
              
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-lg font-semibold text-gray-900">
                  Balance the Equation
                </h1>
                <p className="text-sm text-gray-600">
                  Step {currentStepIndex + 1} of {currentLessonSteps.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePreviewSteps}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
                title="Preview all steps"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview Steps</span>
              </button>

              <button
                onClick={() => setShowTimer(!showTimer)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  showTimer 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Toggle focus timer"
              >
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Focus Timer</span>
              </button>

              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedStepsCount / currentLessonSteps.length) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 min-w-0">
              {completedStepsCount} / {currentLessonSteps.length} completed
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md">
              {/* Step Header */}
              <div className="p-6 border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {currentStep.title}
                      {currentStep.completed && (
                        <CheckCircle className="inline-block w-5 h-5 text-green-600 ml-2" />
                      )}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {currentStep.description}
                    </p>
                  </div>
                  <TTSButton 
                    text={`${currentStep.title}. ${currentStep.description}. ${currentStep.instruction}`}
                  />
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Play className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-900 mb-1">Instructions:</p>
                      <p className="text-blue-800">{currentStep.instruction}</p>
                    </div>
                  </div>
                </div>

                {/* Interactive Content */}
                {currentStep.type === 'balance' && currentStep.equation && (
                  <BalanceScale
                    equation={currentStep.equation}
                    correctOperation={currentStep.correctAnswer || ''}
                    onSolved={handleStepComplete}
                  />
                )}

                {currentStep.type === 'input' && (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-lg mb-4">{currentStep.instruction}</p>
                    <input
                      type="number"
                      className="w-20 text-center text-xl font-bold p-2 border border-gray-300 rounded-md"
                      placeholder="?"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const value = parseInt((e.target as HTMLInputElement).value)
                          handleStepComplete(value === currentStep.correctAnswer)
                        }
                      }}
                    />
                    <p className="text-sm text-gray-600 mt-2">Press Enter to check your answer</p>
                  </div>
                )}

                {currentStep.type === 'multiple-choice' && (
                  <div className="space-y-4">
                    <p className="text-lg">{currentStep.instruction}</p>
                    <div className="text-center">
                      <button
                        onClick={() => handleStepComplete(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        I understand - let's start!
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="p-6 border-t bg-gray-50 rounded-b-lg">
                <div className="flex justify-between">
                  <button
                    onClick={previousStep}
                    disabled={isFirstStep}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      isFirstStep
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous Step
                  </button>

                  <div className="flex items-center gap-2">
                    {currentLessonSteps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`w-3 h-3 rounded-full ${
                          index === currentStepIndex
                            ? 'bg-blue-600'
                            : step.completed
                            ? 'bg-green-600'
                            : 'bg-gray-300'
                        }`}
                        title={step.title}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextStep}
                    disabled={isLastStep || !currentStep.completed}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      isLastStep || !currentStep.completed
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Focus Timer */}
            {showTimer && (
              <FocusTimer
                onComplete={() => {
                  // Optional: show gentle nudge to continue
                  console.log('Focus session completed!')
                }}
              />
            )}

            {/* Step Checklist */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-medium text-gray-900 mb-3">Lesson Steps</h3>
              <div className="space-y-2">
                {currentLessonSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`checklist-item flex items-start gap-3 p-2 rounded-md transition-colors ${
                      index === currentStepIndex ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      step.completed
                        ? 'bg-green-600 border-green-600'
                        : index === currentStepIndex
                        ? 'border-blue-600 bg-blue-100'
                        : 'border-gray-300'
                    }`}>
                      {step.completed && <CheckCircle className="w-3 h-3 text-white" />}
                      {index === currentStepIndex && !step.completed && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        step.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help Tips */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-medium text-gray-900 mb-3">Need Help?</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-900">Stuck on a problem?</p>
                  <p>Use the audio button to hear instructions again</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Hard to focus?</p>
                  <p>Try the focus timer (press F key)</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Text hard to read?</p>
                  <p>Adjust settings in the accessibility toolbar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}