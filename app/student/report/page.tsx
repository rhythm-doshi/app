'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { ChevronLeft, Trophy, Clock, Target, BookOpen, Zap, Smile } from 'lucide-react'

export default function StudentReportPage() {
  const router = useRouter()
  const { currentUser, currentRole, submissions, focusReflections, recallQueue } = useStore()

  useEffect(() => {
    if (!currentUser || currentRole !== 'student') {
      router.push('/')
      return
    }
  }, [currentUser, currentRole, router])

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const mySubmissions = submissions.filter(s => s.studentId === currentUser.id)
  const completedSubmissions = mySubmissions.filter(s => s.completedAt)
  const totalTimeSpent = mySubmissions.reduce((total, sub) => total + sub.timeOnTask, 0)
  const averageScore = completedSubmissions.length > 0 
    ? Math.round(completedSubmissions.reduce((total, sub) => total + sub.score, 0) / completedSubmissions.length)
    : 0

  const getMasteryEmoji = (mastery: string) => {
    switch (mastery) {
      case 'proficient': return '🌟'
      case 'developing': return '📈' 
      case 'beginner': return '🌱'
      default: return '🌱'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                <h1 className="text-lg font-semibold text-gray-900">My Progress</h1>
                <p className="text-sm text-gray-600">Your learning journey</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Achievement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-10 h-10" />
              <div>
                <p className="text-blue-100">Lessons Completed</p>
                <p className="text-2xl font-bold">{completedSubmissions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <Target className="w-10 h-10" />
              <div>
                <p className="text-green-100">Average Score</p>
                <p className="text-2xl font-bold">{averageScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-10 h-10" />
              <div>
                <p className="text-purple-100">Time Focused</p>
                <p className="text-2xl font-bold">{Math.round(totalTimeSpent / 60)}m</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <Zap className="w-10 h-10" />
              <div>
                <p className="text-orange-100">Focus Sessions</p>
                <p className="text-2xl font-bold">{focusReflections.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Lesson Progress */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Lesson Progress</h2>
                <p className="text-sm text-gray-600">Your algebra learning journey</p>
              </div>
              <div className="p-6">
                {mySubmissions.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No lessons started yet</p>
                    <Link
                      href="/student/lesson/algebra-1"
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      Start Your First Lesson
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mySubmissions.map((submission) => (
                      <div key={submission.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                              Balance the Equation
                              <span className="text-2xl">{getMasteryEmoji(submission.mastery)}</span>
                            </h3>
                            <p className="text-sm text-gray-600">
                              {submission.completedAt 
                                ? `Completed ${new Date(submission.completedAt).toLocaleDateString()}`
                                : 'In progress'
                              }
                            </p>
                          </div>
                          <div className="text-right">
                            {submission.completedAt && (
                              <div className="text-2xl font-bold text-green-600">
                                {submission.score}%
                              </div>
                            )}
                            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                              submission.mastery === 'proficient' 
                                ? 'bg-green-100 text-green-800'
                                : submission.mastery === 'developing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {submission.mastery.charAt(0).toUpperCase() + submission.mastery.slice(1)}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Time Spent</p>
                            <p className="font-medium text-gray-900">
                              {Math.round(submission.timeOnTask / 60)} minutes
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Attempts</p>
                            <p className="font-medium text-gray-900">{submission.attempts}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Errors</p>
                            <p className="font-medium text-gray-900">{submission.errors}</p>
                          </div>
                        </div>

                        {submission.reflections.length > 0 && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm font-medium text-blue-900 mb-1">Your Thoughts:</p>
                            <div className="space-y-1">
                              {submission.reflections.map((reflection, index) => (
                                <p key={index} className="text-sm text-blue-800">
                                  "{ reflection }"
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Learning Insights */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Learning Insights</h2>
                <p className="text-sm text-gray-600">What the data tells us about your learning</p>
              </div>
              <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-green-600" />
                      </div>
                      <h3 className="font-medium text-green-900">Strengths</h3>
                    </div>
                    <ul className="text-sm text-green-800 space-y-1">
                      {averageScore >= 80 && <li>• Excellent problem-solving skills</li>}
                      {focusReflections.length > 2 && <li>• Great use of focus tools</li>}
                      {completedSubmissions.length > 0 && <li>• Consistent lesson completion</li>}
                      {mySubmissions.some(s => s.errors < 3) && <li>• Careful attention to detail</li>}
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Target className="w-4 h-4 text-blue-600" />
                      </div>
                      <h3 className="font-medium text-blue-900">Growth Areas</h3>
                    </div>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {averageScore < 80 && <li>• Practice more equation solving</li>}
                      {mySubmissions.some(s => s.errors > 3) && <li>• Double-check your work</li>}
                      {focusReflections.length < 2 && <li>• Try using the focus timer</li>}
                      <li>• Keep up the great work!</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Focus Reflections */}
            {focusReflections.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Smile className="w-4 h-4" />
                    Focus Reflections
                  </h3>
                  <p className="text-sm text-gray-600">Your recent focus session notes</p>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {focusReflections.slice(-5).map((reflection, index) => (
                      <div key={index} className="text-sm text-gray-600 p-3 bg-purple-50 border border-purple-200 rounded">
                        "{reflection}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Review Queue */}
            {recallQueue.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h3 className="font-semibold text-gray-900">Review Queue</h3>
                  <p className="text-sm text-gray-600">Problems to review</p>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {recallQueue.slice(0, 3).map((item) => (
                      <div key={item.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm font-medium text-yellow-900">{item.question}</p>
                        <p className="text-xs text-yellow-700 mt-1">
                          Review: {new Date(item.nextReview).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Motivational Messages */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Keep Going!
              </h3>
              <p className="text-sm opacity-90">
                {completedSubmissions.length === 0 
                  ? "You're about to start an amazing learning journey. Every expert was once a beginner!"
                  : averageScore >= 90
                  ? "Outstanding work! You're mastering algebra concepts beautifully."
                  : averageScore >= 80
                  ? "Great progress! You're building strong algebra foundations."
                  : averageScore >= 70
                  ? "Good effort! Keep practicing and you'll see improvement."
                  : "Remember: every mistake is a learning opportunity. You've got this!"
                }
              </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  href="/student/lesson/algebra-1"
                  className="block w-full p-3 text-center bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors text-sm"
                >
                  Continue Learning
                </Link>
                <Link
                  href="/student"
                  className="block w-full p-3 text-center bg-green-100 hover:bg-green-200 rounded-lg transition-colors text-sm"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}