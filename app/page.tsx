'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { mockUsers } from '@/lib/mockData'
import { GraduationCap, Users, Settings } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const { setCurrentUser, setCurrentRole } = useStore()
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null)

  const handleRoleSelect = (role: 'student' | 'teacher') => {
    setSelectedRole(role)
    setCurrentRole(role)

    // For demo, auto-select first user of that role
    const user = mockUsers.find(u => u.role === role)
    if (user) {
      setCurrentUser(user)
      router.push(`/${role}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Neurodiverse Algebra Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience algebra learning designed with Universal Design for Learning (UDL) principles 
            to support ADHD, Dyslexia, and Autism learners.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Student Role */}
          <div 
            className={`bg-white rounded-xl shadow-lg p-8 cursor-pointer transition-all hover:shadow-xl border-2 ${
              selectedRole === 'student' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => handleRoleSelect('student')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">I'm a Student</h2>
              <p className="text-gray-600 mb-6">
                Practice algebra with personalized accessibility tools and step-by-step guidance.
              </p>
              
              <div className="text-left space-y-2">
                <h3 className="font-medium text-gray-900 mb-2">Features for you:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Dyslexia-friendly reading options</li>
                  <li>• Interactive balance scale lessons</li>
                  <li>• Text-to-speech with adjustable speed</li>
                  <li>• Focus timer and gentle reminders</li>
                  <li>• Reading ruler and color overlays</li>
                  <li>• Step-by-step problem solving</li>
                </ul>
              </div>

              <button className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                Start Learning
              </button>
            </div>
          </div>

          {/* Teacher Role */}
          <div 
            className={`bg-white rounded-xl shadow-lg p-8 cursor-pointer transition-all hover:shadow-xl border-2 ${
              selectedRole === 'teacher' ? 'border-green-500 bg-green-50' : 'border-gray-200'
            }`}
            onClick={() => handleRoleSelect('teacher')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">I'm a Teacher</h2>
              <p className="text-gray-600 mb-6">
                Assign lessons and view progress reports for your neurodiverse learners.
              </p>
              
              <div className="text-left space-y-2">
                <h3 className="font-medium text-gray-900 mb-2">Tools for you:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Assign interactive algebra lessons</li>
                  <li>• View completion and time-on-task data</li>
                  <li>• Track student mastery levels</li>
                  <li>• Export progress reports</li>
                  <li>• Monitor accessibility tool usage</li>
                  <li>• Understand student learning patterns</li>
                </ul>
              </div>

              <button className="w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500">
                View Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Demo Info */}
        <div className="bg-white/80 backdrop-blur rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Settings className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Demo Information</h3>
          </div>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            This is a demonstration of evidence-based UDL features for neurodiverse learners. 
            All data is mock data for demo purposes. The app includes interactive lessons on solving 
            simple equations (x+3=7, 2x=8, x/3=5) with full accessibility support.
          </p>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mt-8 bg-gray-900 text-white rounded-xl p-6">
          <h3 className="font-medium mb-3">Keyboard Shortcuts (during lessons)</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div>
              <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">F</kbd>
              <span className="ml-2">Focus Mode</span>
            </div>
            <div>
              <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">R</kbd>
              <span className="ml-2">Toggle Ruler</span>
            </div>
            <div>
              <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">+/-</kbd>
              <span className="ml-2">Text Size</span>
            </div>
            <div>
              <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Ctrl+←→</kbd>
              <span className="ml-2">Move Ruler</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}