import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  UDLSettings, 
  defaultUDLSettings, 
  User, 
  Submission, 
  mockSubmissions,
  LessonStep
} from './mockData'

interface SessionState {
  currentUser: User | null
  currentRole: 'student' | 'teacher' | null
  setCurrentUser: (user: User | null) => void
  setCurrentRole: (role: 'student' | 'teacher' | null) => void
}

interface SettingsState {
  settings: UDLSettings
  updateSettings: (updates: Partial<UDLSettings>) => void
  resetSettings: () => void
}

interface ResultsState {
  submissions: Submission[]
  currentSubmission: Submission | null
  focusReflections: string[]
  addSubmission: (submission: Submission) => void
  updateSubmission: (id: string, updates: Partial<Submission>) => void
  startSubmission: (assignmentId: string, studentId: string) => void
  completeSubmission: (id: string) => void
  addFocusReflection: (reflection: string) => void
  clearFocusReflections: () => void
}

interface LessonState {
  currentLessonSteps: LessonStep[]
  currentStepIndex: number
  updateLessonSteps: (steps: LessonStep[]) => void
  completeStep: (stepId: string) => void
  nextStep: () => void
  previousStep: () => void
  resetLesson: () => void
}

interface RecallState {
  recallQueue: RecallItem[]
  addRecallItem: (item: Omit<RecallItem, 'id' | 'createdAt'>) => void
  updateRecallItem: (id: string, confidence: 'again' | 'good' | 'easy') => void
  getReviewItems: () => RecallItem[]
}

interface RecallItem {
  id: string
  question: string
  answer: string
  nextReview: Date
  interval: number
  confidence: 'again' | 'good' | 'easy'
  createdAt: Date
}

type AppState = SessionState & SettingsState & ResultsState & LessonState & RecallState

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Session
      currentUser: null,
      currentRole: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      setCurrentRole: (role) => set({ currentRole: role }),

      // Settings
      settings: defaultUDLSettings,
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      resetSettings: () => set({ settings: defaultUDLSettings }),

      // Results
      submissions: [...mockSubmissions],
      currentSubmission: null,
      focusReflections: [],
      addSubmission: (submission) =>
        set((state) => ({
          submissions: [...state.submissions, submission],
        })),
      updateSubmission: (id, updates) =>
        set((state) => ({
          submissions: state.submissions.map((sub) =>
            sub.id === id ? { ...sub, ...updates } : sub
          ),
          currentSubmission:
            state.currentSubmission?.id === id
              ? { ...state.currentSubmission, ...updates }
              : state.currentSubmission,
        })),
      startSubmission: (assignmentId, studentId) => {
        const newSubmission: Submission = {
          id: `submission-${Date.now()}`,
          assignmentId,
          studentId,
          startedAt: new Date().toISOString(),
          timeOnTask: 0,
          attempts: 0,
          errors: 0,
          score: 0,
          mastery: 'beginner',
          reflections: [],
        }
        set((state) => ({
          submissions: [...state.submissions, newSubmission],
          currentSubmission: newSubmission,
        }))
      },
      completeSubmission: (id) =>
        set((state) => {
          const submission = state.submissions.find((s) => s.id === id)
          if (!submission) return state

          const completedSubmission = {
            ...submission,
            completedAt: new Date().toISOString(),
          }

          return {
            submissions: state.submissions.map((sub) =>
              sub.id === id ? completedSubmission : sub
            ),
            currentSubmission:
              state.currentSubmission?.id === id
                ? completedSubmission
                : state.currentSubmission,
          }
        }),
      addFocusReflection: (reflection) =>
        set((state) => ({
          focusReflections: [...state.focusReflections, reflection],
        })),
      clearFocusReflections: () => set({ focusReflections: [] }),

      // Lesson
      currentLessonSteps: [],
      currentStepIndex: 0,
      updateLessonSteps: (steps) =>
        set({ currentLessonSteps: steps, currentStepIndex: 0 }),
      completeStep: (stepId) =>
        set((state) => ({
          currentLessonSteps: state.currentLessonSteps.map((step) =>
            step.id === stepId ? { ...step, completed: true } : step
          ),
        })),
      nextStep: () =>
        set((state) => ({
          currentStepIndex: Math.min(
            state.currentStepIndex + 1,
            state.currentLessonSteps.length - 1
          ),
        })),
      previousStep: () =>
        set((state) => ({
          currentStepIndex: Math.max(state.currentStepIndex - 1, 0),
        })),
      resetLesson: () => set({ currentLessonSteps: [], currentStepIndex: 0 }),

      // Recall
      recallQueue: [],
      addRecallItem: (item) => {
        const newItem: RecallItem = {
          ...item,
          id: `recall-${Date.now()}`,
          createdAt: new Date(),
          nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
          interval: 1,
        }
        set((state) => ({
          recallQueue: [...state.recallQueue, newItem],
        }))
      },
      updateRecallItem: (id, confidence) =>
        set((state) => {
          const item = state.recallQueue.find((i) => i.id === id)
          if (!item) return state

          let newInterval = item.interval
          let multiplier = 1

          switch (confidence) {
            case 'again':
              multiplier = 0.5
              break
            case 'good':
              multiplier = 2
              break
            case 'easy':
              multiplier = 2.5
              break
          }

          newInterval = Math.max(1, Math.floor(newInterval * multiplier))
          const nextReview = new Date(
            Date.now() + newInterval * 24 * 60 * 60 * 1000
          )

          return {
            recallQueue: state.recallQueue.map((recallItem) =>
              recallItem.id === id
                ? {
                    ...recallItem,
                    confidence,
                    interval: newInterval,
                    nextReview,
                  }
                : recallItem
            ),
          }
        }),
      getReviewItems: () => {
        const now = new Date()
        return get().recallQueue.filter((item) => item.nextReview <= now)
      },
    }),
    {
      name: 'algebra-app-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        currentRole: state.currentRole,
        settings: state.settings,
        submissions: state.submissions,
        recallQueue: state.recallQueue,
      }),
    }
  )
)