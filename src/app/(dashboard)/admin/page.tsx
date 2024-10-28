// src/app/(dashboard)/admin/page.tsx
'use client';

import { useLessonStore } from '@/store/lessonStore';
import LessonCard from '../../../components/LessonCard';
import { Lesson, FeedEvent } from '@/types';
import { useState } from 'react';
export default function AdminPage() {
  const { lessons, createLesson, updateLesson, deleteLesson } = useLessonStore();

  // Example function to create a new lesson
  const handleCreateLesson = () => {
    createLesson({
      studentName: 'New Student',
      tutorName: 'New Tutor',
      dateTime: new Date().toISOString()
    });
  };

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

    updateLesson(lessonId, {
      rescheduleRequest: {
        proposedDateTime: newDateTime,
        requestedBy: 'admin'
      }
    });

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
    updateLesson(lessonId, {
      dateTime: lessons.find(l => l.id === lessonId)!.rescheduleRequest!.proposedDateTime,
      rescheduleRequest: undefined
    });
    console.log(`Admin: Reschedule request for lesson ${lessonId} has been accepted.`);
  };

  const handleDeclineReschedule = (lessonId: string) => {
    updateLesson(lessonId, {
      rescheduleRequest: undefined
    });
    console.log(`Admin: Reschedule request for lesson ${lessonId} has been declined.`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <button 
        onClick={handleCreateLesson}
        className="mb-4 px-2 py-1 bg-white border border-black font-semibold text-black text-sm hover:bg-black hover:text-white"
      >
        Add New Lesson
      </button>
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
