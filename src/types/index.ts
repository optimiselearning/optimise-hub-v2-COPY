export type UserRole = 'student' | 'tutor';

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
}
