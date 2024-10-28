'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface FeedEvent {
  id: string;
  timestamp: string;
  action: 'reschedule_requested' | 'reschedule_accepted' | 'reschedule_declined';
  lessonId: string;
  initiatedBy: 'student' | 'tutor' | 'admin';
  details: {
    studentName: string;
    tutorName: string;
    oldDateTime?: string;
    newDateTime?: string;
  };
}

interface FeedContextType {
  feedEvents: FeedEvent[];
  addFeedEvent: (event: Omit<FeedEvent, 'id' | 'timestamp'>) => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: ReactNode }) {
  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>([]);

  const addFeedEvent = (event: Omit<FeedEvent, 'id' | 'timestamp'>) => {
    const newEvent: FeedEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    setFeedEvents(prev => [newEvent, ...prev]);
  };

  return (
    <FeedContext.Provider value={{ feedEvents, addFeedEvent }}>
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const context = useContext(FeedContext);
  if (context === undefined) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
}
