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
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export type LessonCardProps = {
  lesson: Lesson;
  userRole: 'student' | 'tutor' | 'admin';
  onRescheduleRequest: (lessonId: string, newDateTime: string) => void;
  onAcceptReschedule?: (lessonId: string) => void;
  onDeclineReschedule?: (lessonId: string) => void;
  onDelete?: (lessonId: string) => void;
  onEdit?: (lessonId: string, updatedLesson: Partial<Lesson>) => void;
  onConfirmLesson?: (lessonId: string) => void;
  onUndoConfirmLesson?: (lessonId: string) => void;
};

export interface FeedEvent {
  id: string;
  timestamp: string;
  action: 'reschedule_requested' | 'reschedule_accepted' | 'reschedule_declined' | 'lesson_deleted' | 'lesson_updated' | 'lesson_confirmed' | 'lesson_unconfirmed'; 
  lessonId: string;
  initiatedBy: UserRole;
  resolved?: boolean;
  details: {
    studentName: string;
    tutorName: string;
    oldDateTime?: string;
    newDateTime?: string;
    dateTime?: string;
  };
}
