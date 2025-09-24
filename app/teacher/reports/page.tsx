'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { mockUsers } from '@/lib/mockData'
import { 
  ChevronLeft, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react'

export default function ReportsPage() {
  const router = useRouter()
  const { currentUser, currentRole, submissions } = useStore()

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
  const studentSubmissions = submissions.filter(s => 
    students.some(student => student.id === s.studentId)
  )

  // Calculate analytics
  const completedSubmissions = studentSubmissions.filter(s => s.completedAt)
  const inProgressSubmissions = studentSubmissions.filter(s => !s.completedAt && s.startedAt)
  const avgScore = completedSubmissions.length > 0
    ? Math.round(completedSubmissions.reduce((total, sub) => total + sub.score, 0) / completedSubmissions.length)
    : 0
  const avgTimeOnTask = completedSubmissions.length > 0
    ? Math.round(completedSubmissions.reduce((total, sub) => total + sub.timeOnTask, 0) / completedSubmissions.length / 60)
    : 0

  const exportToCsv = () => {
    const headers = ['Student Name', 'Status', 'Score (%)', 'Time on Task (min)', 'Errors', 'Mastery Level', 'Completed At']
    const rows = students.map(student => {
      const submission = studentSubmissions.find(s => s.studentId === student.id)
      if (!submission) {
        return [student.name, 'Not Started', '0', '0', '0', 'Beginner', '']
      }
      
      return [
        student.name,
        submission.completedAt ? 'Completed' : 'In Progress',
        submission.score.toString(),
        Math.round(submission.timeOnTask / 60).toString(),
        submission.errors.toString(),
        submission.mastery.charAt(0).toUpperCase() + submission.mastery.slice(1),
        submission.completedAt ? new Date(submission.completedAt).toLocaleDateString() : ''
      ]
    })

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'algebra_progress_report.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getMasteryColor = (mastery: string) => {
    switch (mastery) {
      case 'proficient': return 'text-green-700 bg-green-100'
      case 'developing': return 'text-yellow-700 bg-yellow-100' 
      case 'beginner': return 'text-gray-700 bg-gray-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getStatusIcon = (submission: any) => {
    if (!submission) return <AlertCircle className="w-4 h-4 text-gray-400" />
    if (submission.completedAt) return <CheckCircle className="w-4 h-4 text-green-600" />
    return <Clock className="w-4 h-4 text-yellow-600" />
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
                <h1 className="text-lg font-semibold text-gray-900">Progress Reports</h1>
                <p className="text-sm text-gray-600">Student analytics and insights</p>
              </div>
            </div>

            <button
              onClick={exportToCsv}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
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
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round((completedSubmissions.length / students.length) * 100)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-semibold text-gray-900">{avgScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Time on Task</p>
                <p className="text-2xl font-semibold text-gray-900">{avgTimeOnTask}m</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Detailed Student Report */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Detailed Student Progress</h2>
                <p className="text-sm text-gray-600">Balance the Equation lesson performance</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Errors
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mastery
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => {
                      const submission = studentSubmissions.find(s => s.studentId === student.id)
                      return (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {student.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{student.name}</p>
                                <p className="text-xs text-gray-500">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(submission)}
                              <span className="text-sm text-gray-700">
                                {!submission ? 'Not Started' 
                                  : submission.completedAt ? 'Completed' 
                                  : 'In Progress'
                                }
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              {submission ? `${submission.score}%` : '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-700">
                              {submission ? `${Math.round(submission.timeOnTask / 60)}m` : '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-700">
                              {submission ? submission.errors : '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              submission ? getMasteryColor(submission.mastery) : 'text-gray-500 bg-gray-100'
                            }`}>
                              {submission 
                                ? submission.mastery.charAt(0).toUpperCase() + submission.mastery.slice(1)
                                : 'Not Started'
                              }
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Insights */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Key Insights
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-medium text-blue-900">Strong Performance</p>
                    <p className="text-blue-800">
                      Ava completed the lesson with excellent mastery and minimal errors.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-medium text-yellow-900">Needs Support</p>
                    <p className="text-yellow-800">
                      Ben is in progress and may benefit from additional guidance on division problems.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="font-medium text-gray-900">Not Started</p>
                    <p className="text-gray-800">
                      Noor hasn't started yet. Consider sending a gentle reminder.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* UDL Usage */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="font-semibold text-gray-900">UDL Tool Usage</h3>
                <p className="text-sm text-gray-600">Accessibility features used</p>
              </div>
              <div className="p-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Dyslexia Font</span>
                    <span className="font-medium text-blue-600">33%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Text-to-Speech</span>
                    <span className="font-medium text-green-600">67%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Focus Timer</span>
                    <span className="font-medium text-purple-600">100%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Reading Ruler</span>
                    <span className="font-medium text-orange-600">33%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-medium text-purple-900 mb-2">Teaching Recommendations</h3>
              <div className="text-sm text-purple-800 space-y-2">
                <p>• Review division concepts with Ben</p>
                <p>• Encourage Noor to start the lesson</p>
                <p>• Consider more challenging problems for Ava</p>
                <p>• Promote TTS usage for better comprehension</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  href="/teacher/assignments"
                  className="block w-full p-3 text-center bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors text-sm"
                >
                  Create New Assignment
                </Link>
                <button
                  onClick={() => window.print()}
                  className="w-full p-3 text-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                >
                  Print Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}