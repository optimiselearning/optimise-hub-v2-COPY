export type UserRole = 'student' | 'tutor' | 'admin';

export interface Lesson {
  id: string;
  studentName: string;
  tutorName: string;
  dateTime: string;
  rescheduleRequest?: {
    proposedDateTime: string;
    requestedBy: UserRole;
  };
}

export interface LessonCardProps {
  lesson: Lesson;
  userRole: UserRole;
  onRescheduleRequest: (lessonId: string, newDateTime: string) => void;
  onAcceptReschedule?: (lessonId: string) => void;
  onDeclineReschedule?: (lessonId: string) => void;
}
