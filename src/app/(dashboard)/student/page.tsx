'use client';

import { useState } from 'react';
import { useFeed } from '@/contexts/FeedContext';
import LessonCard from '../../../components/LessonCard';
import { Lesson } from '@/types';

export default function StudentPage() {
  const { addFeedEvent } = useFeed();
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: '1',
      studentName: 'Alice Student',
      tutorName: 'Jane Tutor',
      dateTime: '2024-10-25T15:00:00'
    },
    {
      id: '2',
      studentName: 'Alice Student',
      tutorName: 'John Tutor',
      dateTime: '2024-10-26T16:00:00',
      rescheduleRequest: {
        proposedDateTime: '2024-10-27T16:00:00',
        requestedBy: 'tutor'
      }
    }
  ]);

  const handleRescheduleRequest = (lessonId: string, newDateTime: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    setLessons(prevLessons => prevLessons.map(lesson => 
      lesson.id === lessonId
        ? {
            ...lesson,
            rescheduleRequest: {
              proposedDateTime: newDateTime,
              requestedBy: 'student'
            }
          }
        : lesson
    ));

    addFeedEvent({
      action: 'reschedule_requested',
      lessonId,
      initiatedBy: 'student',
      details: {
        studentName: lesson.studentName,
        tutorName: lesson.tutorName,
        oldDateTime: lesson.dateTime,
        newDateTime: newDateTime
      }
    });
  };

  const handleAcceptReschedule = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson || !lesson.rescheduleRequest) return;

    setLessons(prevLessons => prevLessons.map(lesson =>
      lesson.id === lessonId
        ? { ...lesson, dateTime: lesson.rescheduleRequest!.proposedDateTime, rescheduleRequest: undefined }
        : lesson
    ));

    addFeedEvent({
      action: 'reschedule_accepted',
      lessonId,
      initiatedBy: 'student',
      details: {
        studentName: lesson.studentName,
        tutorName: lesson.tutorName,
        oldDateTime: lesson.dateTime,
        newDateTime: lesson.rescheduleRequest.proposedDateTime
      }
    });
  };

  const handleDeclineReschedule = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson || !lesson.rescheduleRequest) return;

    setLessons(prevLessons => prevLessons.map(lesson =>
      lesson.id === lessonId
        ? { ...lesson, rescheduleRequest: undefined }
        : lesson
    ));

    addFeedEvent({
      action: 'reschedule_declined',
      lessonId,
      initiatedBy: 'student',
      details: {
        studentName: lesson.studentName,
        tutorName: lesson.tutorName,
        oldDateTime: lesson.dateTime,
        newDateTime: lesson.rescheduleRequest.proposedDateTime
      }
    });
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
            onRescheduleRequest={handleRescheduleRequest}
            onAcceptReschedule={handleAcceptReschedule}
            onDeclineReschedule={handleDeclineReschedule}
          />
        ))}
      </div>
    </div>
  );
}
