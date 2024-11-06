'use client';

import { useEffect, useState } from 'react';
import { useLessonStore } from '@/store/lessonStore';
import { FeedEvent, UserRole } from '@/types';
import { CheckCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Popover } from '@headlessui/react';
import { useResolvedEvents } from '@/contexts/ResolvedEventsContext';
// Removed the Tooltip import due to the error

// Helper function for consistent date formatting
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}
export default function UserFeed() {
  const { feedEvents, clearFeedEvents } = useLessonStore();
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const { resolvedEvents, setResolvedEvents } = useResolvedEvents();

  useEffect(() => {
    // Remove the test events logic, just set unresolved events as expanded
    const unresolvedEvents = feedEvents
      .filter(event => !resolvedEvents.has(event.id))
      .map(event => event.id);
    setExpandedEvents(new Set(unresolvedEvents));
  }, [feedEvents, resolvedEvents]);

  const toggleExpand = (eventId: string) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const toggleResolved = (eventId: string) => {
    const newSet = new Set(resolvedEvents);
    if (newSet.has(eventId)) {
      newSet.delete(eventId);
    } else {
      newSet.add(eventId);
      setExpandedEvents(prev => {
        const newExpandedSet = new Set(prev);
        newExpandedSet.delete(eventId);
        return newExpandedSet;
      });
    }
    setResolvedEvents(newSet);
    localStorage.setItem('resolvedEvents', JSON.stringify(Array.from(newSet)));
  };

  const resolveAll = () => {
    const newSet = new Set(resolvedEvents);
    feedEvents.forEach(event => {
      newSet.add(event.id);
    });
    setResolvedEvents(newSet);
    localStorage.setItem('resolvedEvents', JSON.stringify(Array.from(newSet)));
    
    // Clear all expanded states
    setExpandedEvents(new Set());
  };

  const clearAll = () => {
    clearFeedEvents();
    setExpandedEvents(new Set());
    setResolvedEvents(new Set());
    localStorage.setItem('resolvedEvents', JSON.stringify([]));
  };

  return (
    <main className="py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Activity Feed</h1>
        {feedEvents.length > 0 && (
          <div className="space-x-2">
            <button
              onClick={resolveAll}
              className="px-2 py-1 text-sm font-bold text-black bg-white border border-black hover:bg-black hover:text-white transition-colors"
            >
              Resolve All
            </button>
            <button
              onClick={clearAll}
              className="px-2 py-1 text-sm font-bold text-white bg-black border border-black hover:bg-white hover:text-black transition-colors"
            >
              Clear Feed
            </button>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {feedEvents.map(event => (
          <div 
            key={event.id} 
            className={`border border-black shadow-md p-4 transition-all duration-200 ${
              resolvedEvents.has(event.id) ? 'bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'
            }`}
            onClick={(e) => {
              // Prevent toggling when clicking the resolve button
              if (!(e.target as HTMLElement).closest('button')) {
                toggleExpand(event.id);
              }
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-lg">
                    {event.action === 'reschedule_requested' && 'Reschedule Requested'}
                    {event.action === 'reschedule_accepted' && 'Reschedule Accepted'}
                    {event.action === 'reschedule_declined' && 'Reschedule Declined'}
                    {event.action === 'lesson_confirmed' && 'Lesson Confirmed'}
                    {event.action === 'lesson_unconfirmed' && 'Lesson Unconfirmed'}
                  </p>
                  <div className="flex items-center space-x-2">
                    {/* <p className="text-sm text-gray-500">
                      {formatDate(event.timestamp)}
                    </p> */}
                    <button
                      onClick={() => toggleExpand(event.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedEvents.has(event.id) ? (
                        <ChevronUpIcon className="h-5 w-5" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-black">
                <span className="font-semibold">By:</span> <span className="capitalize">{event.initiatedBy}</span>
                </p>
                {/* <div className="my-4">
                  <div><span className="font-medium">Student:</span> {event.details.studentName}</div>
                  <div><span className="font-medium">Tutor:</span> {event.details.tutorName}</div>
                </div> */}
                {/* {event.details.oldDateTime && event.details.newDateTime && !expandedEvents.has(event.id) && (
                  <div className="mt-2 text-sm">
                    <div><span className="font-medium">Original:</span> {formatDate(event.details.oldDateTime)}</div>
                    <div><span className="font-medium">Requested:</span> {formatDate(event.details.newDateTime)}</div>
                  </div>
                )} */}
              </div>
              <div className="ml-4">
                <button
                  onClick={() => toggleResolved(event.id)}
                  className={`p-1 rounded-full ${
                    resolvedEvents.has(event.id) 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <CheckCircleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-black mb-2">
             <span className="font-semibold text-black">Time:</span> {formatDate(event.timestamp)}
            </p>
            {expandedEvents.has(event.id) && !resolvedEvents.has(event.id) && (
              <div className="border-t border-black pt-2">
                <div>
                  <span className="font-semibold text-lg decoration-black decoration-2">
                    Lesson details
                  </span>
                  <div className="mt-2">
                    <div><span className="font-semibold">Student:</span> {event.details.studentName}</div>
                    <div><span className="font-semibold">Tutor:</span> {event.details.tutorName}</div>
                  </div>
                  {event.details.oldDateTime && event.details.newDateTime && (
                    <div className="mt-2 text-sm">
                      <div><span className="text-black font-semibold">Original:</span> <span className="text-black"> {formatDate(event.details.oldDateTime)}</span></div>
                      <div><span className="text-black font-semibold">Requested:</span> <span className="text-black"> {formatDate(event.details.newDateTime)}</span></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
function addTestEvents() {
  const { addFeedEvent } = useLessonStore();

  // Add some sample feed events
  const testEvents = [
    {
      action: 'reschedule_requested',
      lessonId: 'test-lesson-1',
      initiatedBy: 'student',
      details: {
        studentName: 'John Doe',
        tutorName: 'Jane Smith',
        oldDateTime: new Date(Date.now() - 86400000).toISOString(), // yesterday
        newDateTime: new Date(Date.now() + 86400000).toISOString() // tomorrow
      }
    },
    {
      action: 'lesson_created',
      lessonId: 'test-lesson-2',
      initiatedBy: 'admin',
      details: {
        studentName: 'Alice Johnson',
        tutorName: 'Bob Wilson',
        dateTime: new Date(Date.now() + 172800000).toISOString() // day after tomorrow
      }
    }
  ];

  // Get addFeedEvent from the store
  const store = useLessonStore.getState();
  // Add each test event to the feed
  testEvents.forEach(event => {
    const { action, initiatedBy, ...rest } = event;
    store.addFeedEvent({ ...rest, action: action as "reschedule_requested" | "reschedule_accepted" | "reschedule_declined", initiatedBy: initiatedBy as UserRole });
  });
}
