import { useState } from 'react';
import { LessonCardProps } from '../types';

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

export default function LessonCard({ lesson, userRole, onRescheduleRequest, onAcceptReschedule, onDeclineReschedule }: LessonCardProps) {
  const [newDateTime, setNewDateTime] = useState('');
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  
  const handleRescheduleRequest = () => {
    if (newDateTime) {
      onRescheduleRequest(lesson.id, newDateTime);
      setNewDateTime('');
      setShowRescheduleForm(false);
    }
  };

  return (
    <div className="border p-4 mb-4 rounded-lg">
      <div className="flex justify-between mb-2">
        <div>
          <p className="font-semibold">Student: <span className="font-light">{lesson.studentName}</span></p>
          <p className="font-semibold">Tutor: <span className="font-light">{lesson.tutorName}</span></p>
        </div>
        <div>
          <p className="text-sm">Lesson ID: {lesson.id}</p>
        </div>
      </div>
      <p className="mb-2">Scheduled Time: {formatDate(lesson.dateTime)}</p>
      
      {!lesson.rescheduleRequest ? (
        userRole !== 'admin' && (
          <div className="mt-2">
            {!showRescheduleForm ? (
              <button
                onClick={() => setShowRescheduleForm(true)}
                className="bg-black border border-black hover:bg-white hover:border-black hover:text-black text-white px-4 py-2 rounded"
              >
                Request Reschedule
              </button>
            ) : (
              <div>
                <input
                  type="datetime-local"
                  value={newDateTime}
                  onChange={(e) => setNewDateTime(e.target.value)}
                  className="border p-2 mr-2"
                />
                <button
                  onClick={handleRescheduleRequest}
                  className="text-black bg-white border hover:bg-black hover:text-white border-black px-2 py-1 rounded mr-4"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowRescheduleForm(false)}
                  className="text-black hover:font-semibold"
                >
                  Undo
                </button>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="mt-2 bg-gray-100 p-2 rounded">
          <p className="font-semibold">Pending Reschedule Request</p>
          <p>Proposed Time: {formatDate(lesson.rescheduleRequest.proposedDateTime)}</p>
          <p>Requested by: <span className="capitalize font-semibold">{lesson.rescheduleRequest.requestedBy}</span></p>
          {userRole === 'admin' && (
            <div className="mt-2">
              <button
                onClick={() => onAcceptReschedule && onAcceptReschedule(lesson.id)}
                className="bg-white border border-black hover:bg-black hover:border-black hover:text-white text-black px-4 py-2 rounded mr-2"
              >
                Accept
              </button>
              <button
                onClick={() => onDeclineReschedule && onDeclineReschedule(lesson.id)}
                className="bg-black border border-black hover:bg-white hover:border-black hover:text-black text-white px-4 py-2 rounded"
              >
                Decline
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
