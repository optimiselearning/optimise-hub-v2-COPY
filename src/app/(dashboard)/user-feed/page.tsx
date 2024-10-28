'use client';

import { useEffect, useState } from 'react';
import { useLessonStore } from '@/store/lessonStore';
import { FeedEvent } from '@/types';
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
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

export default function UserFeed() {
  const { feedEvents, addTestEvents } = useLessonStore();
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const { resolvedEvents, setResolvedEvents } = useResolvedEvents();

  useEffect(() => {
    // Only add test events if there are none
    const hasAddedEvents = localStorage.getItem('hasAddedEvents');
    if (!hasAddedEvents && feedEvents.length === 0) {
      addTestEvents();
      localStorage.setItem('hasAddedEvents', 'true');
    }
  }, [feedEvents.length, addTestEvents]);

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

  return (
    <main className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Activity Feed</h1>
        {feedEvents.length > 0 && (
          <button
            onClick={resolveAll}
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-black/80 transition-colors"
          >
            Resolve All
          </button>
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
              <div className="flex items-start space-x-3">
                <div 
                  className="relative group"
                  onMouseEnter={() => {
                    const button = document.getElementById(`popover-button-${event.id}`);
                    if (button) {
                      (button as HTMLButtonElement).click();
                    }
                  }}
                  onMouseLeave={() => {
                    const button = document.getElementById(`popover-button-${event.id}`);
                    if (button) {
                      (button as HTMLButtonElement).click();
                    }
                  }}
                >
                  <Popover>
                    {({ close }) => (
                      <>
                        <Popover.Button id={`popover-button-${event.id}`} as="div">
                          <button
                            onClick={() => {
                              toggleResolved(event.id);
                              close();
                            }}
                            className={`mt-1 relative ${
                              resolvedEvents.has(event.id) ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'
                            }`}
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        </Popover.Button>

                        <Popover.Panel className="absolute z-10 px-2 py-1 -mt-1 -mr-1 text-xs text-white bg-black rounded shadow-lg">
                          {resolvedEvents.has(event.id) ? 'Mark unresolved' : 'Mark resolved'}
                        </Popover.Panel>
                      </>
                    )}
                  </Popover>
                </div>
                <div>
                  <p className="font-semibold">
                    {event.action === 'reschedule_requested' && 'Reschedule Requested'}
                    {event.action === 'reschedule_accepted' && 'Reschedule Accepted'}
                    {event.action === 'reschedule_declined' && 'Reschedule Declined'}
                  </p>
                  <p className="text-sm text-gray-600 pb-2">
                    By: <span className="capitalize">{event.initiatedBy}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500">
                  {formatDate(event.timestamp)}
                </p>
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
            {expandedEvents.has(event.id) && !resolvedEvents.has(event.id) && (
              <div className="border-t border-black pt-2">
                <div>
                  <span className="font-semibold text-lg underline underline-offset-2 decoration-black decoration-2">
                    Lesson details
                  </span>
                  <div className="mt-2">
                    <div><span className="font-semibold">Student:</span> {event.details.studentName}</div>
                    <div><span className="font-semibold">Tutor:</span> {event.details.tutorName}</div>
                  </div>
                  {event.details.oldDateTime && event.details.newDateTime && (
                    <div className="mt-2 text-sm">
                      <div><span className="font-semibold">Original:</span> <span className="text-black"> {formatDate(event.details.oldDateTime)}</span></div>
                      <div><span className="font-semibold">Requested:</span> <span className="text-black"> {formatDate(event.details.newDateTime)}</span></div>
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
