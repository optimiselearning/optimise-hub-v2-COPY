// src/app/(dashboard)/admin/page.tsx
'use client';

import { useState } from 'react';
import LessonCard from '../../../components/LessonCard';
import { Lesson, FeedEvent } from '@/types';

export default function AdminPage() {
  const [lessons, setLessons] = useState<Lesson[]>([
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
      dateTime: '2024-10-26T16:00:00',
      rescheduleRequest: {
        proposedDateTime: '2024-10-27T16:00:00',
        requestedBy: 'tutor'
      }
    }
  ]);
  
  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>([]);

  const addFeedEvent = (event: Omit<FeedEvent, 'id' | 'timestamp'>) => {
    const newEvent: FeedEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setFeedEvents(prev => [newEvent, ...prev]);
  };

  const handleRescheduleRequest = (lessonId: string, newDateTime: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    setLessons(prevLessons => prevLessons.map(lesson => 
      lesson.id === lessonId
        ? {
            ...lesson,
            rescheduleRequest: {
              proposedDateTime: newDateTime,
              requestedBy: 'admin'
            }
          }
        : lesson
    ));

    addFeedEvent({
      action: 'reschedule_requested',
      lessonId,
      initiatedBy: 'admin',
      details: {
        studentName: lesson.studentName,
        tutorName: lesson.tutorName,
        oldDateTime: lesson.dateTime,
        newDateTime
      }
    });
  };

  const handleAcceptReschedule = (lessonId: string) => {
    setLessons(prevLessons => prevLessons.map(lesson =>
      lesson.id === lessonId
        ? { ...lesson, dateTime: lesson.rescheduleRequest!.proposedDateTime, rescheduleRequest: undefined }
        : lesson
    ));
    console.log(`Admin: Reschedule request for lesson ${lessonId} has been accepted.`);
  };

  const handleDeclineReschedule = (lessonId: string) => {
    setLessons(prevLessons => prevLessons.map(lesson =>
      lesson.id === lessonId
        ? { ...lesson, rescheduleRequest: undefined }
        : lesson
    ));
    console.log(`Admin: Reschedule request for lesson ${lessonId} has been declined.`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="space-y-4">
        {lessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            userRole="admin"
            onRescheduleRequest={handleRescheduleRequest}
            onAcceptReschedule={handleAcceptReschedule}
            onDeclineReschedule={handleDeclineReschedule}
          />
        ))}
      </div>
    </div>
  );
}
