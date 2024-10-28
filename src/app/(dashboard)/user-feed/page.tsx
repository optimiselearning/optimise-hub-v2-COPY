'use client';

import { useEffect } from 'react';
import { useFeed } from '@/contexts/FeedContext';

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
  const { feedEvents, addFeedEvent } = useFeed();

  useEffect(() => {
    if (feedEvents.length === 0) {
      addFeedEvent({
        action: 'reschedule_requested',
        lessonId: '123',
        initiatedBy: 'student',
        details: {
          studentName: 'Test Student',
          tutorName: 'Test Tutor',
          oldDateTime: '2024-10-26T16:00:00',
          newDateTime: '2024-10-27T16:00:00'
        }
      });
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-6">Activity Feed</h1>
      <div className="space-y-4">
        {feedEvents.map(event => (
          <div key={event.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">
                  {event.action === 'reschedule_requested' && 'Reschedule Requested'}
                  {event.action === 'reschedule_accepted' && 'Reschedule Accepted'}
                  {event.action === 'reschedule_declined' && 'Reschedule Declined'}
                </p>
                <p className="text-sm text-gray-600">
                  By: <span className="capitalize">{event.initiatedBy}</span>
                </p>
              </div>
              <p className="text-sm text-gray-500">
                {formatDate(event.timestamp)}
              </p>
            </div>
            <div className="mt-2">
              <p>Lesson: {event.details.studentName} with {event.details.tutorName}</p>
              {event.details.oldDateTime && event.details.newDateTime && (
                <p className="text-sm text-gray-600">
                  From: {formatDate(event.details.oldDateTime)}
                  <br />
                  To: {formatDate(event.details.newDateTime)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
