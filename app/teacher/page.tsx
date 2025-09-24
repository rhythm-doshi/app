'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { mockAssignments, mockSubmissions, mockUsers } from '@/lib/mockData'
import { Users, BookOpen, BarChart3, Home, Clock, CheckCircle } from 'lucide-react'

export default function TeacherDashboard() {
  const router = useRouter()
  const { currentUser, currentRole, submissions } = useStore()

  useEffect(() => {
    if (!currentUser || currentRole !== 'teacher') {
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

  const students = mockUsers.filter(user => user.role === 'student')
  const assignments = mockAssignments
  const studentSubmissions = submissions.filter(s => 
    students.some(student => student.id === s.studentId)
  )
  
  const completedSubmissions = studentSubmissions.filter(s => s.completedAt)
  const inProgressSubmissions = studentSubmissions.filter(s => !s.completedAt && s.startedAt)
  const avgCompletionTime = completedSubmissions.length > 0
    ? Math.round(completedSubmissions.reduce((total, sub) => total + sub.timeOnTask, 0) / completedSubmissions.length / 60)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Welcome, {currentUser.name}!
                </h1>
                <p className="text-sm text-gray-600">Teacher Dashboard</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">{students.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{completedSubmissions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">{inProgressSubmissions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Time</p>
                <p className="text-2xl font-semibold text-gray-900">{avgCompletionTime}m</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link
                    href="/teacher/assignments"
                    className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Manage Assignments</p>
                      <p className="text-sm text-gray-600">Create and assign lessons</p>
                    </div>
                  </Link>

                  <Link
                    href="/teacher/reports"
                    className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                  >
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">View Reports</p>
                      <p className="text-sm text-gray-600">Student progress analytics</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Recent Student Activity</h2>
              </div>
              <div className="p-6">
                {studentSubmissions.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No student activity yet</p>
                    <p className="text-sm text-gray-400">Assign lessons to see student progress</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {studentSubmissions.slice(0, 5).map((submission) => {
                      const student = students.find(s => s.id === submission.studentId)
                      return (
                        <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {student?.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{student?.name}</p>
                              <p className="text-sm text-gray-600">
                                {submission.completedAt 
                                  ? `Completed Balance the Equation`
                                  : `Working on Balance the Equation`
                                }
                              </p>
                            </div>
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
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Class Overview */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="font-semibold text-gray-900">Class Overview</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {students.map((student) => {
                    const studentSub = studentSubmissions.find(s => s.studentId === student.id)
                    return (
                      <div key={student.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {student.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{student.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {studentSub?.completedAt ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : studentSub?.startedAt ? (
                            <Clock className="w-4 h-4 text-yellow-600" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Demo Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-medium text-blue-900 mb-2">Demo Information</h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>This demo includes:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>3 mock students (Ava, Ben, Noor)</li>
                  <li>1 algebra lesson with UDL features</li>
                  <li>Progress tracking and analytics</li>
                  <li>Accessibility accommodations data</li>
                </ul>
              </div>
            </div>

            {/* UDL Features Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-medium text-purple-900 mb-2">UDL Features</h3>
              <div className="text-sm text-purple-800 space-y-2">
                <p>Students have access to:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                  <li>Dyslexia-friendly fonts</li>
                  <li>Adjustable text size & spacing</li>
                  <li>Reading ruler & color overlays</li>
                  <li>Text-to-speech with rate control</li>
                  <li>Focus timers & gentle nudges</li>
                  <li>Interactive balance scales</li>
                  <li>Step-by-step guidance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}