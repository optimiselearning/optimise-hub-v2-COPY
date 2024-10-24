import React from 'react';

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

interface LessonCardProps {
  lesson: Lesson;
  userRole: UserRole;
  onRequestReschedule: (lessonId: string, dateTime: string) => void;
}

export default function LessonCard({ 
  lesson, 
  userRole,
  onRequestReschedule 
}: LessonCardProps) {
  const isMyRequest = lesson.rescheduleRequest?.requestedBy === userRole;
  
  // Format date consistently using UTC to avoid hydration issues
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="border border-black/10 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">
            {userRole === 'tutor' ? lesson.studentName : lesson.tutorName}
          </p>
          <p className="text-gray-600">
            {formatDate(lesson.dateTime)}
          </p>
        </div>
        
        <div>
          {lesson.rescheduleRequest ? (
            <div className="text-sm">
              {isMyRequest ? (
                <span className="text-gray-600">Reschedule Requested</span>
              ) : (
                <button 
                  className="border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-colors"
                  onClick={() => lesson.rescheduleRequest && onRequestReschedule(lesson.id, lesson.rescheduleRequest.proposedDateTime)}
                >
                  Accept New Time
                </button>
              )}
            </div>
          ) : (
            <button 
              className="border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-colors"
              onClick={() => {
                const newDate = new Date(lesson.dateTime);
                newDate.setDate(newDate.getDate() + 1);
                onRequestReschedule(lesson.id, newDate.toISOString());
              }}
            >
              Request Reschedule
            </button>
          )}
        </div>
      </div>
    </div>
  );
}