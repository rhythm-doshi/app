'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { BookOpen, Clock, Target, Play, Home } from 'lucide-react'

export default function StudentDashboard() {
  const router = useRouter()
  const { currentUser, currentRole, submissions, focusReflections } = useStore()

  useEffect(() => {
    if (!currentUser || currentRole !== 'student') {
      router.push('/')
      return
    }
  }, [currentUser, currentRole, router])

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Loading...</h1>
          <p className="text-gray-600">Redirecting to home page...</p>
        </div>
      </div>
    )
  }

  const studentSubmissions = submissions.filter(s => s.studentId === currentUser.id)
  const completedSubmissions = studentSubmissions.filter(s => s.completedAt)
  const inProgressSubmissions = studentSubmissions.filter(s => !s.completedAt && s.startedAt)
  
  const totalTimeOnTask = studentSubmissions.reduce((total, sub) => total + sub.timeOnTask, 0)
  const averageScore = completedSubmissions.length > 0 
    ? Math.round(completedSubmissions.reduce((total, sub) => total + sub.score, 0) / completedSubmissions.length)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Welcome back, {currentUser.name}!
                </h1>
                <p className="text-sm text-gray-600">Student Dashboard</p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Lessons Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{completedSubmissions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Focus Time</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round(totalTimeOnTask / 60)}m
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-semibold text-gray-900">{averageScore}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Available Lessons */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Available Lessons</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Interactive algebra lessons with accessibility support
                </p>
              </div>
              <div className="p-6">
                <div className="border border-blue-200 rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Balance the Equation
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Learn to solve simple equations by keeping both sides balanced. 
                        Practice with x+3=7, 2x=8, and x/3=5.
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          ~15 minutes
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          3 problems
                        </span>
                      </div>

                      {/* Features */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Includes:</p>
                        <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                          <span>• Interactive balance scale</span>
                          <span>• Text-to-speech support</span>
                          <span>• Step-by-step guidance</span>
                          <span>• Focus timer option</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      <Link
                        href="/student/lesson/algebra-1"
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <Play className="w-4 h-4" />
                        Start Lesson
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {studentSubmissions.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {studentSubmissions.slice(0, 3).map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Balance the Equation</p>
                          <p className="text-sm text-gray-600">
                            {submission.completedAt 
                              ? `Completed ${Math.round(submission.timeOnTask / 60)} min ago`
                              : `In progress • ${Math.round(submission.timeOnTask / 60)} min spent`
                            }
                          </p>
                        </div>
                        <div className="text-right">
                          {submission.completedAt ? (
                            <>
                              <p className="font-medium text-gray-900">{submission.score}%</p>
                              <p className="text-sm text-gray-600 capitalize">{submission.mastery}</p>
                            </>
                          ) : (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                              In Progress
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Focus Reflections */}
            {focusReflections.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h3 className="font-semibold text-gray-900">Recent Reflections</h3>
                  <p className="text-sm text-gray-600">Your focus session notes</p>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {focusReflections.slice(-3).map((reflection, index) => (
                      <div key={index} className="text-sm text-gray-600 p-3 bg-blue-50 rounded">
                        "{reflection}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Learning Tips */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="font-semibold text-gray-900">Learning Tips</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-900">Use the Focus Timer</p>
                    <p>Try 15-25 minute focused sessions with breaks</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Accessibility Tools</p>
                    <p>Adjust text size, font, and use the reading ruler as needed</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Take Your Time</p>
                    <p>There's no rush - understand each step before moving on</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="font-semibold text-gray-900">Quick Access</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <Link
                    href="/student/report"
                    className="block w-full p-3 text-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    View My Progress
                  </Link>
                  <button
                    onClick={() => window.location.reload()}
                    className="block w-full p-3 text-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Reset Demo Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}