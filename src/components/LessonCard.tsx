import { useState } from 'react';
import { LessonCardProps } from '../types';
import { formatDateTime } from '@/utils/dateFormat';

// Helper function for consistent date formatting
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
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
    <div className="p-4 border shadow-sm">
      <div className="space-y-2">
        <p><strong>Student:</strong> {lesson.studentName}</p>
        <p><strong>Tutor:</strong> {lesson.tutorName}</p>
        <p><strong>Scheduled Time:</strong> {formatDate(lesson.dateTime)}</p>
        <p><strong>Status:</strong> <span className="capitalize italic">{lesson.status}</span></p>
        
        <div className="flex gap-2">
          {userRole === 'student' && !showRescheduleForm && (
            <>
              {lesson.status === 'confirmed' ? (
                <button 
                  onClick={() => onUndoConfirmLesson?.(lesson.id)}
                  className="px-2 py-1 bg-white border border-black font-semibold text-black text-sm hover:bg-black hover:text-white"
                >
                  Undo Confirm
                </button>
              ) : (
                <button 
                  onClick={() => onConfirmLesson(lesson.id)}
                  className="px-2 py-1 bg-white border border-black font-semibold text-black text-sm hover:bg-black hover:text-white"
                >
                  Confirm
                </button>
              )}
            </>
          )}
          
          {showRescheduleForm ? (
            <div className="mt-2">
              <input
                type="datetime-local"
                value={newDateTime}
                onChange={(e) => setNewDateTime(e.target.value)}
                className="p-2 border border-black mr-6"
              />
              <button
                onClick={() => {
                  if (newDateTime) {
                    onRescheduleRequest(lesson.id, newDateTime);
                    setShowRescheduleForm(false);
                    setNewDateTime('');
                  }
                }}
                className="px-2 py-1 bg-white border border-black font-semibold text-black text-sm hover:bg-black hover:text-white"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setShowRescheduleForm(false);
                  setNewDateTime('');
                }}
                className="px-2 py-1 bg-black border border-black font-semibold text-white text-sm hover:bg-white hover:text-black ml-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowRescheduleForm(true)}
              className="px-2 py-1 bg-black border border-black font-semibold text-white text-sm hover:bg-white hover:text-black"
            >
              Reschedule
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
