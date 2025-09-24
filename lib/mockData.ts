export interface User {
  id: string
  name: string
  role: 'student' | 'teacher'
  email: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  content: LessonContent
}

export interface LessonContent {
  steps: LessonStep[]
  videoUrl?: string
  estimatedTime: number
}

export interface LessonStep {
  id: string
  title: string
  description: string
  instruction: string
  type: 'balance' | 'input' | 'multiple-choice'
  equation?: string
  correctAnswer?: string | number
  options?: string[]
  completed?: boolean
}

export interface Assignment {
  id: string
  lessonId: string
  teacherId: string
  title: string
  description: string
  dueDate?: string
  createdAt: string
}

export interface Submission {
  id: string
  assignmentId: string
  studentId: string
  startedAt: string
  completedAt?: string
  timeOnTask: number // in seconds
  attempts: number
  errors: number
  score: number
  mastery: 'beginner' | 'developing' | 'proficient'
  reflections: string[]
}

export interface FocusProfile {
  id: string
  name: string
  userId: string
  settings: UDLSettings
}

export interface UDLSettings {
  fontMode: 'default' | 'dyslexia'
  textSize: number
  letterSpacing: number
  lineHeight: number
  colorOverlay: {
    enabled: boolean
    color: string
    opacity: number
  }
  readingRuler: {
    enabled: boolean
    direction: 'horizontal' | 'vertical'
  }
  highContrast: boolean
  reducedMotion: boolean
  distractionFree: boolean
  ttsRate: number
  focusTimer: {
    enabled: boolean
    duration: number // in minutes
  }
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'teacher-1',
    name: 'Ms. Rodriguez',
    role: 'teacher',
    email: 'rodriguez@school.edu'
  },
  {
    id: 'student-1', 
    name: 'Ava Chen',
    role: 'student',
    email: 'ava@school.edu'
  },
  {
    id: 'student-2',
    name: 'Ben Williams', 
    role: 'student',
    email: 'ben@school.edu'
  },
  {
    id: 'student-3',
    name: 'Noor Patel',
    role: 'student', 
    email: 'noor@school.edu'
  }
]

// Mock Lessons
export const mockLessons: Lesson[] = [
  {
    id: 'algebra-1',
    title: 'Balance the Equation',
    description: 'Learn to solve simple equations by keeping both sides balanced',
    content: {
      estimatedTime: 15,
      steps: [
        {
          id: 'step-0',
          title: 'Getting Started',
          description: 'What is an equation?',
          instruction: 'An equation is like a balance scale. Both sides must be equal. Let\'s practice!',
          type: 'multiple-choice',
          completed: false
        },
        {
          id: 'step-1', 
          title: 'Solve x + 3 = 7',
          description: 'Subtract 3 from both sides',
          instruction: 'To solve this equation, we need to get x by itself. What do we subtract from both sides?',
          type: 'balance',
          equation: 'x + 3 = 7',
          correctAnswer: '3',
          completed: false
        },
        {
          id: 'step-2',
          title: 'Check Your Answer',
          description: 'Substitute x = 4 back into the original equation',
          instruction: 'If x = 4, what is x + 3?',
          type: 'input',
          correctAnswer: 7,
          completed: false
        },
        {
          id: 'step-3a',
          title: 'Try Another: 2x = 8',
          description: 'Divide both sides by 2',
          instruction: 'What number do we divide both sides by?',
          type: 'balance',
          equation: '2x = 8',
          correctAnswer: '2',
          completed: false
        },
        {
          id: 'step-3b',
          title: 'Try Another: x/3 = 5',
          description: 'Multiply both sides by 3',
          instruction: 'What number do we multiply both sides by?',
          type: 'balance',
          equation: 'x/3 = 5',
          correctAnswer: '3',
          completed: false
        }
      ]
    }
  }
]

// Mock Assignments
export const mockAssignments: Assignment[] = [
  {
    id: 'assignment-1',
    lessonId: 'algebra-1',
    teacherId: 'teacher-1',
    title: 'Algebra 1 - Balance the Equation',
    description: 'Complete the guided lesson on solving simple equations',
    createdAt: new Date().toISOString()
  }
]

// Mock Submissions
export const mockSubmissions: Submission[] = [
  {
    id: 'submission-1',
    assignmentId: 'assignment-1',
    studentId: 'student-1',
    startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    timeOnTask: 850, // 14 minutes 10 seconds
    attempts: 1,
    errors: 2,
    score: 85,
    mastery: 'proficient',
    reflections: ['I found the balance scale helpful!', 'The audio explanations were clear']
  },
  {
    id: 'submission-2', 
    assignmentId: 'assignment-1',
    studentId: 'student-2',
    startedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    timeOnTask: 420, // 7 minutes (in progress)
    attempts: 2,
    errors: 4,
    score: 0,
    mastery: 'developing',
    reflections: ['Need more practice with division']
  },
  {
    id: 'submission-3',
    assignmentId: 'assignment-1', 
    studentId: 'student-3',
    startedAt: new Date().toISOString(),
    timeOnTask: 0,
    attempts: 0,
    errors: 0,
    score: 0,
    mastery: 'beginner',
    reflections: []
  }
]

// Default UDL Settings
export const defaultUDLSettings: UDLSettings = {
  fontMode: 'default',
  textSize: 1,
  letterSpacing: 0,
  lineHeight: 1.5,
  colorOverlay: {
    enabled: false,
    color: '#fef3c7', // pale yellow
    opacity: 0.3
  },
  readingRuler: {
    enabled: false,
    direction: 'horizontal'
  },
  highContrast: false,
  reducedMotion: false,
  distractionFree: false,
  ttsRate: 1,
  focusTimer: {
    enabled: false,
    duration: 25 // 25 minutes default
  }
}

// Mock Focus Profiles
export const mockFocusProfiles: FocusProfile[] = [
  {
    id: 'profile-1',
    name: 'Dyslexia Support',
    userId: 'student-1',
    settings: {
      ...defaultUDLSettings,
      fontMode: 'dyslexia',
      textSize: 1.2,
      letterSpacing: 0.05,
      lineHeight: 1.8,
      readingRuler: {
        enabled: true,
        direction: 'horizontal'
      }
    }
  },
  {
    id: 'profile-2',
    name: 'High Contrast Focus',
    userId: 'student-2',
    settings: {
      ...defaultUDLSettings,
      highContrast: true,
      distractionFree: true,
      focusTimer: {
        enabled: true,
        duration: 15
      }
    }
  }
]