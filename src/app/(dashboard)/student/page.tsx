// src/app/(dashboard)/student/page.tsx
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

export default function StudentPage() {
  const [lessons] = useState<Lesson[]>([
    {
      id: '1',
      studentName: 'John Student',
      tutorName: 'Mary Tutor',
      dateTime: '2024-10-25T15:00:00'
      // rescheduleRequest is undefined by default
    },
    {
      id: '2',
      studentName: 'John Student',
      tutorName: 'Bob Teacher',
      dateTime: '2024-10-26T16:00:00',
      rescheduleRequest: {
        proposedDateTime: '2024-10-27T16:00:00',
        requestedBy: 'tutor'
      }
    }
  ]);

  const handleReschedule = (lessonId: string, newDateTime: string) => {
    console.log('Requesting reschedule:', { lessonId, newDateTime });
    // Will add actual functionality later
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Lessons</h1>
      <div className="space-y-4">
        {lessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            userRole="student"
            onRequestReschedule={handleReschedule}
          />
        ))}
      </div>
    </div>
  );
}