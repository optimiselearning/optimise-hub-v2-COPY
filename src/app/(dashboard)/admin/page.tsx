// src/app/(dashboard)/admin/page.tsx
'use client';

import { useLessonStore } from '@/store/lessonStore';
import LessonCard from '../../../components/LessonCard';
import { Lesson, FeedEvent } from '@/types';
import { useState } from 'react';

export default function AdminPage() {
  const { lessons, createLesson, updateLesson, deleteLesson } = useLessonStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLesson, setNewLesson] = useState({
    studentName: '',
    tutorName: '',
    dateTime: ''
  });

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLesson.studentName || !newLesson.tutorName || !newLesson.dateTime) {
      alert('Please fill in all fields');
      return;
    }

    createLesson({
      studentName: newLesson.studentName,
      tutorName: newLesson.tutorName,
      dateTime: new Date(newLesson.dateTime).toISOString(),
      studentStatus: 'pending',
      tutorStatus: 'pending'
    });

    // Reset form
    setNewLesson({
      studentName: '',
      tutorName: '',
      dateTime: ''
    });
    setShowAddForm(false);
  };

  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>([]);

  const addFeedEvent = (event: Omit<FeedEvent, 'id' | 'timestamp'>) => {
    const newEvent: FeedEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setFeedEvents(prev => [newEvent, ...prev]);
  };

  const handleRescheduleRequest = (lessonId: string, newDateTime: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    updateLesson(lessonId, {
      rescheduleRequest: {
        proposedDateTime: newDateTime,
        requestedBy: 'admin'
      }
    });

    addFeedEvent({
      action: 'reschedule_requested',
      lessonId,
      initiatedBy: 'admin',
      details: {
        studentName: lesson.studentName,
        tutorName: lesson.tutorName,
        oldDateTime: lesson.dateTime,
        newDateTime
      }
    });
  };

  const handleAcceptReschedule = (lessonId: string) => {
    updateLesson(lessonId, {
      dateTime: lessons.find(l => l.id === lessonId)!.rescheduleRequest!.proposedDateTime,
      rescheduleRequest: undefined
    });
    console.log(`Admin: Reschedule request for lesson ${lessonId} has been accepted.`);
  };

  const handleDeclineReschedule = (lessonId: string) => {
    updateLesson(lessonId, {
      rescheduleRequest: undefined
    });
    console.log(`Admin: Reschedule request for lesson ${lessonId} has been declined.`);
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      deleteLesson(lessonId);
      addFeedEvent({
        action: 'lesson_deleted',
        lessonId,
        initiatedBy: 'admin',
        details: {
          studentName: lessons.find(l => l.id === lessonId)?.studentName || '',
          tutorName: lessons.find(l => l.id === lessonId)?.tutorName || '',
        }
      });
    }
  };

  const handleEditLesson = (lessonId: string, updates: Partial<Lesson>) => {
    updateLesson(lessonId, updates);
    addFeedEvent({
      action: 'lesson_updated',
      lessonId,
      initiatedBy: 'admin',
      details: {
        studentName: updates.studentName || lessons.find(l => l.id === lessonId)?.studentName || '',
        tutorName: updates.tutorName || lessons.find(l => l.id === lessonId)?.tutorName || '',
        newDateTime: updates.dateTime,
      }
    });
  };

  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {!showAddForm ? (
        <button 
          onClick={() => setShowAddForm(true)}
          className="mb-4 px-2 py-1 bg-white border border-black font-semibold text-black text-sm hover:bg-black hover:text-white"
        >
          Add New Lesson
        </button>
      ) : (
        <div className="mb-6 p-4 border border-black">
          <h2 className="text-lg font-semibold mb-4">Add New Lesson</h2>
          <form onSubmit={handleCreateLesson} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student Name</label>
              <input
                type="text"
                value={newLesson.studentName}
                onChange={(e) => setNewLesson(prev => ({ ...prev, studentName: e.target.value }))}
                className="w-full p-2 border border-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tutor Name</label>
              <input
                type="text"
                value={newLesson.tutorName}
                onChange={(e) => setNewLesson(prev => ({ ...prev, tutorName: e.target.value }))}
                className="w-full p-2 border border-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Scheduled Time</label>
              <input
                type="datetime-local"
                value={newLesson.dateTime}
                onChange={(e) => setNewLesson(prev => ({ ...prev, dateTime: e.target.value }))}
                className="w-full p-2 border border-black"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white hover:bg-gray-800"
              >
                Create Lesson
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-black text-black hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {lessons.map(lesson => (
          <div key={lesson.id} className="p-4 border rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p><strong>Student:</strong> {lesson.studentName}</p>
                <p><strong>Tutor:</strong> {lesson.tutorName}</p>
                <p><strong>Scheduled Time:</strong> {new Date(lesson.dateTime).toLocaleString('en-GB', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}</p>
                {editingLessonId === lesson.id && (
                  <input
                    type="datetime-local"
                    defaultValue={new Date(lesson.dateTime).toISOString().slice(0, 16)}
                    onChange={(e) => {
                      handleEditLesson(lesson.id, { 
                        dateTime: new Date(e.target.value).toISOString() 
                      });
                      setEditingLessonId(null); // Close the input after editing
                    }}
                    className="mt-2 p-2 border border-black"
                    autoFocus
                  />
                )}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    // If this lesson is currently being edited, clicking will close it
                    // Otherwise, clicking will open it for editing
                    setEditingLessonId(editingLessonId === lesson.id ? null : lesson.id)
                  }}
                  className="px-2 py-1 bg-white border border-black font-semibold text-black text-sm hover:bg-black hover:text-white"
                >
                  {editingLessonId === lesson.id ? 'Cancel' : 'Edit'}
                </button>
                <button
                  onClick={() => handleDeleteLesson(lesson.id)}
                  className="px-2 py-1 bg-black border border-black font-semibold text-white text-sm hover:bg-white hover:text-black"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
