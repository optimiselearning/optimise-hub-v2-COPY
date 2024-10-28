import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FeedEvent, Lesson } from '@/types';

interface LessonStore {
  lessons: Lesson[];
  feedEvents: FeedEvent[];
  addFeedEvent: (event: Omit<FeedEvent, 'id' | 'timestamp'>) => void;
  updateLesson: (lessonId: string, updates: Partial<Lesson>) => void;
  addTestEvents: () => void;
}

export const useLessonStore = create<LessonStore>()(
  persist(
    (set) => ({
      lessons: [
        {
          id: '1',
          studentName: 'Alice Student',
          tutorName: 'Jane Tutor',
          dateTime: '2024-10-25T15:00:00'
        },
        {
          id: '2',
          studentName: 'Bob Student',
          tutorName: 'John Tutor',
          dateTime: '2024-10-26T16:00:00'
        }
      ],
      feedEvents: [],
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
      addTestEvents: () => set((state) => ({
        feedEvents: [
          ...state.feedEvents,
          {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            action: 'reschedule_requested',
            lessonId: '2',
            initiatedBy: 'tutor',
            details: {
              studentName: 'Bob Student',
              tutorName: 'John Tutor',
              oldDateTime: '2024-10-26T16:00:00',
              newDateTime: '2024-10-27T16:00:00'
            }
          }
        ]
      }))
    }),
    {
      name: 'lesson-storage'
    }
  )
);
