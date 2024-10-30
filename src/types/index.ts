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
  onDelete?: (lessonId: string) => void;
}

export interface FeedEvent {
  id: string;
  timestamp: string;
  action: 'reschedule_requested' | 'reschedule_accepted' | 'reschedule_declined';
  lessonId: string;
  initiatedBy: UserRole;
  resolved?: boolean;
  details: {
    studentName: string;
    tutorName: string;
    oldDateTime?: string;
    newDateTime?: string;
  };
}
