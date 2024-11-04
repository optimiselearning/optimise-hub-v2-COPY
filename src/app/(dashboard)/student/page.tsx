'use client';

import { useLessonStore } from '@/store/lessonStore';
import LessonCard from '../../../components/LessonCard';

export default function StudentPage() {
  const { lessons, addFeedEvent, updateLesson } = useLessonStore();

  const handleRescheduleRequest = (lessonId: string, newDateTime: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    updateLesson(lessonId, {
      rescheduleRequest: {
        proposedDateTime: newDateTime,
        requestedBy: 'student'
      }
    });

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

    updateLesson(lessonId, { 
      dateTime: lesson.rescheduleRequest.proposedDateTime, 
      rescheduleRequest: undefined 
    });

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

    updateLesson(lessonId, { rescheduleRequest: undefined });

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

  const handleConfirmLesson = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    console.log('Before confirm - Lesson status:', lesson.status);

    updateLesson(lessonId, { 
      status: 'confirmed'
    });

    const updatedLesson = lessons.find(l => l.id === lessonId);
    console.log('After confirm - Lesson status:', updatedLesson?.status);

    addFeedEvent({
      action: 'lesson_confirmed',
      lessonId,
      initiatedBy: 'student',
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

    console.log('Before unconfirm - Lesson status:', lesson.status);

    updateLesson(lessonId, { 
      status: 'pending'
    });

    const updatedLesson = lessons.find(l => l.id === lessonId);
    console.log('After unconfirm - Lesson status:', updatedLesson?.status);

    addFeedEvent({
      action: 'lesson_unconfirmed',
      lessonId,
      initiatedBy: 'student',
      details: {
        studentName: lesson.studentName,
        tutorName: lesson.tutorName,
        dateTime: lesson.dateTime
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
            onConfirmLesson={handleConfirmLesson}
            onUndoConfirmLesson={handleUndoConfirmLesson}
          />
        ))}
      </div>
    </div>
  );
}
