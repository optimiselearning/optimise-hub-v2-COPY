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
      dateTime: new Date(newLesson.dateTime).toISOString()
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
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tutor Name</label>
              <input
                type="text"
                value={newLesson.tutorName}
                onChange={(e) => setNewLesson(prev => ({ ...prev, tutorName: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Scheduled Time</label>
              <input
                type="datetime-local"
                value={newLesson.dateTime}
                onChange={(e) => setNewLesson(prev => ({ ...prev, dateTime: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded"
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
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            userRole="admin"
            onRescheduleRequest={handleRescheduleRequest}
            onAcceptReschedule={handleAcceptReschedule}
            onDeclineReschedule={handleDeclineReschedule}
          />
        ))}
      </div>
    </div>
  );
}
