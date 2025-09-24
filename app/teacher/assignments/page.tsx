'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { mockAssignments, mockLessons, mockUsers } from '@/lib/mockData'
import { ChevronLeft, Users, Calendar, BookOpen, Send } from 'lucide-react'

export default function AssignmentsPage() {
  const router = useRouter()
  const { currentUser, currentRole } = useStore()
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [showAssignModal, setShowAssignModal] = useState(false)

  useEffect(() => {
    if (!currentUser || currentRole !== 'teacher') {
      router.push('/')
      return
    }
  }, [currentUser, currentRole, router])

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const students = mockUsers.filter(user => user.role === 'student')
  const assignments = mockAssignments
  const lessons = mockLessons

  const handleAssignLesson = () => {
    // In a real app, this would create assignments for selected students
    alert(`Assigned "Balance the Equation" to ${selectedStudents.length} students!`)
    setShowAssignModal(false)
    setSelectedStudents([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/teacher"
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Link>
              
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-lg font-semibold text-gray-900">Assignments</h1>
                <p className="text-sm text-gray-600">Manage lesson assignments</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Available Lessons */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Available Lessons</h2>
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Assign Lesson
                  </button>
                </div>
              </div>
              <div className="p-6">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="border border-gray-200 rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {lesson.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {lesson.description}
                        </p>
                        
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Duration:</p>
                            <p className="text-sm text-gray-600">~{lesson.content.estimatedTime} minutes</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Steps:</p>
                            <p className="text-sm text-gray-600">{lesson.content.steps.length} interactive steps</p>
                          </div>
                        </div>

                        {/* UDL Features */}
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">UDL Features:</p>
                          <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                            <span>• Interactive balance scale</span>
                            <span>• Text-to-speech support</span>
                            <span>• Reading ruler overlay</span>
                            <span>• Adjustable fonts & spacing</span>
                            <span>• Focus timer integration</span>
                            <span>• Color overlay options</span>
                            <span>• Step-by-step guidance</span>
                            <span>• Progress tracking</span>
                          </div>
                        </div>

                        {/* Learning Objectives */}
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Learning Objectives:</p>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            <li>Understand equation balance concept</li>
                            <li>Solve linear equations: x+3=7, 2x=8, x/3=5</li>
                            <li>Apply inverse operations correctly</li>
                            <li>Check solutions by substitution</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Assignments */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Current Assignments</h2>
              </div>
              <div className="p-6">
                {assignments.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No assignments created yet</p>
                    <p className="text-sm text-gray-400">Create your first assignment to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{assignment.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Created {new Date(assignment.createdAt).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {students.length} students
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              href="/teacher/reports"
                              className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                            >
                              View Reports
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Students List */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="font-semibold text-gray-900">Students</h3>
                <p className="text-sm text-gray-600">Your class roster</p>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Assignment Tips */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-medium text-green-900 mb-2">Assignment Tips</h3>
              <div className="text-sm text-green-800 space-y-2">
                <p>• Students can access lessons anytime</p>
                <p>• UDL tools help all learners succeed</p>
                <p>• Progress is automatically tracked</p>
                <p>• View detailed reports for insights</p>
              </div>
            </div>

            {/* Demo Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="font-semibold text-gray-900">Demo Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full p-3 text-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                >
                  Reset Demo Data
                </button>
                <Link
                  href="/student/lesson/algebra-1"
                  className="block w-full p-3 text-center bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors text-sm"
                >
                  Preview Student Experience
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assign Lesson</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Assign "Balance the Equation" to selected students:
              </p>
              
              <div className="space-y-2">
                {students.map((student) => (
                  <label key={student.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents([...selectedStudents, student.id])
                        } else {
                          setSelectedStudents(selectedStudents.filter(id => id !== student.id))
                        }
                      }}
                      className="rounded"
                    />
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">
                        {student.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-900">{student.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false)
                  setSelectedStudents([])
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignLesson}
                disabled={selectedStudents.length === 0}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedStudents.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Assign to {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}