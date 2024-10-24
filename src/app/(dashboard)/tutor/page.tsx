// src/app/(dashboard)/tutor/page.tsx
'use client';

import { useState } from 'react';
import LessonCard from '../../../components/LessonCard';
import { Lesson } from '@/types';


export default function TutorPage() {
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: '1',
      studentName: 'Alice Student',
      tutorName: 'Jane Tutor',
      dateTime: '2024-10-25T15:00:00'
      // rescheduleRequest is undefined by default
    },
    {
      id: '2',
      studentName: 'Bob Student',
      tutorName: 'Jane Tutor',
      dateTime: '2024-10-26T16:00:00',
      rescheduleRequest: {
        proposedDateTime: '2024-10-27T16:00:00',
        requestedBy: 'student'
      }
    }
  ]);

  const handleRescheduleRequest = (lessonId: string, newDateTime: string) => {
    setLessons(prevLessons => prevLessons.map(lesson => 
      lesson.id === lessonId
        ? {
            ...lesson,
            rescheduleRequest: {
              proposedDateTime: newDateTime,
              requestedBy: 'tutor'
            }
          }
        : lesson
    ));
  };

  const handleAcceptReschedule = (lessonId: string) => {
    setLessons(prevLessons => prevLessons.map(lesson =>
      lesson.id === lessonId
        ? { ...lesson, dateTime: lesson.rescheduleRequest!.proposedDateTime, rescheduleRequest: undefined }
        : lesson
    ));
  };

  const handleDeclineReschedule = (lessonId: string) => {
    setLessons(prevLessons => prevLessons.map(lesson =>
      lesson.id === lessonId
        ? { ...lesson, rescheduleRequest: undefined }
        : lesson
    ));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Students</h1>
      <div className="space-y-4">
        {lessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            userRole="tutor"
            onRescheduleRequest={handleRescheduleRequest}
            onAcceptReschedule={handleAcceptReschedule}
            onDeclineReschedule={handleDeclineReschedule}
          />
        ))}
      </div>
    </div>
  );
}
