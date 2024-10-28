import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FeedEvent, Lesson } from '@/types';

interface LessonStore {
  lessons: Lesson[];
  feedEvents: FeedEvent[];
  createLesson: (lesson: Omit<Lesson, 'id'>) => void;
  deleteLesson: (lessonId: string) => void;
  addFeedEvent: (event: Omit<FeedEvent, 'id' | 'timestamp'>) => void;
  updateLesson: (lessonId: string, updates: Partial<Lesson>) => void;
}

export const useLessonStore = create<LessonStore>()(
  persist(
    (set) => ({
      lessons: [],
      feedEvents: [],
      
      // Add new lesson
      createLesson: (lessonData) => set((state) => ({
        lessons: [...state.lessons, {
          ...lessonData,
          id: Math.random().toString(36).substr(2, 9), // Simple ID generation
        }]
      })),

      // Delete lesson
      deleteLesson: (lessonId) => set((state) => ({
        lessons: state.lessons.filter(lesson => lesson.id !== lessonId)
      })),

      // Existing methods remain the same
      addFeedEvent: (event) => set((state) => ({
        feedEvents: [{
          ...event,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString()
        }, ...state.feedEvents]
      })),

      updateLesson: (lessonId, updates) => set((state) => ({
        lessons: state.lessons.map(lesson =>
          lesson.id === lessonId ? { ...lesson, ...updates } : lesson
        )
      })),
    }),
    {
      name: 'lesson-storage'
    }
  )
);
