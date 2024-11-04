import { useState } from 'react';
import { LessonCardProps } from '../types';
import { formatDateTime } from '@/utils/dateFormat';

// Helper function for consistent date formatting
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export default function LessonCard({
  lesson,
  userRole,
  onRescheduleRequest,
  onAcceptReschedule,
  onDeclineReschedule,
  onDelete,
  onEdit,
  onConfirmLesson,
  onUndoConfirmLesson
}: LessonCardProps) {
  const [newDateTime, setNewDateTime] = useState('');
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLesson, setEditedLesson] = useState({
    studentName: lesson.studentName,
    tutorName: lesson.tutorName,
    dateTime: lesson.dateTime
  });

  console.log('Rendering LessonCard - Status:', lesson.status); // Debug log

  const handleRescheduleRequest = () => {
    if (newDateTime) {
      onRescheduleRequest(lesson.id, newDateTime);
      setNewDateTime('');
      setShowRescheduleForm(false);
    }
  };

  const handleSaveEdit = () => {
    if (onEdit) {
      onEdit(lesson.id, editedLesson);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedLesson({
      studentName: lesson.studentName,
      tutorName: lesson.tutorName,
      dateTime: lesson.dateTime
    });
    setIsEditing(false);
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="space-y-2">
        <p><strong>Student:</strong> {lesson.studentName}</p>
        <p><strong>Tutor:</strong> {lesson.tutorName}</p>
        <p><strong>Scheduled Time:</strong> {lesson.dateTime}</p>
        <p><strong>Status:</strong> {lesson.status}</p>
        
        <div className="flex gap-2">
          {userRole === 'student' && (
            <>
              {lesson.status === 'confirmed' ? (
                <button 
                  onClick={() => onUndoConfirmLesson?.(lesson.id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  Undo Confirm
                </button>
              ) : (
                <button 
                  onClick={() => onConfirmLesson(lesson.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Confirm
                </button>
              )}
            </>
          )}
          
          {/* Other buttons */}
        </div>
      </div>
    </div>
  );
}
