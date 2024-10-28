import { create } from 'zustand';
import { FeedEvent, Lesson } from '@/types';

interface LessonStore {
  lessons: Lesson[];
  feedEvents: FeedEvent[];
  addFeedEvent: (event: Omit<FeedEvent, 'id' | 'timestamp'>) => void;
  updateLesson: (lessonId: string, updates: Partial<Lesson>) => void;
}

export const useLessonStore = create<LessonStore>((set) => ({
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
      tutorName: 'Jane Tutor',
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
  }))
}));