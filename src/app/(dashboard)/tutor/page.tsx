// src/app/(dashboard)/tutor/page.tsx
'use client';

import { useState } from 'react';
import LessonCard from '../../../components/LessonCard';

type UserRole = 'student' | 'tutor';

interface Lesson {
  id: string;
  studentName: string;
  tutorName: string;
  dateTime: string;
  rescheduleRequest?: {
    proposedDateTime: string;
    requestedBy: UserRole;
  };
}

export default function TutorPage() {
  const [lessons] = useState<Lesson[]>([
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

  const handleReschedule = (lessonId: string, newDateTime: string) => {
    console.log('Requesting reschedule:', { lessonId, newDateTime });
    // Will add actual functionality later
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
            onRequestReschedule={handleReschedule}
          />
        ))}
      </div>
    </div>
  );
}