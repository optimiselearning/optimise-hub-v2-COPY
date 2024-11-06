// src/app/(dashboard)/tutor/page.tsx
'use client';

import { useLessonStore } from '@/store/lessonStore';
import LessonCard from '../../../components/LessonCard';

export default function TutorPage() {
  const { lessons, addFeedEvent, updateLesson } = useLessonStore();

  const handleRescheduleRequest = (lessonId: string, newDateTime: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    updateLesson(lessonId, {
      rescheduleRequest: {
        proposedDateTime: newDateTime,
        requestedBy: 'tutor'
      }
    });

    addFeedEvent({
      action: 'reschedule_requested',
      lessonId,
      initiatedBy: 'tutor',
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

    updateLesson(lessonId, { 
      dateTime: lesson.rescheduleRequest.proposedDateTime, 
      rescheduleRequest: undefined 
    });

    addFeedEvent({
      action: 'reschedule_accepted',
      lessonId,
      initiatedBy: 'tutor',
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

    updateLesson(lessonId, { rescheduleRequest: undefined });

    addFeedEvent({
      action: 'reschedule_declined',
      lessonId,
      initiatedBy: 'tutor',
      details: {
        studentName: lesson.studentName,
        tutorName: lesson.tutorName,
        oldDateTime: lesson.dateTime,
        newDateTime: lesson.rescheduleRequest.proposedDateTime
      }
    });
  };

  const handleConfirmLesson = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    updateLesson(lessonId, { 
      status: 'confirmed'
    });

    addFeedEvent({
      action: 'lesson_confirmed',
      lessonId,
      initiatedBy: 'tutor',
      details: {
        studentName: lesson.studentName,
        tutorName: lesson.tutorName,
        dateTime: lesson.dateTime
      }
    });
  };

  const handleUndoConfirmLesson = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson || lesson.status !== 'confirmed') return;

    updateLesson(lessonId, { 
      status: 'pending'
    });

    addFeedEvent({
      action: 'lesson_unconfirmed',
      lessonId,
      initiatedBy: 'tutor',
      details: {
        studentName: lesson.studentName,
        tutorName: lesson.tutorName,
        dateTime: lesson.dateTime
      }
    });
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
            onConfirmLesson={handleConfirmLesson}
            onUndoConfirmLesson={handleUndoConfirmLesson}
          />
        ))}
      </div>
    </div>
  );
}
